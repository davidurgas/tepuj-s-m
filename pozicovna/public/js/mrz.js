// Parsovanie strojovo čitateľnej zóny (MRZ) občianskeho preukazu – formát TD1
// (3 riadky × 30 znakov, zadná strana slovenského OP). Modul beží v prehliadači
// aj v Node (testy), preto nemá žiadne závislosti.

const WEIGHTS = [7, 3, 1];

export function charValue(c) {
  if (c >= '0' && c <= '9') return c.charCodeAt(0) - 48;
  if (c >= 'A' && c <= 'Z') return c.charCodeAt(0) - 55;
  return 0; // '<'
}

export function checkDigit(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) sum += charValue(str[i]) * WEIGHTS[i % 3];
  return String(sum % 10);
}

// Časté zámeny OCR medzi písmenami a číslicami.
const TO_DIGIT = { O: '0', Q: '0', D: '0', U: '0', I: '1', L: '1', T: '1', Z: '2', S: '5', G: '6', B: '8' };
const TO_ALPHA = { 0: 'O', 1: 'I', 2: 'Z', 5: 'S', 6: 'G', 8: 'B' };

const digits = (s) => s.replace(/[^0-9]/g, (c) => TO_DIGIT[c] ?? c);
const alphas = (s) => s.replace(/[0-9]/g, (c) => TO_ALPHA[c] ?? c);

// Číslo dokladu je alfanumerické – ak nesedí kontrolná číslica, skúsime
// zameniť dvojznačné znaky (0/O, 1/I, 8/B …), kým nesedí.
function repairAlnum(value, check) {
  if (checkDigit(value) === check) return { value, ok: true };
  const pairs = { ...TO_DIGIT, ...TO_ALPHA };
  const positions = [...value].map((c, i) => (pairs[c] ? i : -1)).filter((i) => i >= 0).slice(0, 10);
  for (let mask = 1; mask < 1 << positions.length; mask++) {
    const chars = [...value];
    positions.forEach((p, bit) => {
      if (mask & (1 << bit)) chars[p] = pairs[chars[p]];
    });
    const candidate = chars.join('');
    if (checkDigit(candidate) === check) return { value: candidate, ok: true };
  }
  return { value, ok: false };
}

function yymmdd(s, { future = false } = {}) {
  if (!/^\d{6}$/.test(s)) return '';
  const yy = +s.slice(0, 2);
  const mm = s.slice(2, 4);
  const dd = s.slice(4, 6);
  const nowYY = new Date().getFullYear() % 100;
  // Narodenie je v minulosti; platnosť dokladu býva v budúcnosti (max. +20 rokov).
  const century = future ? (yy < nowYY - 30 ? 2100 : 2000) : yy > nowYY ? 1900 : 2000;
  return `${century + yy}-${mm}-${dd}`;
}

