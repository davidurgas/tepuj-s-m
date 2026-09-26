import nodemailer from 'nodemailer';
import { customerName, fmtDate, money } from '../public/js/contract.js';

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.MAIL_FROM);
}

let transport;
function getTransport() {
  if (!transport) {
    const port = Number(process.env.SMTP_PORT || 587);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
  }
  return transport;
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function wrap(paragraphs, s) {
  const signature = [s.company_name, s.company_phone, s.company_email].filter(Boolean);
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#222">
${paragraphs.map((p) => `<p>${esc(p)}</p>`).join('\n')}
<p>S pozdravom<br>${signature.map(esc).join('<br>')}</p></div>`;
  const text = `${paragraphs.join('\n\n')}\n\nS pozdravom\n${signature.join('\n')}`;
  return { html, text };
}

async function send({ to, subject, paragraphs, attachment, settings }) {
  if (!mailConfigured()) throw new Error('Email nie je nastavený (chýba SMTP_HOST / MAIL_FROM v .env).');
  if (!to) throw new Error('Zákazník nemá vyplnený email.');
  const { html, text } = wrap(paragraphs, settings);
  await getTransport().sendMail({
    from: process.env.MAIL_FROM,
    to,
    bcc: process.env.MAIL_BCC || undefined,
    replyTo: settings.company_email || undefined,
    subject,
    text,
    html,
    attachments: attachment ? [attachment] : [],
  });
}

export function sendContractEmail(r, s, pdf) {
  return send({
    to: r.email,
    settings: s,
    subject: `Zmluva o nájme č. ${r.number} – ${r.machine_name || 'tepovací stroj'}`,
    paragraphs: [
      `Dobrý deň, ${customerName(r)},`,
      `ďakujeme, že ste si u nás požičali ${r.machine_name || 'tepovací stroj'}. V prílohe posielame podpísanú zmluvu o nájme č. ${r.number}.`,
      `Potvrdzujeme, že sme od Vás prijali v hotovosti nájomné ${money(r.price)} a vratnú zábezpeku (zálohu) ${money(r.deposit)}.`,
      `Stroj prosím vráťte najneskôr ${fmtDate(r.return_due)} vyčistený a s vyprázdnenými nádržami. Zábezpeku Vám pri vrátení nepoškodeného stroja vrátime v hotovosti.`,
    ],
    attachment: { filename: `zmluva-${r.number}.pdf`, content: pdf, contentType: 'application/pdf' },
  });
}

export function sendReturnEmail(r, s, pdf) {
  return send({
    to: r.email,
    settings: s,
    subject: `Vrátenie stroja a zábezpeky – zmluva č. ${r.number}`,
    paragraphs: [
      `Dobrý deň, ${customerName(r)},`,
      `potvrdzujeme, že ste nám dňa ${fmtDate(r.returned_at)} vrátili ${r.machine_name || 'tepovací stroj'}${r.return_ok ? ' v poriadku a bez poškodenia' : ''}.`,
      `Zábezpeku vo výške ${money(r.deposit_returned)} sme Vám vrátili v hotovosti. Podpísaný preberací protokol nájdete v prílohe.`,
      'Ďakujeme a tešíme sa na ďalšiu spoluprácu.',
    ],
    attachment: { filename: `vratenie-${r.number}.pdf`, content: pdf, contentType: 'application/pdf' },
  });
}

export function sendTestEmail(to, s) {
  return send({
    to,
    settings: s,
    subject: 'Test emailu – požičovňa',
    paragraphs: ['Toto je testovací email z administrácie požičovne. Ak ho vidíte, odosielanie funguje.'],
  });
}
