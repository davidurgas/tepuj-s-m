import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contractDocument, paymentConfirmation, returnDocument, customerName, fmtDateTime } from '../public/js/contract.js';

const FONTS = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'fonts');
const MARGIN = 50;

function newDoc(title) {
  const doc = new PDFDocument({ size: 'A4', margin: MARGIN, bufferPages: true, info: { Title: title } });
  doc.registerFont('regular', path.join(FONTS, 'DejaVuSans.ttf'));
  doc.registerFont('bold', path.join(FONTS, 'DejaVuSans-Bold.ttf'));
  doc.font('regular');
  return doc;
}

function toBuffer(doc) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

const width = (doc) => doc.page.width - MARGIN * 2;

function ensureSpace(doc, h) {
  if (doc.y + h > doc.page.height - MARGIN) doc.addPage();
}

function renderDocument(doc, d) {
  doc.font('bold').fontSize(15).text(d.title, { align: 'center' });
  doc.font('regular').fontSize(10).fillColor('#555').text(d.subtitle, { align: 'center' }).fillColor('#000');
  doc.moveDown(1);
  for (const b of d.blocks) {
    ensureSpace(doc, 60);
    doc.font('bold').fontSize(10.5).text(b.heading);
    doc.moveDown(0.2);
    doc.font('regular').fontSize(9.5);
    if (b.lines) doc.text(b.lines.join('\n'), { lineGap: 1.5 });
    for (const p of b.paragraphs || []) {
      doc.text(p, { align: 'justify', lineGap: 1.5 });
      doc.moveDown(0.35);
    }
    doc.moveDown(0.5);
  }
}

function signatureImage(src) {
  if (!src) return null;
  if (Buffer.isBuffer(src)) return src;
  if (src.startsWith('data:image')) return Buffer.from(src.split(',')[1], 'base64');
  return fs.existsSync(src) ? fs.readFileSync(src) : null;
}

// Dva stĺpce s podpismi vedľa seba.
function renderSignatures(doc, left, right, place) {
  ensureSpace(doc, 140);
  doc.moveDown(0.5);
  doc.font('regular').fontSize(9.5).text(place);
  doc.moveDown(0.5);
  const colW = (width(doc) - 30) / 2;
  const top = doc.y;
  [left, right].forEach((col, i) => {
    const x = MARGIN + i * (colW + 30);
    const img = signatureImage(col.image);
    if (img) {
      try {
        doc.image(img, x, top, { fit: [colW, 70], align: 'center', valign: 'bottom' });
      } catch {
        /* poškodený obrázok podpisu – necháme prázdne miesto */
      }
    }
    doc.moveTo(x, top + 75).lineTo(x + colW, top + 75).lineWidth(0.7).strokeColor('#333').stroke();
    doc.font('regular').fontSize(9).text(col.label, x, top + 80, { width: colW, align: 'center' });
    doc.fontSize(8.5).fillColor('#555').text(col.name || '', x, doc.y, { width: colW, align: 'center' }).fillColor('#000');
  });
  doc.x = MARGIN;
  doc.y = top + 115;
}

function renderPayment(doc, p) {
  ensureSpace(doc, 150);
  doc.moveDown(1);
  const boxTop = doc.y;
  doc.font('bold').fontSize(11).text(p.heading, MARGIN + 12, boxTop + 10);
  doc.font('regular').fontSize(9.5).moveDown(0.3);
  p.paragraphs.forEach((t) => doc.text(t, MARGIN + 12, doc.y, { width: width(doc) - 24 }));
  doc.moveDown(0.4);
  p.rows.forEach(([label, value], i) => {
    const y = doc.y;
    const last = i === p.rows.length - 1;
    doc.font(last ? 'bold' : 'regular').text(label, MARGIN + 12, y, { width: 300 });
    doc.text(value, MARGIN + 12, y, { width: width(doc) - 24, align: 'right' });
    doc.moveDown(0.25);
  });
  doc.font('regular').fontSize(8.5).fillColor('#555').text(p.note, MARGIN + 12, doc.y + 4, { width: width(doc) - 24 }).fillColor('#000');
  const boxBottom = doc.y + 10;
  doc.roundedRect(MARGIN, boxTop, width(doc), boxBottom - boxTop, 6).lineWidth(0.8).strokeColor('#999').stroke();
  doc.x = MARGIN;
  doc.y = boxBottom + 10;
}

function footer(doc, text) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    // Bez dolného okraja, inak by text päty pridal prázdnu stranu.
    const bottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.font('regular').fontSize(7.5).fillColor('#888');
    doc.text(`${text} · strana ${i + 1}/${range.count}`, MARGIN, doc.page.height - MARGIN + 15, { width: width(doc), align: 'center', lineBreak: false });
    doc.page.margins.bottom = bottom;
  }
}

export async function contractPdf(r, s, customerSignature) {
  const doc = newDoc(`Zmluva ${r.number}`);
  renderDocument(doc, contractDocument(r, s));
  renderSignatures(
    doc,
    { label: 'Prenajímateľ', name: s.company_name, image: s.owner_signature },
    { label: 'Nájomca', name: customerName(r), image: customerSignature },
    `Podpísané dňa ${fmtDateTime(r.created_at)}`,
  );
  if (r.paid_at) renderPayment(doc, paymentConfirmation(r, s));
  footer(doc, `Zmluva o nájme č. ${r.number}`);
  return toBuffer(doc);
}

export async function returnPdf(r, s, customerSignature) {
  const doc = newDoc(`Vrátenie ${r.number}`);
  renderDocument(doc, returnDocument(r, s));
  renderSignatures(
    doc,
    { label: 'Prenajímateľ (zábezpeku vrátil)', name: s.company_name, image: s.owner_signature },
    { label: 'Nájomca (zábezpeku prevzal)', name: customerName(r), image: customerSignature },
    `Podpísané dňa ${fmtDateTime(r.returned_at)}`,
  );
  footer(doc, `Preberací protokol k zmluve č. ${r.number}`);
  return toBuffer(doc);
}