// Riadok OCR → iba znaky MRZ, bez medzier. „«“ a podobné čítanie výplne opravíme na „<“.
export function cleanLine(line) {
  return line
    .toUpperCase()
    .replace(/[«‹(\[{]/g, '<')
    .replace(/\s+/g, '')
    .replace(/[^A-Z0-9<]/g, '');
}

// Nájde tri riadky MRZ v ľubovoľnom texte z OCR.
export function findTd1Lines(text) {
  const lines = text.split(/\r?\n/).map(cleanLine).filter((l) => l.length >= 3);
  // Druhý riadok má najcharakteristickejší tvar: RRMMDD C S RRMMDD C NÁR …
  // Tretí riadok (meno) môže byť krátky, ak OCR nezachytí výplň <<<.
  const line2Re = /[0-9OIZSBDQ]{6}[0-9OIZSBDQ][MF<][0-9OIZSBDQ]{6}[0-9OIZSBDQ][A-Z<]{3}/;
  for (let i = 1; i < lines.length; i++) {
    if (line2Re.test(lines[i]) && lines[i - 1].length >= 20) return [lines[i - 1], lines[i], lines[i + 1] || ''];
  }
  // Záloha: riadok začínajúci „ID“/„I<“ a dva nasledujúce.
  const start = lines.findIndex((l) => /^[IAC][A-Z<][A-Z<]{3}/.test(l) && l.includes('<'));
  if (start >= 0 && start + 2 < lines.length) return lines.slice(start, start + 3);
  return null;
}

const pad30 = (l) => (l + '<'.repeat(30)).slice(0, 30);

export function parseTd1(rawLines) {
  let [l1, l2, l3] = rawLines.map(cleanLine);
  // Ak OCR na začiatku riadku pridal šum, zarovnáme podľa známych vzorov.
  const idx1 = l1.search(/[IAC][A-Z<][A-Z<]{3}/);
  if (idx1 > 0) l1 = l1.slice(idx1);
  const idx2 = l2.search(/[0-9OIZSBDQ]{7}[MF<]/);
  if (idx2 > 0) l2 = l2.slice(idx2);
  l1 = pad30(l1);
  l2 = pad30(l2);
  l3 = l3.replace(/^[^A-Z]+/, '');

  const docType = l1.slice(0, 2).replace(/</g, '');
  const issuer = alphas(l1.slice(2, 5)).replace(/</g, '');
  const docNumberRaw = l1.slice(5, 14).replace(/</g, '');
  const docNumberCheck = digits(l1.slice(14, 15));
  const optional1 = l1.slice(15, 30).replace(/<+$/, '');

  const birthRaw = digits(l2.slice(0, 6));
  const birthCheck = digits(l2.slice(6, 7));
  const sexChar = l2.slice(7, 8);
  const expiryRaw = digits(l2.slice(8, 14));
  const expiryCheck = digits(l2.slice(14, 15));
  const nationality = alphas(l2.slice(15, 18)).replace(/</g, '');

  const doc = repairAlnum(docNumberRaw, docNumberCheck);

  // Meno: PRIEZVISKO<<MENO<DRUHE<MENO<<<<
  // Oddeľovač priezviska a mena je „<<“; ak OCR jeden „<“ stratil, berieme prvý „<“.
  let sep = l3.indexOf('<<');
  let sepLen = 2;
  if (sep < 0 || (!/[A-Z]/.test(l3.slice(sep)) && l3.slice(0, sep).includes('<'))) {
    sep = l3.indexOf('<');
    sepLen = 1;
  }
  const surnamePart = sep >= 0 ? l3.slice(0, sep) : l3;
  const givenPart = sep >= 0 ? l3.slice(sep + sepLen) : '';
  const givenTokens = [];
  for (const t of givenPart.split('<')) {
    if (!t) break;
    givenTokens.push(t);
  }
  const clean = (s) => alphas(s).replace(/[^A-Z ]/g, '').trim();

  const checks = {
    docNumber: doc.ok,
    birthDate: checkDigit(birthRaw) === birthCheck,
    expiryDate: checkDigit(expiryRaw) === expiryCheck,
  };

  return {
    docType,
    issuer,
    documentNumber: doc.value,
    optional: optional1,
    birthDate: yymmdd(birthRaw),
    sex: sexChar === 'M' ? 'M' : sexChar === 'F' ? 'F' : '',
    expiryDate: yymmdd(expiryRaw, { future: true }),
    nationality,
    surname: clean(surnamePart.replace(/</g, ' ')),
    givenNames: clean(givenTokens.join(' ')),
    checks,
    valid: checks.docNumber && checks.birthDate && checks.expiryDate,
  };
}

export function parseMrzFromText(text) {
  const lines = findTd1Lines(text);
  return lines ? parseTd1(lines) : null;
}

// ---- Pomocníci pre doplnenie údajov z textu OP (slovenský jazyk) ----

const DIACRITICS_MAP = { Ä: 'AE', Ö: 'OE', Ü: 'UE' };

export function stripDiacritics(s, icao = false) {
  let out = s.toUpperCase();
  if (icao) out = out.replace(/[ÄÖÜ]/g, (c) => DIACRITICS_MAP[c]);
  return out.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function titleCase(s) {
  return s
    .toLowerCase()
    .replace(/(^|[\s-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
}

// MRZ nemá diakritiku (KOVAC) – nájdeme rovnaké slovo s diakritikou v texte
// prednej strany (Kováč). Ak ho nenájdeme, vrátime aspoň pekné veľké písmená.
export function restoreDiacritics(mrzName, frontText) {
  if (!mrzName) return '';
  const words = (frontText || '').normalize('NFC').match(/[\p{L}\p{M}]+/gu) || [];
  return mrzName
    .split(/\s+/)
    .map((token) => {
      const hit = words.find((w) => stripDiacritics(w) === token || stripDiacritics(w, true) === token);
      if (hit) return titleCase(hit);
      // MRZ sa od textu na prednej strane líši o jeden znak (OCR zamenil napr. J/Z
      // v MRZ) – text z prednej strany číta OCR so slovníkom, takže mu veríme viac.
      const near = token.length >= 3 && words.find((w) => w.length === token.length && w === w.toUpperCase()
        && [...w].filter((ch, i) => stripDiacritics(ch) !== token[i]).length <= 1);
      if (near) return titleCase(near);
      return titleCase(token);
    })
    .join(' ');
}

// Rodné číslo: 6 číslic, lomka, 3–4 číslice (napr. 850101/1234).
export function findBirthNumber(text) {
  const m = (text || '').replace(/[ ]/g, '').match(/(\d{6})\/?(\d{3,4})(?!\d)/);
  if (!m) return '';
  return `${m[1]}/${m[2]}`;
}

// Adresa trvalého pobytu zo zadnej strany: text za nadpisom „Trvalý pobyt / Address“
// až po ďalší nadpis. Je to heuristika – vždy sa dá ručne opraviť.
export function findAddress(text) {
  const lines = (text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const labelIdx = lines.findIndex((l) => /pobyt|address|bydlisko/i.test(stripDiacritics(l)) || /POBYT/.test(stripDiacritics(l)));
  if (labelIdx < 0) return '';
  const stop = /(VYDAL|AUTHORITY|DATUM|DATE|RODNE|PERSONAL|MIESTO|PLACE|OSOBITNE|REMARK|IDSVK|<<)/;
  const out = [];
  // Adresa môže byť aj na tom istom riadku za nadpisom.
  const sameLine = lines[labelIdx].replace(/.*(address|pobyt)\s*[:/]?\s*/i, '').replace(/^.*\/\s*address\s*/i, '');
  if (sameLine && !/address|pobyt/i.test(sameLine) && sameLine.length > 4) out.push(sameLine);
  for (let i = labelIdx + 1; i < lines.length && out.length < 3; i++) {
    const l = lines[i];
    if (stop.test(stripDiacritics(l))) break;
    if (l.replace(/[^\p{L}\d]/gu, '').length < 3) continue;
    out.push(l);
  }
  return out
    .join(', ')
    .replace(/\s+,/g, ',')
    .replace(/[|_~]/g, '')
    .trim();
}
