import express from 'express';
import compression from 'compression';
import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

try {
  process.loadEnvFile();
} catch {
  /* .env je voliteľný – premenné môžu prísť aj z prostredia hostingu */
}

const { db, DATA_DIR, getSettings, saveSettings, rentalDir, nextNumber } = await import('./db.js');
const { contractPdf, returnPdf } = await import('./pdf.js');
const { mailConfigured, sendContractEmail, sendReturnEmail, sendTestEmail } = await import('./mail.js');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const pkgDir = (name) => path.dirname(require.resolve(`${name}/package.json`));

const PASSWORD = process.env.APP_PASSWORD || '';
if (!PASSWORD) console.warn('⚠️  APP_PASSWORD nie je nastavené – prihlásenie nebude fungovať. Nastav ho v .env.');

// Tajomstvo na podpisovanie prihlasovacieho cookie; ak nie je v .env, vygeneruje sa raz a uloží.
const SECRET = process.env.SESSION_SECRET || (() => {
  const f = path.join(DATA_DIR, '.session-secret');
  if (!fs.existsSync(f)) fs.writeFileSync(f, crypto.randomBytes(32).toString('hex'), { mode: 0o600 });
  return fs.readFileSync(f, 'utf8').trim();
})();

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Referrer-Policy', 'no-referrer');
  next();
});

// ---------- Prihlásenie ----------

const COOKIE = 'pz_session';
const SESSION_DAYS = 30;

function sign(value) {
  return crypto.createHmac('sha256', SECRET).update(value).digest('base64url');
}

function readSession(req) {
  const raw = (req.headers.cookie || '').split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return false;
  const [expires, mac] = decodeURIComponent(raw.slice(COOKIE.length + 1)).split('.');
  if (!expires || !mac) return false;
  const expected = sign(expires);
  if (mac.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return false;
  return Number(expires) > Date.now();
}

function setSession(req, res) {
  const expires = String(Date.now() + SESSION_DAYS * 864e5);
  res.cookie(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: req.secure,
    maxAge: SESSION_DAYS * 864e5,
    path: '/',
  });
}

const attempts = new Map();
app.post('/api/login', (req, res) => {
  const key = req.ip;
  const a = attempts.get(key) || { n: 0, until: 0 };
  if (a.until > Date.now()) return res.status(429).json({ error: 'Príliš veľa pokusov, skús to o pár minút.' });
  const given = Buffer.from(String(req.body?.password || ''));
  const expected = Buffer.from(PASSWORD);
  const ok = PASSWORD && given.length === expected.length && crypto.timingSafeEqual(given, expected);
  if (!ok) {
    a.n += 1;
    if (a.n >= 5) Object.assign(a, { n: 0, until: Date.now() + 5 * 60e3 });
    attempts.set(key, a);
    return res.status(401).json({ error: 'Nesprávne heslo.' });
  }
  attempts.delete(key);
  setSession(req, res);
  res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie(COOKIE, { path: '/' });
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => res.json({ loggedIn: readSession(req), mailConfigured: mailConfigured() }));

const auth = (req, res, next) => (readSession(req) ? next() : res.status(401).json({ error: 'Nie si prihlásený.' }));
app.use('/api', auth);

// ---------- Pomocné ----------

const RENTAL_FIELDS = ['first_name', 'last_name', 'birth_date', 'birth_number', 'id_number', 'id_expiry', 'address', 'email', 'phone', 'return_due', 'note'];
const FILES = {
  id_front: 'id-front.jpg',
  id_back: 'id-back.jpg',
  signature: 'signature-contract.png',
  return_signature: 'signature-return.png',
  contract: 'zmluva.pdf',
  return: 'vratenie.pdf',
};

const now = () => new Date().toISOString();
const filePath = (id, kind) => path.join(rentalDir(id), FILES[kind]);
const hasFile = (id, kind) => fs.existsSync(path.join(DATA_DIR, 'files', String(id), FILES[kind]));
const str = (v, max = 500) => String(v ?? '').trim().slice(0, max);

function getRental(id) {
  return db.prepare('SELECT * FROM rentals WHERE id = ?').get(Number(id));
}

function present(r) {
  if (!r) return r;
  const files = {};
  for (const kind of Object.keys(FILES)) files[kind] = hasFile(r.id, kind) ? `/api/rentals/${r.id}/files/${kind}` : null;
  return { ...r, files };
}

function dataUrlToBuffer(dataUrl) {
  const m = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ''));
  if (!m) return null;
  const buf = Buffer.from(m[1], 'base64');
  return buf.length > 200 ? buf : null;
}

