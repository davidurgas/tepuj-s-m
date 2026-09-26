import { SignaturePad } from './signature.js';
import { contractDocument, documentToHtml, money, fmtDate, fmtDateTime, customerName } from './contract.js';

// ---------- Pomocníci ----------

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const app = $('#app');

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

let toastTimer;
function toast(msg, type = 'info') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.className = ''), 4000);
}

async function api(method, url, body) {
  const opts = { method, headers: {} };
  if (body instanceof FormData) opts.body = body;
  else if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !url.endsWith('/login')) {
    location.hash = '#/login';
    throw new Error('Prihlás sa znova.');
  }
  if (!res.ok) throw new Error(data.error || `Chyba ${res.status}`);
  return data;
}

// Spustí asynchrónnu akciu na tlačidle a počas nej ho zablokuje.
async function busy(btn, label, fn) {
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> ${esc(label)}`;
  try {
    return await fn();
  } catch (e) {
    toast(e.message, 'error');
    return undefined;
  } finally {
    if (btn.isConnected) {
      btn.disabled = false;
      btn.innerHTML = orig;
    }
  }
}

const today = () => new Date().toISOString().slice(0, 10);
const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const STATUS = {
  signed: ['Čaká na platbu', 'warn'],
  active: ['Požičané', 'info'],
  returned: ['Vrátené', 'ok'],
};
const badge = (r) => {
  const overdue = r.status === 'active' && r.return_due && r.return_due < today();
  const [label, cls] = overdue ? ['Po termíne', 'danger'] : STATUS[r.status] || [r.status, ''];
  return `<span class="badge ${cls}">${label}</span>`;
};

// Fotku z fotoaparátu zmenšíme (rýchlejšie OCR aj upload, menej miesta).
async function compressImage(file, max = 2000) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * scale);
  c.height = Math.round(bmp.height * scale);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close?.();
  return new Promise((resolve) => c.toBlob(resolve, 'image/jpeg', 0.88));
}

const icon = {
  back: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  gear: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  plus: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6.5"/></svg>',
};

function screen({ title, back, actions = '', body, footer = '' }) {
  app.innerHTML = `
    <header class="bar">
      ${back ? `<a class="icon-btn" href="${back}" aria-label="Späť">${icon.back}</a>` : '<span class="brand-dot"></span>'}
      <h1>${esc(title)}</h1>
      <div class="bar-actions">${actions}</div>
    </header>
    <main class="content">${body}</main>
    ${footer ? `<footer class="sticky-footer">${footer}</footer>` : ''}`;
  window.scrollTo(0, 0);
}

// ---------- Stav appky ----------

let state = { settings: null, machines: [], me: null };
let cleanup = [];
const onLeave = (fn) => cleanup.push(fn);

async function loadBasics(force = false) {
  if (!state.settings || force) {
    [state.settings, state.machines] = await Promise.all([api('GET', '/api/settings'), api('GET', '/api/machines')]);
  }
}

// ---------- Router ----------

const routes = [
  [/^#\/login$/, viewLogin],
  [/^#\/?$/, viewList],
  [/^#\/new$/, viewWizard],
  [/^#\/r\/(\d+)$/, viewDetail],
  [/^#\/r\/(\d+)\/pay$/, viewPay],
  [/^#\/r\/(\d+)\/return$/, viewReturn],
  [/^#\/settings$/, viewSettings],
];

async function router() {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  const hash = location.hash || '#/';
  if (!state.me) state.me = await api('GET', '/api/me').catch(() => ({ loggedIn: false }));
  if (!state.me.loggedIn && hash !== '#/login') {
    location.hash = '#/login';
    return;
  }
  for (const [re, view] of routes) {
    const m = hash.match(re);
    if (m) {
      try {
        await view(...m.slice(1));
      } catch (e) {
        screen({ title: 'Chyba', back: '#/', body: `<div class="card"><p>${esc(e.message)}</p></div>` });
      }
      return;
    }
  }
  location.hash = '#/';
}

window.addEventListener('hashchange', router);
router();

// ---------- Prihlásenie ----------

function viewLogin() {
  app.innerHTML = `
    <main class="login">
      <div class="login-card">
        <div class="logo">${icon.check}</div>
        <h1>Požičovňa tepovačov</h1>
        <form id="login-form">
          <label class="field"><span>Heslo</span>
            <input type="password" name="password" autocomplete="current-password" required autofocus>
          </label>
          <button class="btn primary block" type="submit">Prihlásiť sa</button>
        </form>
      </div>
    </main>`;
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    await busy(btn, 'Prihlasujem…', async () => {
      await api('POST', '/api/login', { password: e.target.password.value });
      state.me = null;
      location.hash = '#/';
    });
  });
}

// ---------- Zoznam požičaní ----------

let listFilter = 'open';

async function viewList() {
  await loadBasics();
  const s = state.settings;
  const setupMissing = !s.company_name || !s.owner_signature || !state.machines.length;
  screen({
    title: 'Požičovňa',
    actions: `<a class="icon-btn" href="#/settings" aria-label="Nastavenia">${icon.gear}</a>`,
    body: `
      ${setupMissing ? `<a class="notice warn" href="#/settings"><strong>Dokonči nastavenie:</strong> ${[
        !s.company_name && 'údaje firmy',
        !s.owner_signature && 'tvoj podpis',
        !state.machines.length && 'stroje',
      ].filter(Boolean).join(', ')} →</a>` : ''}
      ${state.me.mailConfigured ? '' : '<div class="notice warn">Odosielanie emailov nie je nastavené (SMTP v súbore .env).</div>'}
      <a class="btn primary block big" href="#/new">${icon.plus} Nové požičanie</a>
      <div class="search-row">
        <input type="search" id="q" placeholder="Hľadať meno, telefón, č. zmluvy…" autocomplete="off">
      </div>
      <div class="chips" role="tablist">
        ${[['open', 'Požičané'], ['returned', 'Vrátené'], ['', 'Všetky']].map(([v, l]) => `<button class="chip ${listFilter === v ? 'active' : ''}" data-f="${v}">${l}</button>`).join('')}
      </div>
      <div id="list" class="list"><div class="muted center">Načítavam…</div></div>`,
  });

  let q = '';
  const load = async () => {
    const params = new URLSearchParams();
    if (listFilter) params.set('status', listFilter);
    if (q) params.set('q', q);
    const rows = await api('GET', `/api/rentals?${params}`);
    $('#list').innerHTML = rows.length ? rows.map((r) => `
      <a class="item" href="#/r/${r.id}">
        <div class="item-main">
          <strong>${esc(customerName(r) || '—')}</strong>
          <span class="muted">${esc(r.machine_name || '')} · č. ${esc(r.number)}</span>
          <span class="muted small">${r.status === 'returned' ? `vrátené ${fmtDate(r.returned_at)}` : `od ${fmtDate(r.created_at)} · vrátiť do ${fmtDate(r.return_due)}`}</span>
        </div>
        <div class="item-side">
          ${badge(r)}
          ${(r.contract_email_error && r.status !== 'signed') || r.return_email_error ? '<span class="badge danger">email ✕</span>' : ''}
        </div>
      </a>`).join('') : '<div class="empty">Zatiaľ tu nič nie je.</div>';
  };
  let t;
  $('#q').addEventListener('input', (e) => {
    q = e.target.value.trim();
    clearTimeout(t);
    t = setTimeout(load, 250);
  });
  $$('.chip').forEach((c) => c.addEventListener('click', () => {
    listFilter = c.dataset.f;
    $$('.chip').forEach((x) => x.classList.toggle('active', x === c));
    load();
  }));
  await load();
}

// ---------- Sprievodca novým požičaním ----------

let draft = null;
const newDraft = () => ({
  step: 1,
  photos: { id_front: null, id_back: null },
  previews: {},
  ocr: { status: 'idle', warnings: [], valid: false, done: false },
  touched: new Set(),
  data: {
    first_name: '', last_name: '', birth_date: '', birth_number: '', id_number: '', id_expiry: '', address: '',
    email: '', phone: '', machine_id: '', price: '', deposit: '', return_due: addDays(1), note: '',
  },
});

async function viewWizard() {
  await loadBasics();
  if (!draft) draft = newDraft();
  if (!draft.data.price) draft.data.price = state.settings.default_price;
  if (!draft.data.deposit) draft.data.deposit = state.settings.deposit;
  if (!draft.data.machine_id) draft.data.machine_id = String(state.machines.find((m) => !m.rented)?.id || state.machines[0]?.id || '');
  renderStep();
}

function stepper(n) {
  const labels = ['Doklad', 'Údaje', 'Podpis', 'Platba'];
  return `<ol class="stepper">${labels.map((l, i) => `<li class="${i + 1 < n ? 'done' : i + 1 === n ? 'current' : ''}"><span>${i + 1}</span>${l}</li>`).join('')}</ol>`;
}

function cancelWizard() {
  if (draft && (draft.photos.id_front || draft.data.first_name) && !confirm('Zrušiť rozpracované požičanie?')) return;
  draft = null;
  import('./ocr.js').then((m) => m.terminateOcr()).catch(() => {});
  location.hash = '#/';
}

function renderStep() {
  ({ 1: stepPhotos, 2: stepData, 3: stepSign })[draft.step]();
}

// Krok 1 – fotky OP
function stepPhotos() {
  const tile = (kind, label) => `
    <label class="photo-tile ${draft.previews[kind] ? 'has' : ''}">
      <input type="file" accept="image/*" capture="environment" data-kind="${kind}" hidden>
      ${draft.previews[kind] ? `<img src="${draft.previews[kind]}" alt="">` : `<span class="photo-empty">${icon.camera}</span>`}
      <span class="photo-label">${label}${draft.previews[kind] ? ' · odfotiť znova' : ''}</span>
    </label>`;
  screen({
    title: 'Nové požičanie',
    back: '#/',
    body: `
      ${stepper(1)}
      <p class="lead">Odfoť občiansky preukaz zákazníka z oboch strán. Drž ho rovno, celý v zábere, bez odleskov.</p>
      <div class="photos">
        ${tile('id_front', 'Predná strana')}
        ${tile('id_back', 'Zadná strana')}
      </div>
      <div id="ocr-status"></div>`,
    footer: `
      <button class="btn ghost" id="cancel">Zrušiť</button>
      <button class="btn primary" id="next">Pokračovať</button>`,
  });
  $('#cancel').addEventListener('click', cancelWizard);
  $$('input[type=file]').forEach((inp) => inp.addEventListener('change', async () => {
    const file = inp.files[0];
    if (!file) return;
    const blob = await compressImage(file);
    const kind = inp.dataset.kind;
    draft.photos[kind] = blob;
    if (draft.previews[kind]) URL.revokeObjectURL(draft.previews[kind]);
    draft.previews[kind] = URL.createObjectURL(blob);
    draft.ocr = { status: 'idle', warnings: [], done: false };
    stepPhotos();
    if (draft.photos.id_front && draft.photos.id_back) runOcr();
  }));
  $('#next').addEventListener('click', () => {
    if (!draft.photos.id_front || !draft.photos.id_back) {
      if (!confirm('Nemáš odfotené obe strany OP. Pokračovať aj tak?')) return;
    }
    draft.step = 2;
    renderStep();
  });
  renderOcrStatus();
}

function renderOcrStatus() {
  const el = $('#ocr-status');
  if (!el) return;
  const o = draft.ocr;
  if (o.status === 'running') el.innerHTML = `<div class="notice info"><span class="spinner"></span> ${esc(o.message || 'Čítam údaje z OP…')}<div class="small muted">Prvé načítanie môže trvať aj 20 sekúnd. Môžeš pokračovať, údaje sa doplnia samé.</div></div>`;
  else if (o.status === 'done') {
    el.innerHTML = `<div class="notice ${o.valid ? 'ok' : 'warn'}">${o.valid ? '✓ Údaje z OP načítané a overené kontrolnými číslicami.' : 'Údaje z OP načítané – skontroluj ich v ďalšom kroku.'}
      ${o.warnings.length ? `<ul>${o.warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}</div>`;
  } else if (o.status === 'error') el.innerHTML = `<div class="notice warn">Čítanie OP zlyhalo (${esc(o.message)}). Údaje doplň ručne.</div>`;
  else el.innerHTML = '';
}

