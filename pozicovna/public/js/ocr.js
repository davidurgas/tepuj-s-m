// Čítanie údajov z fotiek OP priamo v telefóne (Tesseract.js, bez posielania
// fotiek tretím stranám). Zo zadnej strany čítame MRZ (3 riadky so znakmi <<<),
// ktorá má kontrolné číslice, a k tomu bežný text (adresa, rodné číslo, diakritika).

import { parseMrzFromText, restoreDiacritics, findBirthNumber, findAddress } from './mrz.js';

// Absolútne adresy – worker ich rieši voči vlastnej adrese, nie voči stránke.
const abs = (p) => new URL(p, document.baseURI).href.replace(/\/$/, '');
const OPTS = {
  workerPath: abs('vendor/tesseract/worker.min.js'),
  corePath: abs('vendor/tesseract-core/'),
  langPath: abs('vendor/tessdata/'),
};

let libPromise;
function loadLib() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  libPromise ||= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = abs('vendor/tesseract/tesseract.min.js');
    s.onload = () => resolve(window.Tesseract);
    s.onerror = () => reject(new Error('Nepodarilo sa načítať OCR knižnicu.'));
    document.head.appendChild(s);
  });
  return libPromise;
}

const workers = {};
function worker(lang) {
  workers[lang] ||= loadLib().then(async (T) => {
    const w = await T.createWorker(lang, 1, OPTS);
    if (lang === 'eng') {
      await w.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<',
        tessedit_pageseg_mode: '6',
      });
    }
    return w;
  });
  return workers[lang];
}

// Načíta OCR a jazykové dáta vopred (kým sa fotí), aby čítanie potom trvalo len chvíľu.
export function warmUpOcr() {
  worker('eng').catch(() => {});
  worker('slk').catch(() => {});
}

// Predspracovanie: odtiene sivej, zväčšenie malých fotiek, natiahnutie kontrastu.
async function prepare(blob, { crop } = {}) {
  const bmp = await createImageBitmap(blob);
  const sx = 0;
  const sy = crop ? Math.round(bmp.height * crop) : 0;
  const sw = bmp.width;
  const sh = bmp.height - sy;
  const scale = Math.min(2.5, 2200 / sw);
  const c = document.createElement('canvas');
  c.width = Math.round(sw * scale);
  c.height = Math.round(sh * scale);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(bmp, sx, sy, sw, sh, 0, 0, c.width, c.height);
  bmp.close?.();
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  let min = 255;
  let max = 0;
  const gray = new Uint8ClampedArray(d.length / 4);
  for (let i = 0, j = 0; i < d.length; i += 4, j++) {
    const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    gray[j] = g;
    if (g < min) min = g;
    if (g > max) max = g;
  }
  const range = Math.max(1, max - min);
  for (let i = 0, j = 0; i < d.length; i += 4, j++) {
    const v = ((gray[j] - min) / range) * 255;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

async function readMrz(back) {
  const w = await worker('eng');
  // Najprv spodná časť karty (MRZ je dole), potom celá fotka.
  let best = null;
  for (const crop of [0.45, 0]) {
    const { data } = await w.recognize(await prepare(back, { crop }));
    const mrz = parseMrzFromText(data.text);
    if (mrz && (!best || score(mrz) > score(best))) best = mrz;
    if (best?.valid) break;
  }
  return best;
}

const score = (m) => Object.values(m.checks).filter(Boolean).length + (m.surname ? 1 : 0);

async function readText(blob) {
  const w = await worker('slk');
  // Bežný text čítame z pôvodnej fotky – úprava kontrastu zbytočne ničí diakritiku.
  const { data } = await w.recognize(blob);
  return data.text;
}

/**
 * @returns {Promise<{fields: object, mrz: object|null, warnings: string[]}>}
 */
export async function scanIdCard(front, back, onProgress = () => {}) {
  const warnings = [];
  onProgress('Pripravujem čítanie…');
  await loadLib();

  onProgress('Čítam údaje z OP…');
  // MRZ (angličtina) a bežný text (slovenčina) bežia v dvoch workeroch naraz.
  const [mrz, frontText, backText] = await Promise.all([
    back ? readMrz(back).catch(() => null) : null,
    front ? readText(front).catch(() => '') : '',
    back ? readText(back).catch(() => '') : '',
  ]);

  const fields = {};
  if (mrz) {
    fields.first_name = restoreDiacritics(mrz.givenNames, frontText);
    fields.last_name = restoreDiacritics(mrz.surname, frontText);
    fields.birth_date = mrz.birthDate;
    fields.id_number = mrz.documentNumber;
    fields.id_expiry = mrz.expiryDate;
    if (!mrz.valid) warnings.push('Niektoré údaje z OP nesedia s kontrolnými číslicami – skontroluj ich.');
    if (mrz.expiryDate && mrz.expiryDate < new Date().toISOString().slice(0, 10)) warnings.push('Pozor: platnosť OP už uplynula!');
  } else {
    warnings.push('Strojový kód (<<<) na zadnej strane sa nepodarilo prečítať – odfoť ju znova ostrejšie, alebo údaje doplň ručne.');
  }
  const bn = findBirthNumber(`${backText}\n${frontText}`);
  if (bn) fields.birth_number = bn;
  const address = findAddress(backText) || findAddress(frontText);
  if (address) fields.address = address;
  else warnings.push('Adresu sa nepodarilo prečítať – doplň ju ručne.');

  onProgress('');
  return { fields, mrz, warnings, text: { front: frontText, back: backText } };
}

// Uvoľní pamäť (volá sa po dokončení sprievodcu).
export async function terminateOcr() {
  for (const k of Object.keys(workers)) {
    (await workers[k]).terminate();
    delete workers[k];
  }
}
