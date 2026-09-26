import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

export const DATA_DIR = path.resolve(process.env.DATA_DIR || 'data');
export const FILES_DIR = path.join(DATA_DIR, 'files');
fs.mkdirSync(FILES_DIR, { recursive: true });

export const db = new DatabaseSync(path.join(DATA_DIR, 'pozicovna.db'));
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS machines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  serial TEXT,
  accessories TEXT,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS rentals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'signed',   -- signed | active | returned
  created_at TEXT NOT NULL,
  first_name TEXT, last_name TEXT, birth_date TEXT, birth_number TEXT,
  id_number TEXT, id_expiry TEXT, address TEXT, email TEXT, phone TEXT,
  machine_id INTEGER, machine_name TEXT, machine_serial TEXT, accessories TEXT,
  price REAL NOT NULL DEFAULT 0,
  deposit REAL NOT NULL DEFAULT 0,
  return_due TEXT,
  note TEXT,
  id_consent INTEGER NOT NULL DEFAULT 0,
  paid_at TEXT,
  contract_email_at TEXT, contract_email_error TEXT,
  returned_at TEXT,
  return_ok INTEGER,
  return_note TEXT,
  deposit_returned REAL,
  return_email_at TEXT, return_email_error TEXT
);
`);

export const DEFAULT_SETTINGS = {
  company_name: '',
  company_address: '',
  company_ico: '',
  company_dic: '',
  company_phone: '',
  company_email: '',
  default_price: '25',
  deposit: '100',
  late_fee: '25',
  extra_terms: '',
  owner_signature: '', // data URL PNG
};

export function getSettings() {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const out = { ...DEFAULT_SETTINGS };
  for (const { key, value } of rows) if (key in DEFAULT_SETTINGS) out[key] = value ?? '';
  return out;
}

export function saveSettings(patch) {
  const stmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  for (const [k, v] of Object.entries(patch)) {
    if (k in DEFAULT_SETTINGS) stmt.run(k, v == null ? '' : String(v));
  }
  return getSettings();
}

export function rentalDir(id) {
  const dir = path.join(FILES_DIR, String(id));
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// Poradové číslo zmluvy v tvare RRRR-0001.
export function nextNumber() {
  const year = new Date().getFullYear();
  const row = db.prepare("SELECT number FROM rentals WHERE number LIKE ? ORDER BY number DESC LIMIT 1").get(`${year}-%`);
  const seq = row ? parseInt(row.number.split('-')[1], 10) + 1 : 1;
  return `${year}-${String(seq).padStart(4, '0')}`;
}