async function runOcr() {
  const d = draft;
  d.ocr = { status: 'running', warnings: [], message: 'Pripravujem čítanie…' };
  renderOcrStatus();
  try {
    const { scanIdCard } = await import('./ocr.js');
    const res = await scanIdCard(d.photos.id_front, d.photos.id_back, (msg) => {
      if (msg) d.ocr.message = msg;
      if (draft === d) renderOcrStatus();
    });
    // Nevypĺňame polia, ktoré medzitým ručne upravil.
    for (const [k, v] of Object.entries(res.fields)) if (v && !d.touched.has(k)) d.data[k] = v;
    d.ocr = { status: 'done', warnings: res.warnings, valid: Boolean(res.mrz?.valid) };
  } catch (e) {
    d.ocr = { status: 'error', warnings: [], message: e.message };
  }
  if (draft !== d) return;
  renderOcrStatus();
  // Na kroku 2 doplníme hodnoty priamo do formulára, aby sa nestratil rozpísaný text.
  const form = $('#data-form');
  if (form) for (const k of Object.keys(d.data)) if (form.elements[k] && !d.touched.has(k)) form.elements[k].value = d.data[k];
}

// Krok 2 – údaje zákazníka
function stepData() {
  const d = draft.data;
  const f = (name, label, attrs = '', full = false) => `
    <label class="field ${full ? 'full' : ''}"><span>${label}</span>
      <input name="${name}" value="${esc(d[name])}" ${attrs}>
    </label>`;
  const machineOpts = state.machines.map((m) => `<option value="${m.id}" ${String(m.id) === String(d.machine_id) ? 'selected' : ''}>${esc(m.name)}${m.serial ? ` (${esc(m.serial)})` : ''}${m.rented ? ' – požičaný' : ''}</option>`).join('');
  screen({
    title: 'Nové požičanie',
    back: '#/',
    body: `
      ${stepper(2)}
      <div id="ocr-status"></div>
      <form id="data-form" class="form" novalidate>
        <h2>Zákazník</h2>
        <div class="grid">
          ${f('first_name', 'Meno *', 'autocomplete="off" required')}
          ${f('last_name', 'Priezvisko *', 'autocomplete="off" required')}
          ${f('birth_date', 'Dátum narodenia', 'type="date"')}
          ${f('birth_number', 'Rodné číslo', 'inputmode="numeric"')}
          ${f('id_number', 'Číslo OP *', 'autocapitalize="characters" required')}
          ${f('id_expiry', 'Platnosť OP do', 'type="date"')}
          ${f('address', 'Trvalý pobyt *', 'required', true)}
        </div>
        <h2>Kontakt</h2>
        <div class="grid">
          ${f('email', 'Email *', 'type="email" inputmode="email" autocomplete="off" autocapitalize="off" required')}
          ${f('phone', 'Telefón *', 'type="tel" inputmode="tel" autocomplete="off" required')}
        </div>
        <h2>Požičanie</h2>
        <div class="grid">
          <label class="field full"><span>Stroj *</span>
            ${state.machines.length ? `<select name="machine_id" required>${machineOpts}</select>` : '<a class="notice warn" href="#/settings">Najprv pridaj stroj v nastaveniach →</a>'}
          </label>
          ${f('price', 'Nájomné (€) *', 'type="number" inputmode="decimal" min="0" step="0.5" required')}
          ${f('deposit', 'Záloha (€) *', 'type="number" inputmode="decimal" min="0" step="1" required')}
          ${f('return_due', 'Vrátiť do *', `type="date" min="${today()}" required`)}
          ${f('note', 'Poznámka', 'autocomplete="off"')}
        </div>
      </form>`,
    footer: `
      <button class="btn ghost" id="prev">Späť</button>
      <button class="btn primary" id="next">Na podpis zmluvy</button>`,
  });
  renderOcrStatus();
  const form = $('#data-form');
  form.addEventListener('input', (e) => {
    const { name, value } = e.target;
    if (name in d) {
      d[name] = value;
      draft.touched.add(name);
      e.target.classList.remove('invalid');
    }
  });
  $('#prev').addEventListener('click', () => {
    draft.step = 1;
    renderStep();
  });
  $('#next').addEventListener('click', () => {
    const required = ['first_name', 'last_name', 'id_number', 'address', 'email', 'phone', 'machine_id', 'price', 'deposit', 'return_due'];
    const bad = required.filter((k) => !String(d[k] ?? '').trim());
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) bad.push('email');
    bad.forEach((k) => form.elements[k]?.classList.add('invalid'));
    if (bad.length) {
      form.elements[bad[0]]?.focus();
      toast('Doplň zvýraznené údaje.', 'error');
      return;
    }
    if (d.id_expiry && d.id_expiry < today() && !confirm('Platnosť OP uplynula. Pokračovať aj tak?')) return;
    draft.step = 3;
    renderStep();
  });
}