const wrapAsync = (fn) => (req, res) => Promise.resolve(fn(req, res)).catch((e) => {
  console.error(e);
  res.status(500).json({ error: e.message || 'Chyba servera' });
});

// ---------- Nastavenia ----------

app.get('/api/settings', (req, res) => res.json(getSettings()));
app.put('/api/settings', (req, res) => res.json(saveSettings(req.body || {})));
app.post('/api/settings/test-email', wrapAsync(async (req, res) => {
  const s = getSettings();
  const to = str(req.body?.to) || s.company_email;
  await sendTestEmail(to, s);
  res.json({ ok: true, to });
}));

// ---------- Stroje ----------

app.get('/api/machines', (req, res) => {
  res.json(db.prepare('SELECT m.*, (SELECT COUNT(*) FROM rentals r WHERE r.machine_id = m.id AND r.status != \'returned\') AS rented FROM machines m WHERE active = 1 ORDER BY name').all());
});
app.post('/api/machines', (req, res) => {
  const { name, serial, accessories } = req.body || {};
  if (!str(name)) return res.status(400).json({ error: 'Zadaj názov stroja.' });
  const info = db.prepare('INSERT INTO machines (name, serial, accessories) VALUES (?, ?, ?)').run(str(name, 120), str(serial, 80), str(accessories));
  res.json(db.prepare('SELECT * FROM machines WHERE id = ?').get(info.lastInsertRowid));
});
app.put('/api/machines/:id', (req, res) => {
  const { name, serial, accessories } = req.body || {};
  db.prepare('UPDATE machines SET name = ?, serial = ?, accessories = ? WHERE id = ?').run(str(name, 120), str(serial, 80), str(accessories), Number(req.params.id));
  res.json({ ok: true });
});
app.delete('/api/machines/:id', (req, res) => {
  db.prepare('UPDATE machines SET active = 0 WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// ---------- Požičania ----------

app.get('/api/rentals', (req, res) => {
  const { status, q } = req.query;
  const where = [];
  const params = [];
  if (status === 'open') where.push("status != 'returned'");
  else if (status) {
    where.push('status = ?');
    params.push(String(status));
  }
  if (q) {
    where.push("(first_name || ' ' || last_name || ' ' || IFNULL(number,'') || ' ' || IFNULL(phone,'') || ' ' || IFNULL(email,'') || ' ' || IFNULL(machine_name,'')) LIKE ?");
    params.push(`%${q}%`);
  }
  const sql = `SELECT id, number, status, created_at, first_name, last_name, phone, machine_name, price, deposit, return_due, returned_at, paid_at, contract_email_error, return_email_error
    FROM rentals ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY id DESC LIMIT 300`;
  res.json(db.prepare(sql).all(...params));
});

app.get('/api/rentals/:id', (req, res) => {
  const r = getRental(req.params.id);
  if (!r) return res.status(404).json({ error: 'Požičanie neexistuje.' });
  res.json(present(r));
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 2 },
  fileFilter: (req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
});

// Vytvorenie = zákazník podpísal zmluvu (ešte nezaplatené).
app.post('/api/rentals', upload.fields([{ name: 'id_front', maxCount: 1 }, { name: 'id_back', maxCount: 1 }]), wrapAsync(async (req, res) => {
  let d;
  try {
    d = JSON.parse(req.body?.data || '{}');
  } catch {
    return res.status(400).json({ error: 'Neplatné údaje.' });
  }
  const signature = dataUrlToBuffer(d.signature);
  if (!signature) return res.status(400).json({ error: 'Chýba podpis zákazníka.' });
  if (!str(d.first_name) || !str(d.last_name)) return res.status(400).json({ error: 'Chýba meno a priezvisko zákazníka.' });
  if (!d.id_consent) return res.status(400).json({ error: 'Chýba súhlas zákazníka s kópiou dokladu.' });

  const s = getSettings();
  const machine = d.machine_id ? db.prepare('SELECT * FROM machines WHERE id = ?').get(Number(d.machine_id)) : null;
  const row = {
    number: nextNumber(),
    status: 'signed',
    created_at: now(),
    ...Object.fromEntries(RENTAL_FIELDS.map((f) => [f, str(d[f])])),
    machine_id: machine?.id ?? null,
    machine_name: machine?.name ?? str(d.machine_name, 120),
    machine_serial: machine?.serial ?? str(d.machine_serial, 80),
    accessories: machine?.accessories ?? '',
    price: Number(d.price) || 0,
    deposit: d.deposit != null && d.deposit !== '' ? Number(d.deposit) : Number(s.deposit) || 0,
    id_consent: 1,
  };
  const cols = Object.keys(row);
  const info = db.prepare(`INSERT INTO rentals (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`).run(...Object.values(row));
  const id = Number(info.lastInsertRowid);
  fs.writeFileSync(filePath(id, 'signature'), signature);
  for (const kind of ['id_front', 'id_back']) {
    const f = req.files?.[kind]?.[0];
    if (f) fs.writeFileSync(filePath(id, kind), f.buffer);
  }
  res.json(present(getRental(id)));
}));

// Zákazník zaplatil nájomné + zálohu → PDF zmluva s potvrdením platby → email.
app.post('/api/rentals/:id/pay', wrapAsync(async (req, res) => {
  const r = getRental(req.params.id);
  if (!r) return res.status(404).json({ error: 'Požičanie neexistuje.' });
  if (!r.paid_at) {
    db.prepare("UPDATE rentals SET paid_at = ?, status = 'active' WHERE id = ?").run(now(), r.id);
  }
  res.json(present(await deliverContract(r.id)));
}));

async function deliverContract(id) {
  const r = getRental(id);
  const s = getSettings();
  const pdf = await contractPdf(r, s, filePath(id, 'signature'));
  fs.writeFileSync(filePath(id, 'contract'), pdf);
  try {
    await sendContractEmail(r, s, pdf);
    db.prepare('UPDATE rentals SET contract_email_at = ?, contract_email_error = NULL WHERE id = ?').run(now(), id);
  } catch (e) {
    console.error('Email so zmluvou sa nepodarilo odoslať:', e.message);
    db.prepare('UPDATE rentals SET contract_email_error = ? WHERE id = ?').run(e.message, id);
  }
  return getRental(id);
}

app.post('/api/rentals/:id/return', wrapAsync(async (req, res) => {
  const r = getRental(req.params.id);
  if (!r) return res.status(404).json({ error: 'Požičanie neexistuje.' });
  if (!r.paid_at) return res.status(400).json({ error: 'Požičanie ešte nie je zaplatené.' });
  const signature = dataUrlToBuffer(req.body?.signature);
  if (!signature) return res.status(400).json({ error: 'Chýba podpis zákazníka.' });
  const returned = Math.max(0, Math.min(Number(r.deposit), Number(req.body?.deposit_returned ?? r.deposit)));
  fs.writeFileSync(filePath(r.id, 'return_signature'), signature);
  db.prepare("UPDATE rentals SET status = 'returned', returned_at = ?, return_ok = ?, return_note = ?, deposit_returned = ? WHERE id = ?")
    .run(now(), req.body?.return_ok ? 1 : 0, str(req.body?.return_note, 1000), returned, r.id);
  res.json(present(await deliverReturn(r.id)));
}));

async function deliverReturn(id) {
  const r = getRental(id);
  const s = getSettings();
  const pdf = await returnPdf(r, s, filePath(id, 'return_signature'));
  fs.writeFileSync(filePath(id, 'return'), pdf);
  try {
    await sendReturnEmail(r, s, pdf);
    db.prepare('UPDATE rentals SET return_email_at = ?, return_email_error = NULL WHERE id = ?').run(now(), id);
  } catch (e) {
    console.error('Email o vrátení sa nepodarilo odoslať:', e.message);
    db.prepare('UPDATE rentals SET return_email_error = ? WHERE id = ?').run(e.message, id);
  }
  return getRental(id);
}

// Opätovné odoslanie emailu (napr. po oprave emailovej adresy alebo SMTP).
app.post('/api/rentals/:id/resend', wrapAsync(async (req, res) => {
  const r = getRental(req.params.id);
  if (!r) return res.status(404).json({ error: 'Požičanie neexistuje.' });
  if (req.body?.email) db.prepare('UPDATE rentals SET email = ? WHERE id = ?').run(str(req.body.email, 200), r.id);
  const which = req.body?.doc === 'return' ? 'return' : 'contract';
  if (which === 'return' && !r.returned_at) return res.status(400).json({ error: 'Stroj ešte nebol vrátený.' });
  if (which === 'contract' && !r.paid_at) return res.status(400).json({ error: 'Požičanie ešte nie je zaplatené.' });
  const updated = which === 'return' ? await deliverReturn(r.id) : await deliverContract(r.id);
  res.json(present(updated));
}));

app.patch('/api/rentals/:id', (req, res) => {
  const r = getRental(req.params.id);
  if (!r) return res.status(404).json({ error: 'Požičanie neexistuje.' });
  const allowed = ['email', 'phone', 'note', 'return_due'];
  for (const f of allowed) {
    if (f in (req.body || {})) db.prepare(`UPDATE rentals SET ${f} = ? WHERE id = ?`).run(str(req.body[f]), r.id);
  }
  res.json(present(getRental(r.id)));
});

app.delete('/api/rentals/:id', (req, res) => {
  const r = getRental(req.params.id);
  if (!r) return res.status(404).json({ error: 'Požičanie neexistuje.' });
  db.prepare('DELETE FROM rentals WHERE id = ?').run(r.id);
  fs.rmSync(path.join(DATA_DIR, 'files', String(r.id)), { recursive: true, force: true });
  res.json({ ok: true });
});

app.get('/api/rentals/:id/files/:kind', (req, res) => {
  const { id, kind } = req.params;
  if (!FILES[kind] || !hasFile(id, kind)) return res.status(404).json({ error: 'Súbor neexistuje.' });
  res.set('Cache-Control', 'private, no-store');
  const r = getRental(id);
  if (FILES[kind].endsWith('.pdf') && req.query.download) {
    return res.download(filePath(id, kind), `${kind === 'return' ? 'vratenie' : 'zmluva'}-${r?.number || id}.pdf`);
  }
  res.sendFile(filePath(id, kind));
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Neznáma požiadavka.' }));

// ---------- OCR knižnice (lokálne, bez externých CDN) ----------

app.use('/vendor/tesseract', express.static(path.join(pkgDir('tesseract.js'), 'dist'), { maxAge: '30d' }));
app.use('/vendor/tesseract-core', express.static(pkgDir('tesseract.js-core'), { maxAge: '30d' }));
for (const lang of ['eng', 'slk']) {
  app.get(`/vendor/tessdata/${lang}.traineddata.gz`, (req, res) => {
    res.set('Cache-Control', 'public, max-age=2592000');
    res.sendFile(path.join(pkgDir(`@tesseract.js-data/${lang}`), '4.0.0_best_int', `${lang}.traineddata.gz`));
  });
}

// ---------- Appka ----------

app.use(express.static(path.join(ROOT, 'public'), {
  setHeaders: (res, p) => {
    if (/\.(html|js|css|webmanifest)$/.test(p)) res.set('Cache-Control', 'no-cache');
  },
}));
app.get('*', (req, res) => res.sendFile(path.join(ROOT, 'public', 'index.html')));

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Požičovňa beží na http://localhost:${PORT}`));
