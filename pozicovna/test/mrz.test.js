import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  checkDigit, parseMrzFromText, parseTd1, restoreDiacritics, findBirthNumber, findAddress,
} from '../public/js/mrz.js';
import { slovakMrz } from './helpers.js';

// Vzor ICAO 9303 (TD1).
const ICAO = ['I<UTOD231458907<<<<<<<<<<<<<<<', '7408122F1204159UTO<<<<<<<<<<<6', 'ERIKSSON<<ANNA<MARIA<<<<<<<<<<'];

test('kontrolná číslica', () => {
  assert.equal(checkDigit('D23145890'), '7');
  assert.equal(checkDigit('740812'), '2');
  assert.equal(checkDigit('120415'), '9');
});

test('ICAO vzor', () => {
  const m = parseTd1(ICAO);
  assert.equal(m.documentNumber, 'D23145890');
  assert.equal(m.birthDate, '1974-08-12');
  assert.equal(m.surname, 'ERIKSSON');
  assert.equal(m.givenNames, 'ANNA MARIA');
  assert.equal(m.sex, 'F');
  assert.ok(m.valid);
});

test('slovenský OP v zašumenom OCR texte', () => {
  const [l1, l2, l3] = slovakMrz();
  const text = `SLOVENSKA REPUBLIKA\nTrvaly pobyt\nnieco\n${l1.replace(/</g, ' < ').slice(0, 40)}\n${l1}\n${l2}\n${l3}\n`;
  const m = parseMrzFromText(text);
  assert.equal(m.documentNumber, 'EA1234567');
  assert.equal(m.birthDate, '1985-03-15');
  assert.equal(m.expiryDate, '2031-01-01');
  assert.equal(m.surname, 'KOVAC');
  assert.equal(m.givenNames, 'JAN PETER');
  assert.ok(m.valid);
});

test('opraví zámenu O/0 a B/8 podľa kontrolných číslic', () => {
  const [l1, l2, l3] = slovakMrz({ doc: 'EB8024567', birth: '030120' });
  const noisy1 = l1.replace('EB8024567', 'EB8O24567');
  const noisy2 = l2.replace('030120', 'O3O12O');
  const m = parseTd1([noisy1, noisy2, l3]);
  assert.equal(m.documentNumber, 'EB8024567');
  assert.equal(m.birthDate, '2003-01-20');
  assert.ok(m.valid);
});

test('meno s výplňou a medzerami z OCR', () => {
  const m = parseTd1(['IDSVKEA1234567<<<<<<<<<<<<<<<<', '8503151M3101011SVK<<<<<<<<<<<0', 'NOVAKOVA << MARIA < < < <<<<<<']);
  assert.equal(m.surname, 'NOVAKOVA');
  assert.equal(m.givenNames, 'MARIA');
});

test('doplnenie diakritiky z prednej strany', () => {
  const front = 'Priezvisko / Surname\nKováč\nMeno / Given names\nJán Peter\n';
  assert.equal(restoreDiacritics('KOVAC', front), 'Kováč');
  assert.equal(restoreDiacritics('JAN PETER', front), 'Ján Peter');
  assert.equal(restoreDiacritics('NOVAK', ''), 'Novak');
  assert.equal(restoreDiacritics('MUELLER', 'Müller'), 'Müller');
});

test('rodné číslo a adresa zo zadnej strany', () => {
  const back = `Rodné číslo / Personal No.\n850315/1234\nTrvalý pobyt / Address\nHlavná 12\nBratislava - Staré Mesto\nVydal / Authority\nOR PZ Bratislava\n`;
  assert.equal(findBirthNumber(back), '850315/1234');
  assert.equal(findAddress(back), 'Hlavná 12, Bratislava - Staré Mesto');
});

test('OCR vynechá výplň za menom', () => {
  const [l1, l2] = slovakMrz();
  const m = parseMrzFromText(`${l1}\n${l2.slice(0, 13)} ${l2.slice(13)}\nKOVAC<<JAN\n`);
  assert.equal(m.surname, 'KOVAC');
  assert.equal(m.givenNames, 'JAN');
  assert.ok(m.valid);
});

test('o jeden znak odlišné meno z prednej strany', () => {
  assert.equal(restoreDiacritics('KOVAC', 'KOVÁČ'), 'Kováč');
  assert.equal(restoreDiacritics('ZAN', 'Meno\nJÁN'), 'Ján');
  assert.equal(restoreDiacritics('KOVAC', 'Priezvisko KOVÁE'), 'Kováe');
  assert.equal(restoreDiacritics('KOVAC', 'Kovár'), 'Kovac');
});

test('stratený jeden < medzi priezviskom a menom', () => {
  const [l1, l2] = slovakMrz();
  const m = parseTd1([l1, l2, 'KOVAC<ZAN<<<<<<<<<<<<<<<<<<<<']);
  assert.equal(m.surname, 'KOVAC');
  assert.equal(m.givenNames, 'ZAN');
});

test('zlúčené priezvisko a meno a šum z výplne', () => {
  const [l1, l2] = slovakMrz();
  assert.equal(parseTd1([l1, l2, 'KOVAC<JAN<<<<<<<<<<<<<<<<<K<<']).givenNames, 'JAN');
  const m = parseTd1([l1, l2, 'KOVAC<JAN<<<<<<<<<<<<<<<<<<<<<']);
  assert.equal(m.surname, 'KOVAC');
  assert.equal(m.givenNames, 'JAN');
});