function machineOf(id) {
  return state.machines.find((m) => String(m.id) === String(id)) || {};
}

function draftAsRental() {
  const m = machineOf(draft.data.machine_id);
  return { ...draft.data, machine_name: m.name, machine_serial: m.serial, accessories: m.accessories, created_at: new Date().toISOString() };
}

function signatureBlock(id, caption) {
  return `
    <div class="sign-wrap">
      <div class="sign-head"><span>${caption}</span><button type="button" class="link" id="${id}-clear">Vymazať</button></div>
      <canvas id="${id}" class="sign-canvas"></canvas>
      <div class="sign-line">podpis prstom</div>
    </div>`;
}

function mountSignature(id, onChange) {
  const pad = new SignaturePad($(`#${id}`), { onChange });
  $(`#${id}-clear`).addEventListener('click', () => pad.clear());
  onLeave(() => pad.destroy());
  return pad;
}

// Krok 3 – náhľad zmluvy a podpis
function stepSign() {
  const r = draftAsRental();
  const doc = contractDocument(r, state.settings);
  screen({
    title: 'Podpis zmluvy',
    back: '#/',
    body: `
      ${stepper(3)}
      <p class="lead">Daj zákazníkovi telefón, nech si zmluvu prečíta a podpíše.</p>
      <article class="doc">${documentToHtml(doc, esc)}</article>
      <label class="check">
        <input type="checkbox" id="consent">
        <span>Súhlasím so zmluvou o nájme a s vyhotovením kópie môjho dokladu totožnosti.</span>
      </label>
      ${signatureBlock('sig', `Podpis nájomcu – ${esc(customerName(r))}`)}`,
    footer: `
      <button class="btn ghost" id="prev">Späť</button>
      <button class="btn primary" id="sign" disabled>Podpísať zmluvu</button>`,
  });
  const btn = $('#sign');
  const update = () => (btn.disabled = !($('#consent').checked && !pad.isEmpty()));
  const pad = mountSignature('sig', update);
  $('#consent').addEventListener('change', update);
  $('#prev').addEventListener('click', () => {
    draft.step = 2;
    renderStep();
  });
  btn.addEventListener('click', () => busy(btn, 'Ukladám…', async () => {
    const fd = new FormData();
    fd.append('data', JSON.stringify({ ...draft.data, id_consent: true, signature: pad.toDataURL() }));
    if (draft.photos.id_front) fd.append('id_front', draft.photos.id_front, 'id-front.jpg');
    if (draft.photos.id_back) fd.append('id_back', draft.photos.id_back, 'id-back.jpg');
    const rental = await api('POST', '/api/rentals', fd);
    Object.values(draft.previews).forEach((u) => URL.revokeObjectURL(u));
    draft = null;
    import('./ocr.js').then((m) => m.terminateOcr()).catch(() => {});
    location.hash = `#/r/${rental.id}/pay`;
  }));
}

