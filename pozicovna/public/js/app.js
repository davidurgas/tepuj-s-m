import { SignaturePad } from './signature.js';
import {
  contractDocument, returnDocument, paymentConfirmation, documentToHtml, money, fmtDate, fmtDateTime, customerName,
} from './contract.js';

const DEMO = Boolean(window.__DEMO__);

// ---------- Pomocníci ----------

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const app = $('#app');

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const ic = (d, size = 22, sw = 2) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  back: (s) => ic('<path d="M15 18l-6-6 6-6"/>', s),
  close: (s) => ic('<path d="M18 6L6 18M6 6l12 12"/>', s),
  home: (s) => ic('<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>', s),
  gear: (s) => ic('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>', s),
  plus: (s) => ic('<path d="M12 5v14M5 12h14"/>', s, 2.4),
  camera: (s) => ic('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>', s),
  card: (s) => ic('<rect x="2" y="5" width="20" height="14" rx="2.5"/><circle cx="8" cy="12" r="2.2"/><path d="M13 10h5M13 14h3"/>', s),
  check: (s) => ic('<path d="M20 6L9 17l-5-5"/>', s, 2.6),
  info: (s) => ic('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', s),
  alert: (s) => ic('<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>', s),
  search: (s) => ic('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>', s),
  phone: (s) => ic('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z"/>', s),
  mail: (s) => ic('<rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="M22 7l-10 6L2 7"/>', s),
  sms: (s) => ic('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>', s),
  file: (s) => ic('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/>', s),
  chevron: (s) => ic('<path d="M9 18l6-6-6-6"/>', s),
  down: (s) => ic('<path d="M6 9l6 6 6-6"/>', s),
  cash: (s) => ic('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>', s),
  machine: (s) => ic('<rect x="6" y="3" width="10" height="13" rx="2.5"/><path d="M16 7h2a2 2 0 0 1 2 2v3M11 16v4M7 21h8"/>', s),
  trash: (s) => ic('<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>', s),
  edit: (s) => ic('<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>', s),
  inbox: (s) => ic('<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z"/>', s),
  send: (s) => ic('<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>', s),
  logout: (s) => ic('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>', s),
};

let toastTimer;
function toast(msg, type = 'info') {
  const t = $('#toast');
  t.innerHTML = `${type === 'error' ? I.alert(18) : type === 'ok' ? I.check(18) : I.info(18)}<span>${esc(msg)}</span>`;
  t.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.className = ''), 3500);
}

let demoApi;
async function api(method, url, body) {
  if (DEMO) {
    demoApi ||= (await import('./demo-api.js')).demoApi;
    return demoApi(method, url, body);
  }
  const opts = { method, headers: {} };
  if (body instanceof FormData) opts.body = body;
  else if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  let res;
  try {
    res = await fetch(url.replace(/^\//, ''), opts);
  } catch {
    throw new Error('Nie je pripojenie k internetu. Skús to znova.');
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !url.endsWith('/login')) {
    state.me = null;
    location.hash = '#/login';
    throw new Error('Prihlás sa znova.');
  }
  if (!res.ok) throw new Error(data.error || `Chyba ${res.status}`);
  return data;
}

// Počas akcie zablokuje tlačidlo a ukáže na ňom priebeh.
async function busy(btn, label, fn) {
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span>${esc(label)}`;
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

const localDate = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = () => localDate();
const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return localDate(d);
};
const daysBetween = (a, b) => Math.round((new Date(`${b}T12:00:00`) - new Date(`${a}T12:00:00`)) / 864e5);
const plural = (n, one, few, many) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);
const initials = (r) => ((r.first_name || '?')[0] + (r.last_name || '')[0] || '').toUpperCase();

function dueInfo(r) {
  if (r.status === 'returned') return { text: `vrátené ${fmtDate(r.returned_at)}`, tone: '' };
  if (!r.return_due) return { text: '', tone: '' };
  const d = daysBetween(today(), r.return_due);
  if (d < 0) return { text: `${-d} ${plural(-d, 'deň', 'dni', 'dní')} po termíne`, tone: 'danger' };
  if (d === 0) return { text: 'vrátiť dnes', tone: 'warn' };
  if (d === 1) return { text: 'vrátiť zajtra', tone: '' };
  return { text: `vrátiť o ${d} ${plural(d, 'deň', 'dni', 'dní')}`, tone: '' };
}

function statusPill(r) {
  if (r.status === 'signed') return '<span class="pill warn">Nezaplatené</span>';
  if (r.status === 'returned') return '<span class="pill ok">Vrátené</span>';
  if (r.return_due && r.return_due < today()) return '<span class="pill danger">Po termíne</span>';
  return '<span class="pill info">Požičané</span>';
}

// Fotku z fotoaparátu zmenšíme – rýchlejšie OCR aj nahrávanie, menej miesta.
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

// ---------- Kostra obrazoviek ----------

let cleanup = [];
const onLeave = (fn) => cleanup.push(fn);

function render({ title = '', back, action = '', body, bar = '', nav = false }) {
  app.innerHTML = `
    <div class="shell view-enter">
      <header class="topbar">
        ${back ? `<a class="icon-btn" href="${back}" aria-label="Späť">${I.back(24)}</a>` : ''}
        <div class="title">${esc(title)}</div>
        ${DEMO ? '<span class="demo-badge">Demo</span>' : ''}
        ${action}
      </header>
      <main class="page ${nav ? 'has-nav' : ''}">${body}</main>
    </div>
    ${bar ? `<div class="actionbar"><div class="actionbar-inner">${bar}</div></div>` : ''}
    ${nav ? tabbar(nav) : ''}`;
  window.scrollTo(0, 0);
  const top = $('.topbar');
  const onScroll = () => top.classList.toggle('scrolled', window.scrollY > 4);
  window.addEventListener('scroll', onScroll, { passive: true });
  onLeave(() => window.removeEventListener('scroll', onScroll));
}

function tabbar(active) {
  return `<nav class="tabbar" aria-label="Hlavné menu"><div class="tabbar-inner">
    <a class="tab ${active === 'home' ? 'active' : ''}" href="#/">${I.home(22)}Prehľad</a>
    <a class="fab" href="#/new">${I.plus(20)}Požičať</a>
    <a class="tab ${active === 'settings' ? 'active' : ''}" href="#/settings">${I.gear(22)}Nastavenia</a>
  </div></nav>`;
}

function banner(tone, html, href) {
  const icon = tone === 'ok' ? I.check(20) : tone === 'info' ? I.info(20) : I.alert(20);
  return href
    ? `<a class="banner ${tone}" href="${href}">${icon}<div>${html}</div></a>`
    : `<div class="banner ${tone}">${icon}<div>${html}</div></div>`;
}

// Spodný panel – náhrada za confirm()/prompt(), ktoré na mobile pôsobia cudzo.
function sheet({ title, body = '', actions = [] }) {
  return new Promise((resolve) => {
    const el = document.createElement('div');
    el.className = 'sheet-scrim';
    el.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      ${title ? `<h2>${esc(title)}</h2>` : ''}
      <form class="sheet-body" novalidate>${body}
        <div class="sheet-actions">${actions.map((a, i) => `<button type="${i === 0 ? 'submit' : 'button'}" class="btn block ${a.kind || (i === 0 ? 'primary' : 'secondary')}" data-i="${i}">${a.label}</button>`).join('')}</div>
      </form></div>`;
    document.body.appendChild(el);
    const form = $('form', el);
    const close = (val) => {
      el.remove();
      document.removeEventListener('keydown', onKey);
      resolve(val);
    };
    const onKey = (e) => e.key === 'Escape' && close(null);
    document.addEventListener('keydown', onKey);
    el.addEventListener('click', (e) => e.target === el && close(null));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      close({ action: actions[0]?.value ?? 0, data: Object.fromEntries(new FormData(form)) });
    });
    $$('button[type=button]', el).forEach((b) => b.addEventListener('click', () => {
      const a = actions[+b.dataset.i];
      close(a.value === undefined ? null : { action: a.value, data: Object.fromEntries(new FormData(form)) });
    }));
    setTimeout(() => ($('input, textarea', el) || $('button', el))?.focus(), 50);
  });
}