// ---------- Platba ----------

async function viewPay(id) {
  await loadBasics();
  const r = await api('GET', `/api/rentals/${id}`);
  if (r.paid_at) {
    location.hash = `#/r/${id}`;
    return;
  }
  const total = Number(r.price) + Number(r.deposit);
  screen({
    title: 'Platba',
    back: `#/r/${id}`,
    body: `
      ${stepper(4)}
      <div class="notice ok">✓ Zmluva č. ${esc(r.number)} je podpísaná.</div>
      <div class="card pay">
        <p class="muted">Vyber od zákazníka v hotovosti:</p>
        <div class="pay-row"><span>Nájomné</span><strong>${money(r.price)}</strong></div>
        <div class="pay-row"><span>Záloha (vratná)</span><strong>${money(r.deposit)}</strong></div>
        <div class="pay-row total"><span>Spolu</span><strong>${money(total)}</strong></div>
      </div>
      <p class="small muted">Po potvrdení sa zákazníkovi na <strong>${esc(r.email)}</strong> odošle podpísaná zmluva s potvrdením o zaplatení.</p>`,
    footer: `<button class="btn primary block big" id="paid">Zákazník zaplatil ${money(total)}</button>`,
  });
  $('#paid').addEventListener('click', (e) => busy(e.currentTarget, 'Odosielam zmluvu…', async () => {
    const updated = await api('POST', `/api/rentals/${id}/pay`);
    showDone({
      title: 'Stroj je požičaný',
      text: updated.contract_email_error
        ? null
        : `Zmluva a potvrdenie o zálohe boli odoslané na ${updated.email}.`,
      error: updated.contract_email_error,
      rental: updated,
    });
  }));
}