async function confirmSheet(title, text, { ok = 'Potvrdiť', danger = false } = {}) {
  const res = await sheet({
    title,
    body: text ? `<p class="muted">${esc(text)}</p>` : '',
    actions: [{ label: esc(ok), kind: danger ? 'danger' : 'primary' }, { label: 'Zrušiť' }],
  });
  return Boolean(res);
}

async function promptSheet(title, fields, okLabel = 'Uložiť') {
  const res = await sheet({
    title,
    body: `<div class="grid">${fields.map((f) => `<label class="field full"><span>${esc(f.label)}</span>
      <input name="${f.name}" value="${esc(f.value || '')}" type="${f.type || 'text'}" ${f.attrs || ''}></label>`).join('')}</div>`,
    actions: [{ label: esc(okLabel) }, { label: 'Zrušiť' }],
  });
  return res ? res.data : null;
}

// ---------- Stav ----------

let state = { settings: null, machines: [], me: null };
const listCache = {};

async function loadBasics(force = false) {
  if (!state.settings || force) {
    [state.settings, state.machines] = await Promise.all([api('GET', '/api/settings'), api('GET', '/api/machines')]);
  }
}

// ---------- Router ----------

const routes = [
  [/^#\/login$/, viewLogin],
  [/^#\/?$/, viewHome],
  [/^#\/new$/, viewWizard],
  [/^#\/r\/(\d+)$/, viewDetail],
  [/^#\/r\/(\d+)\/pay$/, viewPay],
  [/^#\/r\/(\d+)\/return$/, viewReturn],
  [/^#\/settings$/, viewSettings],
];

async function router() {
  cleanup.forEach((fn) => fn());
  cleanup = [];
  $$('.sheet-scrim').forEach((s) => s.remove());
  const hash = location.hash || '#/';
  try {
    if (!state.me) state.me = await api('GET', '/api/me');
  } catch (e) {
    state.me = { loggedIn: false };
  }
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
        render({ title: 'Chyba', back: '#/', body: banner('danger', esc(e.message)) });
      }
      return;
    }
  }
  location.hash = '#/';
}

window.addEventListener('hashchange', router);
router();

if (!DEMO && 'serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ---------- Prihlásenie ----------

function viewLogin() {
  app.innerHTML = `
    <main class="login view-enter">
      <div class="login-card">
        <div class="brand">
          <div class="logo">${I.machine(36)}</div>
          <h1>Požičovňa tepovačov</h1>
          <p>Prihlás sa do administrácie</p>
        </div>
        <form id="login-form">
          <label class="field"><span>Heslo</span>
            <input id="password" type="password" name="password" autocomplete="current-password" required>
          </label>
          <button class="btn primary block" type="submit">Prihlásiť sa</button>
        </form>
      </div>
    </main>`;
  $('#password').focus();
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await busy(e.submitter, 'Prihlasujem…', async () => {
      await api('POST', '/api/login', { password: e.target.password.value });
      state.me = null;
      location.hash = '#/';
    });
  });
}

// ---------- Prehľad ----------

let listFilter = 'open';

function rowHtml(r) {
  const due = dueInfo(r);
  const emailFail = (r.contract_email_error && r.status !== 'signed') || r.return_email_error;
  return `
    <a class="row" href="#/r/${r.id}">
      <div class="avatar">${esc(initials(r))}</div>
      <div class="row-main">
        <strong>${esc(customerName(r) || '—')}</strong>
        <span>${esc(r.machine_name || '')} · ${esc(r.number)}</span>
      </div>
      <div class="row-side">
        ${emailFail ? '<span class="pill danger">Email neodišiel</span>' : statusPill(r)}
        <span class="when ${due.tone}">${esc(due.text)}</span>
      </div>
    </a>`;
}

async function viewHome() {
  await loadBasics();
  const s = state.settings;
  const missing = [!s.company_name && 'údaje firmy', !s.owner_signature && 'tvoj podpis', !state.machines.length && 'stroje'].filter(Boolean);
  const dateLabel = new Intl.DateTimeFormat('sk-SK', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  render({
    nav: 'home',
    body: `
      <div class="hello"><span class="eyebrow">${esc(dateLabel)}</span><h1>Požičovňa</h1></div>
      ${missing.length ? banner('warn', `<strong>Dokonči nastavenie:</strong> ${missing.join(', ')}.`, '#/settings') : ''}
      ${state.me.mailConfigured ? '' : banner('warn', '<strong>Emaily sa neodosielajú.</strong> Na serveri chýba nastavenie SMTP v súbore .env.')}
      <div class="stats" id="stats">
        <div class="stat"><b class="num">–</b><span>požičané</span></div>
        <div class="stat"><b class="num">–</b><span>po termíne</span></div>
        <div class="stat"><b class="num">–</b><span>zálohy u teba</span></div>
      </div>
      <label class="search">${I.search(20)}
        <input type="search" id="q" placeholder="Meno, telefón, číslo zmluvy" autocomplete="off" aria-label="Hľadať">
      </label>
      <div class="segmented" role="tablist">
        ${[['open', 'Požičané'], ['returned', 'Vrátené'], ['', 'Všetky']].map(([v, l]) => `<button role="tab" data-f="${v}" class="${listFilter === v ? 'active' : ''}" aria-selected="${listFilter === v}">${l}</button>`).join('')}
      </div>
      <div id="list" class="list">${listCache[listFilter] ? '' : '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>'}</div>`,
  });

  let q = '';
  const paint = (rows) => {
    $('#list').innerHTML = rows.length
      ? rows.map(rowHtml).join('')
      : `<div class="empty">${I.inbox(40)}<b>${q ? 'Nič sa nenašlo' : listFilter === 'open' ? 'Nič nie je požičané' : 'Zatiaľ žiadne záznamy'}</b>
         <span class="small">${q ? 'Skús iné meno alebo číslo.' : 'Nové požičanie spustíš tlačidlom dole.'}</span></div>`;
  };
  const paintStats = (open) => {
    const active = open.filter((r) => r.status === 'active');
    const overdue = active.filter((r) => r.return_due && r.return_due < today()).length;
    const deposits = active.reduce((sum, r) => sum + Number(r.deposit || 0), 0);
    $('#stats').innerHTML = `
      <div class="stat"><b>${active.length}</b><span>požičané</span></div>
      <div class="stat ${overdue ? 'alert' : ''}"><b>${overdue}</b><span>po termíne</span></div>
      <div class="stat"><b>${new Intl.NumberFormat('sk-SK', { maximumFractionDigits: 0 }).format(deposits)} €</b><span>zálohy u teba</span></div>`;
  };
  const load = async () => {
    const key = listFilter;
    if (!q && listCache[key]) paint(listCache[key]);
    const params = new URLSearchParams();
    if (key) params.set('status', key);
    if (q) params.set('q', q);
    const rows = await api('GET', `/api/rentals?${params}`);
    if (!q) listCache[key] = rows;
    if (key === listFilter) paint(rows);
  };
  if (listCache.open) paintStats(listCache.open);
  api('GET', '/api/rentals?status=open').then((rows) => {
    listCache.open = rows;
    if ($('#stats')) paintStats(rows);
  }).catch(() => {});

  let t;
  $('#q').addEventListener('input', (e) => {
    q = e.target.value.trim();
    clearTimeout(t);
    t = setTimeout(() => load().catch((err) => toast(err.message, 'error')), 200);
  });
  $$('.segmented button').forEach((b) => b.addEventListener('click', () => {
    listFilter = b.dataset.f;
    $$('.segmented button').forEach((x) => {
      x.classList.toggle('active', x === b);
      x.setAttribute('aria-selected', x === b);
    });
    load().catch((err) => toast(err.message, 'error'));
  }));
  await load();
}

// ---------- Sprievodca novým požičaním ----------

let draft = null;
const newDraft = () => ({
  step: 1,
  photos: { id_front: null, id_back: null },
  previews: {},
  ocr: { status: 'idle', warnings: [] },
  fromOcr: new Set(),
  touched: new Set(),
  data: {
    first_name: '', last_name: '', birth_date: '', birth_number: '', id_number: '', id_expiry: '', address: '',
    email: '', phone: '', machine_id: '', price: '', deposit: '', return_due: addDays(1), note: '',
  },
});

async function viewWizard() {
  await loadBasics();
  if (!draft) draft = newDraft();
  const d = draft.data;
  if (!d.price) d.price = state.settings.default_price;
  if (!d.deposit) d.deposit = state.settings.deposit;
  if (!d.machine_id) d.machine_id = String(state.machines.find((m) => !m.rented)?.id || state.machines[0]?.id || '');
  renderStep();
}

const STEP_TITLES = ['Doklad', 'Údaje', 'Podpis', 'Platba'];
function stepHead(n, title, text) {
  return `
    <div class="progress" aria-label="Krok ${n} zo 4">${[1, 2, 3, 4].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</div>
    <div class="step-head"><span class="eyebrow">Krok ${n} zo 4 · ${STEP_TITLES[n - 1]}</span><h1>${title}</h1>${text ? `<p>${text}</p>` : ''}</div>`;
}

async function cancelWizard() {
  if (draft && (draft.photos.id_front || draft.data.first_name)) {
    if (!(await confirmSheet('Zrušiť požičanie?', 'Odfotené doklady a vyplnené údaje sa zahodia.', { ok: 'Zrušiť požičanie', danger: true }))) return;
  }
  Object.values(draft?.previews || {}).forEach((u) => URL.revokeObjectURL(u));
  draft = null;
  location.hash = '#/';
}

function renderStep() {
  ({ 1: stepPhotos, 2: stepData, 3: stepSign })[draft.step]();
}

const wizardClose = `<button class="icon-btn" id="close" aria-label="Zrušiť">${I.close(22)}</button>`;

function stepPhotos() {
  import('./ocr.js').then((m) => m.warmUpOcr()).catch(() => {});
  const shot = (kind, label, hint) => {
    const has = draft.previews[kind];
    return `
      <label class="shot ${has ? 'has' : ''} ${kind === 'id_back' && draft.ocr.status === 'running' ? 'scanning' : ''}" id="shot-${kind}">
        <input type="file" accept="image/*" capture="environment" data-kind="${kind}" aria-label="${label}">
        ${has
          ? `<img src="${has}" alt="${label}"><span class="shot-badge">${I.check(16)}${label}</span><span class="retake">Odfotiť znova</span>`
          : `<span class="shot-empty"><span class="cam">${I.camera(30)}</span><b>${label}</b><small>${hint}</small></span>`}
      </label>`;
  };
  render({
    title: 'Nové požičanie',
    action: wizardClose,
    body: `
      ${stepHead(1, 'Odfoť občiansky', 'Obe strany, celý doklad v zábere a bez odleskov. Údaje sa vyplnia samé.')}
      <div class="shots">
        ${shot('id_front', 'Predná strana', 'strana s fotkou')}
        ${shot('id_back', 'Zadná strana', 'strana so znakmi &lt;&lt;&lt; dole')}
      </div>
      <div id="ocr-status"></div>
      ${DEMO && !draft.photos.id_front ? `<button class="btn quiet" id="sample">${I.card(20)}Nemáš OP po ruke? Použi ukážkový</button>` : ''}`,
    bar: `<button class="btn primary" id="next">Pokračovať</button>`,
  });
  $('#close').addEventListener('click', cancelWizard);
  const setPhoto = (kind, blob) => {
    draft.photos[kind] = blob;
    if (draft.previews[kind]) URL.revokeObjectURL(draft.previews[kind]);
    draft.previews[kind] = URL.createObjectURL(blob);
  };
  const afterPhotos = () => {
    if (draft.photos.id_front && draft.photos.id_back) runOcr();
    stepPhotos();
  };
  $$('input[type=file]').forEach((inp) => inp.addEventListener('change', async () => {
    const file = inp.files[0];
    if (!file) return;
    setPhoto(inp.dataset.kind, await compressImage(file));
    draft.ocr = { status: 'idle', warnings: [] };
    afterPhotos();
  }));
  $('#sample')?.addEventListener('click', async (e) => {
    await busy(e.currentTarget, 'Načítavam…', async () => {
      for (const [kind, file] of [['id_front', 'demo-id-front.jpg'], ['id_back', 'demo-id-back.jpg']]) {
        setPhoto(kind, await (await fetch(file)).blob());
      }
      draft.ocr = { status: 'idle', warnings: [] };
    });
    afterPhotos();
  });
  $('#next').addEventListener('click', async () => {
    if (!draft.photos.id_front || !draft.photos.id_back) {
      const ok = await confirmSheet('Chýba fotka dokladu', 'Bez fotiek oboch strán nebudeš mať kópiu OP pre prípad sporu a údaje budeš musieť vypísať ručne.', { ok: 'Pokračovať bez fotiek' });
      if (!ok) return;
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
  if (o.status === 'running') el.innerHTML = `<div class="ocr"><span class="spinner"></span><div><b>${esc(o.message || 'Čítam údaje z OP…')}</b><div class="small muted">Môžeš pokračovať, údaje sa doplnia samé.</div></div></div>`;
  else if (o.status === 'done') {
    el.innerHTML = banner(o.valid && !o.warnings.length ? 'ok' : 'warn', `${o.valid ? '<strong>Údaje z OP načítané a overené.</strong>' : '<strong>Údaje z OP načítané.</strong> Skontroluj ich.'}
      ${o.warnings.length ? `<ul>${o.warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}`);
  } else if (o.status === 'error') el.innerHTML = banner('warn', `<strong>Doklad sa nepodarilo prečítať.</strong> Údaje doplníš ručne v ďalšom kroku.`);
  else el.innerHTML = '';
  const back = $('#shot-id_back');
  if (back) back.classList.toggle('scanning', o.status === 'running');
}

async function runOcr() {
  const d = draft;
  d.ocr = { status: 'running', warnings: [], message: 'Čítam údaje z OP…' };
  renderOcrStatus();
  try {
    const { scanIdCard } = await import('./ocr.js');
    const res = await scanIdCard(d.photos.id_front, d.photos.id_back, (msg) => {
      if (msg) d.ocr.message = msg;
      if (draft === d) renderOcrStatus();
    });
    let fields = res.fields;
    // Demo: ak OCR v prehliadači nebeží, ukážkový doklad vyplníme známymi údajmi.
    if (DEMO && !res.mrz) fields = { ...(await import('./demo-api.js')).SAMPLE_ID, ...fields };
    for (const [k, v] of Object.entries(fields)) {
      if (v && !d.touched.has(k)) {
        d.data[k] = v;
        d.fromOcr.add(k);
      }
    }
    d.ocr = { status: 'done', warnings: DEMO && !res.mrz ? [] : res.warnings, valid: Boolean(res.mrz?.valid) || DEMO };
  } catch (e) {
    if (DEMO) {
      Object.assign(d.data, (await import('./demo-api.js')).SAMPLE_ID);
      Object.keys(d.data).forEach((k) => d.fromOcr.add(k));
      d.ocr = { status: 'done', warnings: [], valid: true };
    } else d.ocr = { status: 'error', warnings: [], message: e.message };
  }
  if (draft !== d) return;
  renderOcrStatus();
  const form = $('#data-form');
  if (form) {
    for (const k of Object.keys(d.data)) if (form.elements[k] && !d.touched.has(k)) form.elements[k].value = d.data[k];
  }
}

function field(d, name, label, attrs = '', cls = '') {
  const ocr = draft?.fromOcr.has(name) && !draft.touched.has(name);
  return `<label class="field ${cls}"><span>${label}${ocr ? '<em class="tag-ocr">z OP</em>' : ''}</span>
    <input id="f-${name}" name="${name}" value="${esc(d[name])}" ${attrs}></label>`;
}

function stepData() {
  const d = draft.data;
  const dueChips = [[1, 'Zajtra'], [2, 'Pozajtra'], [3, 'O 3 dni'], [7, 'O týždeň']];
  render({
    title: 'Nové požičanie',
    action: wizardClose,
    body: `
      ${stepHead(2, 'Skontroluj údaje', 'Doplň kontakt a vyber stroj.')}
      <div id="ocr-status"></div>
      <form id="data-form" class="page" style="padding:0" novalidate>
        <section class="card">
          <span class="section-label">Zákazník</span>
          <div class="grid">
            ${field(d, 'first_name', 'Meno', 'autocomplete="off" required')}
            ${field(d, 'last_name', 'Priezvisko', 'autocomplete="off" required')}
            ${field(d, 'birth_date', 'Narodený', 'type="date"')}
            ${field(d, 'birth_number', 'Rodné číslo', 'inputmode="numeric" placeholder="nepovinné"')}
            ${field(d, 'id_number', 'Číslo OP', 'autocapitalize="characters" required')}
            ${field(d, 'id_expiry', 'Platnosť OP', 'type="date"')}
            ${field(d, 'address', 'Trvalý pobyt', 'required', 'full')}
          </div>
        </section>
        <section class="card">
          <span class="section-label">Kontakt</span>
          <div class="grid">
            ${field(d, 'email', 'Email', 'type="email" inputmode="email" autocomplete="off" autocapitalize="off" placeholder="meno@email.sk" required', 'full')}
            ${field(d, 'phone', 'Telefón', 'type="tel" inputmode="tel" autocomplete="off" placeholder="0900 000 000" required', 'full')}
          </div>
        </section>
        <section class="card">
          <span class="section-label">Stroj</span>
          ${state.machines.length ? `<div class="choices">${state.machines.map((m) => `
            <label class="choice">
              <input type="radio" name="machine_id" value="${m.id}" ${String(m.id) === String(d.machine_id) ? 'checked' : ''}>
              <span class="radio"></span>
              <span class="choice-main"><b>${esc(m.name)}</b><span>${esc([m.serial, m.accessories].filter(Boolean).join(' · ') || ' ')}</span></span>
              ${m.rented ? '<span class="pill warn">požičaný</span>' : ''}
            </label>`).join('')}</div>` : banner('warn', 'Najprv pridaj stroj v nastaveniach.', '#/settings')}
        </section>
        <section class="card">
          <span class="section-label">Cena a vrátenie</span>
          <div class="grid">
            ${field(d, 'price', 'Nájomné (€)', 'type="number" inputmode="decimal" min="0" step="0.5" required')}
            ${field(d, 'deposit', 'Záloha (€)', 'type="number" inputmode="decimal" min="0" step="1" required')}
          </div>
          <div class="field"><span>Vrátiť do</span>
            <div class="chips" id="due-chips">${dueChips.map(([n, l]) => `<button type="button" class="chip ${d.return_due === addDays(n) ? 'active' : ''}" data-days="${n}">${l}</button>`).join('')}</div>
            <input id="f-return_due" name="return_due" type="date" value="${esc(d.return_due)}" min="${today()}" required aria-label="Dátum vrátenia">
          </div>
          ${field(d, 'note', 'Poznámka', 'autocomplete="off" placeholder="nepovinné"')}
        </section>
      </form>`,
    bar: `<button class="btn secondary" id="prev" aria-label="Späť">${I.back(22)}</button><button class="btn primary" id="next">Na podpis zmluvy</button>`,
  });
  $('#close').addEventListener('click', cancelWizard);
  renderOcrStatus();
  const form = $('#data-form');
  const syncChips = () => $$('#due-chips .chip').forEach((c) => c.classList.toggle('active', addDays(+c.dataset.days) === d.return_due));
  form.addEventListener('input', (e) => {
    const { name, value } = e.target;
    if (!(name in d)) return;
    d[name] = value;
    draft.touched.add(name);
    e.target.classList.remove('invalid');
    e.target.closest('.field')?.querySelector('.tag-ocr')?.remove();
    if (name === 'return_due') syncChips();
  });
  $$('#due-chips .chip').forEach((c) => c.addEventListener('click', () => {
    d.return_due = addDays(+c.dataset.days);
    form.elements.return_due.value = d.return_due;
    syncChips();
  }));
  $('#prev').addEventListener('click', () => {
    draft.step = 1;
    renderStep();
  });
  $('#next').addEventListener('click', async () => {
    const required = ['first_name', 'last_name', 'id_number', 'address', 'email', 'phone', 'price', 'deposit', 'return_due'];
    const bad = required.filter((k) => !String(d[k] ?? '').trim());
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) bad.push('email');
    bad.forEach((k) => form.elements[k]?.classList.add('invalid'));
    if (!d.machine_id) {
      toast('Vyber stroj.', 'error');
      return;
    }
    if (bad.length) {
      const first = form.elements[bad[0]];
      first?.focus();
      first?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      toast(bad.includes('email') && d.email ? 'Email nie je v správnom tvare.' : 'Doplň zvýraznené údaje.', 'error');
      return;
    }
    if (d.id_expiry && d.id_expiry < today()) {
      const ok = await confirmSheet('Platnosť OP uplynula', `Doklad platil do ${fmtDate(d.id_expiry)}. Požičať stroj aj tak?`, { ok: 'Pokračovať' });
      if (!ok) return;
    }
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

function padHtml(id, caption) {
  return `
    <div class="pad">
      <div class="pad-head"><b>${caption}</b><button type="button" class="btn quiet sm" id="${id}-clear">Vymazať</button></div>
      <div class="pad-area" id="${id}-area">
        <canvas id="${id}" class="sign-canvas" aria-label="Pole na podpis"></canvas>
        <span class="placeholder">Podpíš sa prstom</span>
        <span class="x">×</span><span class="baseline"></span>
      </div>
    </div>`;
}

function mountSignature(id, onChange) {
  const area = $(`#${id}-area`);
  $(`#${id}`).addEventListener('pointerdown', () => area.classList.add('signed'));
  const pad = new SignaturePad($(`#${id}`), {
    onChange: (p) => {
      area.classList.toggle('signed', p.strokes.length > 0);
      onChange?.(p);
    },
  });
  $(`#${id}-clear`).addEventListener('click', () => pad.clear());
  onLeave(() => pad.destroy());
  return pad;
}

function stepSign() {
  const r = draftAsRental();
  const doc = contractDocument(r, state.settings);
  render({
    title: 'Nové požičanie',
    action: wizardClose,
    body: `
      ${stepHead(3, 'Podpis zmluvy', 'Podaj telefón zákazníkovi.')}
      <section class="card summary">
        <div class="kv"><span>Nájomca</span><strong>${esc(customerName(r))}</strong></div>
        <div class="kv"><span>Stroj</span><strong>${esc(r.machine_name || '—')}</strong></div>
        <div class="kv"><span>Vrátiť do</span><strong>${fmtDate(r.return_due)}</strong></div>
        <div class="kv"><span>Nájomné</span><strong>${money(r.price)}</strong></div>
        <div class="kv"><span>Vratná záloha</span><strong>${money(r.deposit)}</strong></div>
      </section>
      <button type="button" class="doc-toggle" id="doc-toggle" aria-expanded="false" aria-controls="doc">
        <span>Prečítať celú zmluvu</span>${I.down(20)}
      </button>
      <article class="doc" id="doc" hidden>${documentToHtml(doc, esc)}</article>
      <label class="toggle">
        <input type="checkbox" id="consent">
        <span class="box">${I.check(18)}</span>
        <span class="toggle-text">Súhlasím so zmluvou<small>aj s vyhotovením kópie môjho dokladu totožnosti</small></span>
      </label>
      ${padHtml('sig', `Podpis – ${esc(customerName(r))}`)}`,
    bar: `<button class="btn secondary" id="prev" aria-label="Späť">${I.back(22)}</button><button class="btn primary" id="sign" disabled>Podpísať zmluvu</button>`,
  });
  $('#close').addEventListener('click', cancelWizard);
  $('#doc-toggle').addEventListener('click', (e) => {
    const open = e.currentTarget.getAttribute('aria-expanded') !== 'true';
    e.currentTarget.setAttribute('aria-expanded', open);
    $('#doc').hidden = !open;
    $('span', e.currentTarget).textContent = open ? 'Skryť zmluvu' : 'Prečítať celú zmluvu';
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
    draft = null;
    Object.keys(listCache).forEach((k) => delete listCache[k]);
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
  render({
    title: `Zmluva ${r.number}`,
    back: `#/r/${id}`,
    body: `
      ${stepHead(4, 'Vyber platbu', `Zmluva je podpísaná. Po potvrdení odíde zákazníkovi emailom spolu s potvrdením o zálohe.`)}
      <div class="amount">
        <span class="label">Spolu v hotovosti</span>
        <span class="big">${money(total)}</span>
        <span class="cash">${I.cash(18)} hotovosť</span>
      </div>
      <section class="card summary">
        <div class="kv"><span>Nájomné</span><strong>${money(r.price)}</strong></div>
        <div class="kv"><span>Vratná záloha</span><strong>${money(r.deposit)}</strong></div>
        <div class="kv"><span>Email</span><strong>${esc(r.email)}</strong></div>
      </section>`,
    bar: `<button class="btn primary" id="paid">${I.check(20)}Prijal som ${money(total)}</button>`,
  });
  $('#paid').addEventListener('click', (e) => busy(e.currentTarget, 'Odosielam zmluvu…', async () => {
    const u = await api('POST', `/api/rentals/${id}/pay`);
    Object.keys(listCache).forEach((k) => delete listCache[k]);
    showDone({ title: 'Stroj je požičaný', rental: u, kind: 'contract' });
  }));
}

function showDone({ title, rental: r, kind }) {
  const err = kind === 'return' ? r.return_email_error : r.contract_email_error;
  const subject = kind === 'return' ? `Vrátenie stroja a zábezpeky – zmluva č. ${r.number}` : `Zmluva o nájme č. ${r.number} – ${r.machine_name || 'tepovací stroj'}`;
  const file = kind === 'return' ? `vratenie-${r.number}.pdf` : `zmluva-${r.number}.pdf`;
  render({
    title: '',
    body: `
      <div class="done">
        <div class="check-anim"><svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
        <h1>${esc(title)}</h1>
        <p>${kind === 'return' ? `Zákazník dostal späť ${money(r.deposit_returned)}.` : `${esc(r.machine_name || 'Stroj')} vráti do ${fmtDate(r.return_due)}.`}</p>
      </div>
      ${err
        ? banner('danger', `<strong>Email neodišiel.</strong> ${esc(err)} Dokument je uložený, odošleš ho znova z detailu.`)
        : `<section class="card mail-preview">
            <div class="mail-meta"><span>Odoslané na ${esc(r.email)}</span><b>${esc(subject)}</b></div>
            <span class="attachment">${I.file(18)}${esc(file)}</span>
          </section>`}`,
    bar: `<a class="btn secondary" href="#/r/${r.id}">Detail</a><a class="btn primary" href="#/">Hotovo</a>`,
  });
}

// ---------- Detail ----------

function timeline(r) {
  const steps = [];
  steps.push({ done: true, title: 'Zmluva podpísaná', sub: fmtDateTime(r.created_at) });
  steps.push(r.paid_at
    ? { done: true, title: `Zaplatené ${money(Number(r.price) + Number(r.deposit))}`, sub: `${fmtDateTime(r.paid_at)} · z toho záloha ${money(r.deposit)}` }
    : { next: true, title: 'Čaká na platbu', sub: `${money(Number(r.price) + Number(r.deposit))} v hotovosti` });
  if (r.paid_at) {
    steps.push(r.contract_email_error
      ? { fail: true, title: 'Email so zmluvou neodišiel', sub: r.contract_email_error }
      : { done: Boolean(r.contract_email_at), title: 'Zmluva odoslaná emailom', sub: r.contract_email_at ? fmtDateTime(r.contract_email_at) : '' });
  }
  if (r.returned_at) {
    steps.push({ done: true, title: r.return_ok ? 'Vrátené bez poškodenia' : 'Vrátené s výhradou', sub: `${fmtDateTime(r.returned_at)} · záloha ${money(r.deposit_returned)} vrátená` });
    steps.push(r.return_email_error
      ? { fail: true, title: 'Email s protokolom neodišiel', sub: r.return_email_error }
      : { done: Boolean(r.return_email_at), title: 'Protokol odoslaný emailom', sub: r.return_email_at ? fmtDateTime(r.return_email_at) : '' });
  } else if (r.paid_at) {
    const due = dueInfo(r);
    steps.push({ next: true, fail: due.tone === 'danger', title: `Vrátiť do ${fmtDate(r.return_due)}`, sub: due.text });
  }
  return `<ol class="timeline">${steps.map((s) => `
    <li class="${s.fail ? 'fail' : s.done ? 'done-step' : s.next ? 'next' : ''}">
      <span class="dot">${s.fail ? I.alert(13) : s.done ? I.check(13) : ''}</span>
      <div class="t-main"><b>${esc(s.title)}</b>${s.sub ? `<span>${esc(s.sub)}</span>` : ''}</div>
    </li>`).join('')}</ol>`;
}

function docLink(url, title, sub, kind) {
  if (!url) return '';
  const inner = `<span class="file-ic">${I.file(18)}</span><div>${title}<small>${sub}</small></div>${I.chevron(18)}`;
  return url.startsWith('doc:')
    ? `<button type="button" class="doc-link" data-doc="${kind}">${inner}</button>`
    : `<a class="doc-link" href="${url}" target="_blank" rel="noopener">${inner}</a>`;
}

// Náhľad dokumentu (v deme namiesto PDF).
function showDocSheet(r, kind) {
  const s = state.settings;
  const doc = kind === 'return' ? returnDocument(r, s) : contractDocument(r, s);
  const pay = kind === 'contract' && r.paid_at ? paymentConfirmation(r, s) : null;
  const sig = kind === 'return' ? r.files.return_signature : r.files.signature;
  sheet({
    title: '',
    body: `<article class="doc" style="box-shadow:none;padding:4px 0">${documentToHtml(doc, esc)}
      <div class="sig-row">
        <div>${s.owner_signature ? `<img src="${s.owner_signature}" alt="">` : ''}Prenajímateľ</div>
        <div>${sig ? `<img src="${sig}" alt="">` : ''}Nájomca</div>
      </div>
      ${pay ? `<div class="pay-box"><h3 style="margin-top:0">${esc(pay.heading)}</h3><p>${esc(pay.paragraphs[0])}</p>
        ${pay.rows.map(([a, b]) => `<div class="kv"><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`).join('')}</div>` : ''}
    </article>`,
    actions: [{ label: 'Zavrieť' }],
  });
}

async function viewDetail(id) {
  await loadBasics();
  const r = await api('GET', `/api/rentals/${id}`);
  const kv = (label, value) => (value ? `<div class="kv"><span>${label}</span><strong>${value}</strong></div>` : '');
  const phone = (r.phone || '').replace(/\s+/g, '');
  const primary = r.status === 'signed'
    ? `<a class="btn primary" href="#/r/${r.id}/pay">${I.cash(20)}Pokračovať na platbu</a>`
    : r.status === 'active'
      ? `<a class="btn primary" href="#/r/${r.id}/return">Zákazník vracia stroj</a>`
      : '';
  render({
    title: `Zmluva ${r.number}`,
    back: '#/',
    body: `
      <div class="hero">
        <div class="avatar">${esc(initials(r))}</div>
        <div style="flex:1;min-width:0"><h1>${esc(customerName(r))}</h1><p>${esc(r.machine_name || '')}</p></div>
        ${statusPill(r)}
      </div>
      <div class="quick">
        <a href="tel:${esc(phone)}">${I.phone(22)}Zavolať</a>
        <a href="sms:${esc(phone)}">${I.sms(22)}SMS</a>
        <a href="mailto:${esc(r.email)}">${I.mail(22)}Email</a>
      </div>
      <section class="card">${timeline(r)}</section>

      <section class="card">
        <div class="card-title"><span class="section-label">Dokumenty</span>
          ${r.paid_at ? `<button class="btn quiet sm" id="resend">${I.send(16)}Poslať znova</button>` : ''}</div>
        <div class="docs">
          ${docLink(r.files.contract, 'Zmluva o nájme', `č. ${esc(r.number)} · s potvrdením o zálohe`, 'contract')}
          ${docLink(r.files.return, 'Preberací protokol', 'vrátenie stroja a zálohy', 'return')}
          ${!r.files.contract ? '<span class="small muted">Zmluva v PDF vznikne po zaplatení.</span>' : ''}
        </div>
      </section>

      <section class="card summary">
        <span class="section-label" style="margin-bottom:8px">Zákazník</span>
        ${kv('Telefón', esc(r.phone))}
        ${kv('Email', esc(r.email))}
        ${kv('Trvalý pobyt', esc(r.address))}
        ${kv('Narodený', r.birth_date && fmtDate(r.birth_date))}
        ${kv('Rodné číslo', esc(r.birth_number))}
        ${kv('Číslo OP', esc(r.id_number))}
        ${kv('Platnosť OP', r.id_expiry && fmtDate(r.id_expiry))}
      </section>

      <section class="card summary">
        <span class="section-label" style="margin-bottom:8px">Požičanie</span>
        ${kv('Stroj', esc([r.machine_name, r.machine_serial].filter(Boolean).join(' · ')))}
        ${kv('Nájomné', money(r.price))}
        ${kv('Záloha', money(r.deposit))}
        ${kv('Poznámka', esc(r.note))}
        ${kv('Pri vrátení', esc(r.return_note))}
      </section>

      <section class="card">
        <span class="section-label">Občiansky preukaz</span>
        <div class="id-photos">
          ${['id_front', 'id_back'].map((k) => (r.files[k]
            ? `<button type="button" data-img="${esc(r.files[k])}" aria-label="Zväčšiť"><img src="${esc(r.files[k])}" alt="${k === 'id_front' ? 'Predná strana OP' : 'Zadná strana OP'}" loading="lazy"></button>`
            : '<div class="small muted">fotka chýba</div>')).join('')}
        </div>
        <span class="section-label">Podpisy zákazníka</span>
        <div class="sigs">
          ${r.files.signature ? `<figure><img src="${esc(r.files.signature)}" alt="Podpis zmluvy"><figcaption>zmluva</figcaption></figure>` : ''}
          ${r.files.return_signature ? `<figure><img src="${esc(r.files.return_signature)}" alt="Podpis pri vrátení"><figcaption>vrátenie</figcaption></figure>` : ''}
        </div>
      </section>

      <button class="btn danger block" id="delete">${I.trash(20)}Vymazať záznam</button>`,
    bar: primary,
  });

  $$('[data-doc]').forEach((b) => b.addEventListener('click', () => showDocSheet(r, b.dataset.doc)));
  $$('[data-img]').forEach((b) => b.addEventListener('click', () => sheet({ title: '', body: `<img class="full" src="${b.dataset.img}" alt="">`, actions: [{ label: 'Zavrieť' }] })));
  $('#resend')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    const data = await promptSheet(r.returned_at ? 'Poslať protokol znova' : 'Poslať zmluvu znova', [
      { name: 'email', label: 'Email zákazníka', value: r.email, type: 'email', attrs: 'inputmode="email" autocapitalize="off" required' },
    ], 'Odoslať');
    if (!data) return;
    busy(btn, 'Odosielam…', async () => {
      const u = await api('POST', `/api/rentals/${r.id}/resend`, { doc: r.returned_at ? 'return' : 'contract', email: data.email.trim() });
      const err = u.returned_at ? u.return_email_error : u.contract_email_error;
      toast(err ? `Email neodišiel: ${err}` : `Odoslané na ${u.email}.`, err ? 'error' : 'ok');
      viewDetail(id);
    });
  });
  $('#delete').addEventListener('click', async () => {
    const ok = await confirmSheet(`Vymazať zmluvu ${r.number}?`, 'Natrvalo sa vymažú aj fotky OP, podpisy a dokumenty. Nedá sa to vrátiť.', { ok: 'Vymazať natrvalo', danger: true });
    if (!ok) return;
    try {
      await api('DELETE', `/api/rentals/${r.id}`);
      Object.keys(listCache).forEach((k) => delete listCache[k]);
      toast('Záznam vymazaný.', 'ok');
      location.hash = '#/';
    } catch (err) {
      toast(err.message, 'error');
    }
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
  const dep = Number(r.deposit);
  render({
    title: 'Vrátenie stroja',
    back: `#/r/${id}`,
    body: `
      <div class="hero">
        <div class="avatar">${esc(initials(r))}</div>
        <div style="flex:1;min-width:0"><h1>${esc(customerName(r))}</h1><p>${esc(r.machine_name || '')} · ${esc(r.number)}</p></div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="ok">
        <span class="box">${I.check(18)}</span>
        <span class="toggle-text">Stroj je v poriadku<small>kompletný, funkčný, nepoškodený a vyčistený</small></span>
      </label>
      <section class="card" id="damage">
        <label class="field"><span>Čo nie je v poriadku?</span>
          <textarea id="note" rows="3" placeholder="napr. prasknutá hubica, chýba hadica"></textarea>
        </label>
      </section>
      <section class="card">
        <span class="section-label">Vrátená záloha</span>
        <div class="chips" id="refund-chips">
          <button type="button" class="chip active" data-v="${dep}">Celá · ${money(dep)}</button>
          <button type="button" class="chip" data-v="custom">Iná suma</button>
        </div>
        <label class="field" id="refund-field" hidden><span>Suma (€)</span>
          <input type="number" id="refund" inputmode="decimal" min="0" max="${dep}" step="1" value="${dep}">
        </label>
      </section>
      ${padHtml('sig', `Podpis – ${esc(customerName(r))}`)}
      <p class="small muted" id="confirm-text" style="padding:0 4px"></p>`,
    bar: '<button class="btn primary" id="submit" disabled>Potvrdiť vrátenie</button>',
  });
  const btn = $('#submit');
  const refund = () => Math.max(0, Math.min(dep, Number($('#refund').value) || 0));
  const update = () => {
    const ok = $('#ok').checked;
    $('#damage').hidden = ok;
    $('#confirm-text').textContent = `Zákazník podpisom potvrdzuje vrátenie stroja${ok ? ' v nepoškodenom stave' : ''} a prevzatie zálohy ${money(refund())} v hotovosti.`;
    btn.textContent = `Vrátiť zálohu ${money(refund())}`;
    btn.disabled = pad.isEmpty() || (!ok && !$('#note').value.trim());
  };
  const pad = mountSignature('sig', update);
  $('#ok').addEventListener('change', update);
  $('#note').addEventListener('input', update);
  $('#refund').addEventListener('input', update);
  $$('#refund-chips .chip').forEach((c) => c.addEventListener('click', () => {
    $$('#refund-chips .chip').forEach((x) => x.classList.toggle('active', x === c));
    const custom = c.dataset.v === 'custom';
    $('#refund-field').hidden = !custom;
    if (custom) $('#refund').focus();
    else $('#refund').value = c.dataset.v;
    update();
  }));
  update();
  btn.addEventListener('click', () => busy(btn, 'Odosielam protokol…', async () => {
    const u = await api('POST', `/api/rentals/${id}/return`, {
      return_ok: $('#ok').checked,
      return_note: $('#ok').checked ? '' : $('#note').value.trim(),
      deposit_returned: refund(),
      signature: pad.toDataURL(),
    });
    Object.keys(listCache).forEach((k) => delete listCache[k]);
    showDone({ title: 'Stroj je vrátený', rental: u, kind: 'return' });
  }));
}

// ---------- Nastavenia ----------

async function viewSettings() {
  await loadBasics(true);
  const s = state.settings;
  const f = (name, label, attrs = '', cls = '') => `
    <label class="field ${cls}"><span>${label}</span><input id="s-${name}" name="${name}" value="${esc(s[name])}" ${attrs}></label>`;
  render({
    nav: 'settings',
    body: `
      <div class="hello"><span class="eyebrow">Požičovňa</span><h1>Nastavenia</h1></div>

      <form id="settings" class="card">
        <span class="section-label">Firma v zmluve</span>
        <div class="grid">
          ${f('company_name', 'Názov alebo meno', 'placeholder="napr. Tepuj s.r.o."', 'full')}
          ${f('company_address', 'Adresa', '', 'full')}
          ${f('company_ico', 'IČO', 'inputmode="numeric"')}
          ${f('company_dic', 'DIČ', 'inputmode="numeric"')}
          ${f('company_phone', 'Telefón', 'type="tel"')}
          ${f('company_email', 'Email', 'type="email" autocapitalize="off"')}
        </div>
        <span class="section-label">Ceny</span>
        <div class="grid">
          ${f('default_price', 'Nájomné (€)', 'type="number" step="0.5" min="0" inputmode="decimal"')}
          ${f('deposit', 'Záloha (€)', 'type="number" step="1" min="0" inputmode="decimal"')}
          ${f('late_fee', 'Za deň omeškania (€)', 'type="number" step="0.5" min="0" inputmode="decimal"', 'full')}
        </div>
        <label class="field"><span>Doplňujúce podmienky zmluvy</span>
          <textarea id="s-extra_terms" name="extra_terms" rows="3" placeholder="nepovinné">${esc(s.extra_terms)}</textarea>
        </label>
        <button class="btn primary block" type="submit">Uložiť</button>
      </form>

      <section class="card">
        <span class="section-label">Tvoj podpis</span>
        <p class="small muted">Podpíšeš sa raz, vkladá sa do každej zmluvy a protokolu.</p>
        ${s.owner_signature ? `<div class="owner-sig" id="owner-current"><img src="${s.owner_signature}" alt="Uložený podpis"></div>
          <button class="btn secondary block" id="resign">${I.edit(18)}Podpísať znova</button>` : ''}
        <div id="owner-pad" ${s.owner_signature ? 'hidden' : ''}>
          ${padHtml('owner-sig', 'Podpis prenajímateľa')}
          <button class="btn primary block" id="save-sig" disabled style="margin-top:10px">Uložiť podpis</button>
        </div>
      </section>

      <section class="card">
        <div class="card-title"><span class="section-label">Stroje</span>
          <button class="btn quiet sm" id="add-machine">${I.plus(16)}Pridať</button></div>
        <div id="machines"></div>
      </section>

      <section class="card">
        <span class="section-label">Email</span>
        <p class="small muted">${state.me.mailConfigured ? 'Odosielanie je zapnuté. Skús si poslať test.' : 'Odosielanie nie je nastavené – doplň SMTP v súbore .env na serveri.'}</p>
        <button class="btn secondary block" id="test-email">${I.send(18)}Poslať testovací email</button>
      </section>

      ${DEMO ? '' : `<button class="btn danger block" id="logout">${I.logout(20)}Odhlásiť sa</button>`}`,
  });

  $('#settings').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    busy(e.submitter, 'Ukladám…', async () => {
      state.settings = await api('PUT', '/api/settings', data);
      toast('Nastavenia uložené.', 'ok');
    });
  });

  $('#resign')?.addEventListener('click', (e) => {
    e.currentTarget.hidden = true;
    $('#owner-current').hidden = true;
    $('#owner-pad').hidden = false;
    window.dispatchEvent(new Event('resize'));
  });
  const saveBtn = $('#save-sig');
  const pad = mountSignature('owner-sig', () => (saveBtn.disabled = pad.isEmpty()));
  saveBtn.addEventListener('click', () => busy(saveBtn, 'Ukladám…', async () => {
    state.settings = await api('PUT', '/api/settings', { owner_signature: pad.toDataURL() });
    toast('Podpis uložený.', 'ok');
    viewSettings();
  }));

  const machineForm = (m = {}) => promptSheet(m.id ? 'Upraviť stroj' : 'Nový stroj', [
    { name: 'name', label: 'Názov', value: m.name, attrs: 'required placeholder="napr. Kärcher Puzzi 10/1"' },
    { name: 'serial', label: 'Výrobné číslo', value: m.serial },
    { name: 'accessories', label: 'Príslušenstvo', value: m.accessories, attrs: 'placeholder="hubica na koberce, ručná hubica"' },
  ], m.id ? 'Uložiť' : 'Pridať stroj');

  const renderMachines = () => {
    $('#machines').innerHTML = state.machines.length ? state.machines.map((m) => `
      <div class="machine">
        <span class="m-ic">${I.machine(20)}</span>
        <div class="m-main"><b>${esc(m.name)}</b><span>${m.rented ? '<em class="rented">požičaný</em> · ' : ''}${esc([m.serial && `v. č. ${m.serial}`, m.accessories].filter(Boolean).join(' · ') || 'bez podrobností')}</span></div>
        <button class="icon-btn" data-edit="${m.id}" aria-label="Upraviť ${esc(m.name)}">${I.edit(18)}</button>
        <button class="icon-btn" data-del="${m.id}" aria-label="Odstrániť ${esc(m.name)}">${I.trash(18)}</button>
      </div>`).join('') : '<p class="small muted">Zatiaľ žiadne stroje. Pridaj prvý.</p>';
    $$('[data-del]').forEach((b) => b.addEventListener('click', async () => {
      const m = state.machines.find((x) => String(x.id) === b.dataset.del);
      if (!(await confirmSheet(`Odstrániť ${m.name}?`, 'Staré zmluvy s týmto strojom zostanú.', { ok: 'Odstrániť', danger: true }))) return;
      await api('DELETE', `/api/machines/${m.id}`);
      state.machines = await api('GET', '/api/machines');
      renderMachines();
    }));
    $$('[data-edit]').forEach((b) => b.addEventListener('click', async () => {
      const m = state.machines.find((x) => String(x.id) === b.dataset.edit);
      const data = await machineForm(m);
      if (!data || !data.name.trim()) return;
      await api('PUT', `/api/machines/${m.id}`, data);
      state.machines = await api('GET', '/api/machines');
      renderMachines();
    }));
  };
  renderMachines();
  $('#add-machine').addEventListener('click', async () => {
    const data = await machineForm();
    if (!data || !data.name.trim()) return;
    try {
      await api('POST', '/api/machines', data);
      state.machines = await api('GET', '/api/machines');
      renderMachines();
      toast('Stroj pridaný.', 'ok');
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  $('#test-email').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    const data = await promptSheet('Testovací email', [{ name: 'to', label: 'Poslať na', value: s.company_email, type: 'email', attrs: 'required autocapitalize="off"' }], 'Odoslať');
    if (!data?.to) return;
    busy(btn, 'Odosielam…', async () => {
      await api('POST', '/api/settings/test-email', { to: data.to });
      toast(`Odoslané na ${data.to}.`, 'ok');
    });
  });

  $('#logout')?.addEventListener('click', async () => {
    await api('POST', '/api/logout');
    state = { settings: null, machines: [], me: null };
    location.hash = '#/login';
  });
}