function showDone({ title, text, error, rental }) {
  screen({
    title: 'Hotovo',
    body: `
      <div class="done-screen">
        <div class="done-icon">${icon.check}</div>
        <h2>${esc(title)}</h2>
        ${text ? `<p>${esc(text)}</p>` : ''}
        ${error ? `<div class="notice warn">Email sa nepodarilo odoslať: ${esc(error)}<br>Dokument je uložený – môžeš ho odoslať znova z detailu.</div>` : ''}
      </div>`,
    footer: `
      <a class="btn ghost" href="#/r/${rental.id}">Detail</a>
      <a class="btn primary" href="#/">Hotovo</a>`,
  });
}

// ---------- Detail ----------

async function viewDetail(id) {
  await loadBasics();
  const r = await api('GET', `/api/rentals/${id}`);
  const row = (label, value) => (value ? `<div class="kv"><span>${label}</span><strong>${value}</strong></div>` : '');
  const emailState = (at, err, doc) => {
    if (err) return `<div class="notice warn">Email ${doc === 'return' ? 's protokolom' : 'so zmluvou'} neodišiel: ${esc(err)}</div>`;
    if (at) return `<div class="small muted">✓ Email odoslaný ${fmtDateTime(at)}</div>`;
    return '';
  };
  screen({
    title: `Zmluva ${r.number}`,
    back: '#/',
    body: `
      <div class="detail-head">
        <div><h2>${esc(customerName(r))}</h2><div class="muted">${esc(r.machine_name || '')}</div></div>
        ${badge(r)}
      </div>

      <section class="card">
        <h3>Zákazník</h3>
        ${row('Telefón', r.phone && `<a href="tel:${esc(r.phone)}">${esc(r.phone)}</a>`)}
        ${row('Email', r.email && `<a href="mailto:${esc(r.email)}">${esc(r.email)}</a>`)}
        ${row('Adresa', esc(r.address))}
        ${row('Dátum narodenia', r.birth_date && fmtDate(r.birth_date))}
        ${row('Rodné číslo', esc(r.birth_number))}
        ${row('Číslo OP', esc(r.id_number))}
        ${row('Platnosť OP', r.id_expiry && fmtDate(r.id_expiry))}
      </section>

      <section class="card">
        <h3>Požičanie</h3>
        ${row('Stroj', esc([r.machine_name, r.machine_serial].filter(Boolean).join(' · ')))}
        ${row('Podpísané', fmtDateTime(r.created_at))}
        ${row('Vrátiť do', fmtDate(r.return_due))}
        ${row('Nájomné', money(r.price))}
        ${row('Záloha', money(r.deposit))}
        ${row('Zaplatené', r.paid_at ? fmtDateTime(r.paid_at) : '<span class="text-warn">nie</span>')}
        ${r.returned_at ? row('Vrátené', fmtDateTime(r.returned_at)) : ''}
        ${r.returned_at ? row('Stav stroja', r.return_ok ? 'v poriadku' : '<span class="text-warn">s výhradou</span>') : ''}
        ${r.returned_at ? row('Vrátená záloha', money(r.deposit_returned)) : ''}
        ${row('Poznámka', esc(r.note))}
        ${row('Poznámka pri vrátení', esc(r.return_note))}
      </section>

      <section class="card">
        <h3>Dokumenty</h3>
        <div class="doc-links">
          ${r.files.contract ? `<a class="btn ghost" href="${r.files.contract}" target="_blank" rel="noopener">📄 Zmluva (PDF)</a>` : ''}
          ${r.files.return ? `<a class="btn ghost" href="${r.files.return}" target="_blank" rel="noopener">📄 Preberací protokol (PDF)</a>` : ''}
          ${!r.files.contract ? '<span class="muted small">Zmluva v PDF vznikne po zaplatení.</span>' : ''}
        </div>
        ${r.paid_at ? emailState(r.contract_email_at, r.contract_email_error, 'contract') : ''}
        ${r.returned_at ? emailState(r.return_email_at, r.return_email_error, 'return') : ''}
        ${r.paid_at ? `<button class="btn ghost small-btn" id="resend">Znova odoslať email ${r.returned_at ? 's protokolom' : 'so zmluvou'}</button>` : ''}
      </section>

      <section class="card">
        <h3>Občiansky preukaz</h3>
        <div class="id-photos">
          ${['id_front', 'id_back'].map((k) => (r.files[k] ? `<a href="${r.files[k]}" target="_blank" rel="noopener"><img src="${r.files[k]}" alt="${k === 'id_front' ? 'Predná strana OP' : 'Zadná strana OP'}" loading="lazy"></a>` : '<div class="muted small">fotka chýba</div>')).join('')}
        </div>
        <h3>Podpisy zákazníka</h3>
        <div class="sigs">
          ${r.files.signature ? `<figure><img src="${r.files.signature}" alt="Podpis zmluvy"><figcaption>zmluva</figcaption></figure>` : ''}
          ${r.files.return_signature ? `<figure><img src="${r.files.return_signature}" alt="Podpis vrátenia"><figcaption>vrátenie</figcaption></figure>` : ''}
        </div>
      </section>

      <button class="btn danger-ghost block" id="delete">Vymazať záznam</button>`,
    footer: r.status === 'signed'
      ? `<a class="btn primary block big" href="#/r/${r.id}/pay">Pokračovať na platbu</a>`
      : r.status === 'active'
        ? `<a class="btn primary block big" href="#/r/${r.id}/return">Zákazník vracia stroj</a>`
        : '',
  });

  $('#resend')?.addEventListener('click', (e) => {
    const email = prompt('Odoslať na email:', r.email || '');
    if (email === null) return;
    busy(e.currentTarget, 'Odosielam…', async () => {
      const u = await api('POST', `/api/rentals/${r.id}/resend`, { doc: r.returned_at ? 'return' : 'contract', email: email.trim() });
      const err = u.returned_at ? u.return_email_error : u.contract_email_error;
      if (err) toast(`Email neodišiel: ${err}`, 'error');
      else toast('Email odoslaný.', 'ok');
      viewDetail(id);
    });
  });
  $('#delete').addEventListener('click', async () => {
    if (!confirm(`Naozaj natrvalo vymazať zmluvu ${r.number} vrátane fotiek OP a podpisov?`)) return;
    await api('DELETE', `/api/rentals/${r.id}`).catch((e) => toast(e.message, 'error'));
    toast('Záznam vymazaný.');
    location.hash = '#/';
  });
}

// ---------- Vrátenie stroja ----------

async function viewReturn(id) {
  await loadBasics();
  const r = await api('GET', `/api/rentals/${id}`);
  if (r.status !== 'active') {
    location.hash = `#/r/${id}`;
    return;
  }
  screen({
    title: 'Vrátenie stroja',
    back: `#/r/${id}`,
    body: `
      <div class="card">
        <div class="kv"><span>Zákazník</span><strong>${esc(customerName(r))}</strong></div>
        <div class="kv"><span>Stroj</span><strong>${esc(r.machine_name || '')}</strong></div>
        <div class="kv"><span>Zmluva</span><strong>${esc(r.number)} · ${fmtDate(r.created_at)}</strong></div>
      </div>
      <p class="lead">Skontroluj stroj a príslušenstvo.</p>
      <label class="check big-check">
        <input type="checkbox" id="ok">
        <span>Stroj je kompletný, funkčný a nepoškodený</span>
      </label>
      <div id="damage" hidden>
        <label class="field"><span>Čo je v neporiadku?</span>
          <textarea id="note" rows="3" placeholder="napr. prasknutá hubica, chýba hadica…"></textarea>
        </label>
      </div>
      <label class="field"><span>Vrátená záloha (€)</span>
        <input type="number" id="refund" inputmode="decimal" min="0" max="${r.deposit}" step="1" value="${r.deposit}">
      </label>
      <p class="small muted" id="confirm-text"></p>
      ${signatureBlock('sig', `Podpis nájomcu – ${esc(customerName(r))}`)}`,
    footer: '<button class="btn primary block big" id="submit" disabled>Potvrdiť vrátenie</button>',
  });
  const btn = $('#submit');
  const refund = () => Math.max(0, Math.min(Number(r.deposit), Number($('#refund').value) || 0));
  const update = () => {
    const ok = $('#ok').checked;
    $('#damage').hidden = ok;
    $('#confirm-text').textContent = `Podpisom zákazník potvrdzuje vrátenie stroja${ok ? ' v nepoškodenom stave' : ''} a prevzatie zálohy ${money(refund())} v hotovosti.`;
    btn.textContent = `Potvrdiť vrátenie a vrátiť ${money(refund())}`;
    btn.disabled = pad.isEmpty() || (!ok && !$('#note').value.trim());
  };
  const pad = mountSignature('sig', update);
  $('#ok').addEventListener('change', update);
  $('#note').addEventListener('input', update);
  $('#refund').addEventListener('input', update);
  update();
  btn.addEventListener('click', () => busy(btn, 'Odosielam…', async () => {
    const u = await api('POST', `/api/rentals/${id}/return`, {
      return_ok: $('#ok').checked,
      return_note: $('#ok').checked ? '' : $('#note').value.trim(),
      deposit_returned: refund(),
      signature: pad.toDataURL(),
    });
    showDone({
      title: 'Stroj vrátený',
      text: u.return_email_error ? null : `Potvrdenie o vrátení stroja a zálohy bolo odoslané na ${u.email}.`,
      error: u.return_email_error,
      rental: u,
    });
  }));
}

// ---------- Nastavenia ----------

async function viewSettings() {
  await loadBasics(true);
  const s = state.settings;
  const f = (name, label, attrs = '', full = false) => `
    <label class="field ${full ? 'full' : ''}"><span>${label}</span><input name="${name}" value="${esc(s[name])}" ${attrs}></label>`;
  screen({
    title: 'Nastavenia',
    back: '#/',
    body: `
      <form id="settings" class="form">
        <h2>Firma (prenajímateľ)</h2>
        <div class="grid">
          ${f('company_name', 'Názov / meno', '', true)}
          ${f('company_address', 'Adresa sídla', '', true)}
          ${f('company_ico', 'IČO', 'inputmode="numeric"')}
          ${f('company_dic', 'DIČ', 'inputmode="numeric"')}
          ${f('company_phone', 'Telefón', 'type="tel"')}
          ${f('company_email', 'Email', 'type="email"')}
        </div>
        <h2>Ceny</h2>
        <div class="grid three">
          ${f('default_price', 'Nájomné (€)', 'type="number" step="0.5" min="0"')}
          ${f('deposit', 'Záloha (€)', 'type="number" step="1" min="0"')}
          ${f('late_fee', 'Omeškanie / deň (€)', 'type="number" step="0.5" min="0"')}
        </div>
        <label class="field full"><span>Doplňujúce podmienky zmluvy (nepovinné)</span>
          <textarea name="extra_terms" rows="3">${esc(s.extra_terms)}</textarea>
        </label>
        <button class="btn primary block" type="submit">Uložiť údaje</button>
      </form>

      <section class="card">
        <h2>Tvoj podpis (prenajímateľ)</h2>
        <p class="small muted">Podpíšeš sa raz a podpis sa automaticky vloží do každej zmluvy a protokolu.</p>
        ${s.owner_signature ? `<div class="current-sig"><img src="${s.owner_signature}" alt="Uložený podpis"></div>` : ''}
        ${signatureBlock('owner-sig', s.owner_signature ? 'Nový podpis' : 'Podpis')}
        <button class="btn ghost block" id="save-sig" disabled>Uložiť podpis</button>
      </section>

      <section class="card">
        <h2>Stroje</h2>
        <div id="machines"></div>
        <form id="add-machine" class="grid">
          <label class="field"><span>Názov stroja</span><input name="name" placeholder="napr. Kärcher Puzzi 10/1" required></label>
          <label class="field"><span>Výrobné číslo</span><input name="serial"></label>
          <label class="field full"><span>Príslušenstvo</span><input name="accessories" placeholder="hubica na koberce, ručná hubica, hadica"></label>
          <button class="btn ghost full" type="submit">${icon.plus} Pridať stroj</button>
        </form>
      </section>

      <section class="card">
        <h2>Email</h2>
        <p class="small muted">${state.me.mailConfigured ? 'Odosielanie je nastavené.' : 'Odosielanie nie je nastavené – doplň SMTP údaje do súboru .env na serveri.'}</p>
        <button class="btn ghost block" id="test-email">Poslať testovací email</button>
      </section>

      <button class="btn danger-ghost block" id="logout">Odhlásiť sa</button>`,
  });

  $('#settings').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    busy(e.submitter, 'Ukladám…', async () => {
      state.settings = await api('PUT', '/api/settings', data);
      toast('Uložené.', 'ok');
    });
  });

  const saveBtn = $('#save-sig');
  const pad = mountSignature('owner-sig', () => (saveBtn.disabled = pad.isEmpty()));
  saveBtn.addEventListener('click', () => busy(saveBtn, 'Ukladám…', async () => {
    state.settings = await api('PUT', '/api/settings', { owner_signature: pad.toDataURL() });
    toast('Podpis uložený.', 'ok');
    viewSettings();
  }));

  const renderMachines = () => {
    $('#machines').innerHTML = state.machines.length ? state.machines.map((m) => `
      <div class="machine">
        <div><strong>${esc(m.name)}</strong><div class="small muted">${esc([m.serial && `v. č. ${m.serial}`, m.accessories].filter(Boolean).join(' · '))}</div></div>
        <div class="machine-actions">
          ${m.rented ? '<span class="badge info">požičaný</span>' : ''}
          <button class="link" data-edit="${m.id}">Upraviť</button>
          <button class="link danger" data-del="${m.id}">Odstrániť</button>
        </div>
      </div>`).join('') : '<p class="muted small">Zatiaľ žiadne stroje.</p>';
    $$('[data-del]').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Odstrániť stroj zo zoznamu? (Staré zmluvy zostanú.)')) return;
      await api('DELETE', `/api/machines/${b.dataset.del}`);
      state.machines = await api('GET', '/api/machines');
      renderMachines();
    }));
    $$('[data-edit]').forEach((b) => b.addEventListener('click', async () => {
      const m = state.machines.find((x) => String(x.id) === b.dataset.edit);
      const name = prompt('Názov stroja', m.name);
      if (name === null) return;
      const serial = prompt('Výrobné číslo', m.serial || '');
      if (serial === null) return;
      const accessories = prompt('Príslušenstvo', m.accessories || '');
      if (accessories === null) return;
      await api('PUT', `/api/machines/${m.id}`, { name, serial, accessories });
      state.machines = await api('GET', '/api/machines');
      renderMachines();
    }));
  };
  renderMachines();

  $('#add-machine').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    busy(e.submitter, 'Pridávam…', async () => {
      await api('POST', '/api/machines', data);
      state.machines = await api('GET', '/api/machines');
      e.target.reset();
      renderMachines();
    });
  });

  $('#test-email').addEventListener('click', (e) => {
    const to = prompt('Poslať testovací email na:', s.company_email || '');
    if (!to) return;
    busy(e.currentTarget, 'Odosielam…', async () => {
      await api('POST', '/api/settings/test-email', { to });
      toast(`Email odoslaný na ${to}.`, 'ok');
    });
  });

  $('#logout').addEventListener('click', async () => {
    await api('POST', '/api/logout');
    state = { settings: null, machines: [], me: null };
    location.hash = '#/login';
  });
}
