// Text zmluvy a preberacieho protokolu. Rovnaký modul používa appka (náhľad
// pred podpisom) aj server (PDF), takže zákazník podpisuje presne to, čo dostane
// emailom.

const TZ = 'Europe/Bratislava';

export function money(v) {
  const n = Number(v) || 0;
  return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(n);
}

export function fmtDate(v) {
  if (!v) return '—';
  // Samotný dátum (RRRR-MM-DD) nekonvertujeme cez časové pásmo.
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split('-');
    return `${+d}. ${+m}. ${y}`;
  }
  return new Intl.DateTimeFormat('sk-SK', { timeZone: TZ, day: 'numeric', month: 'numeric', year: 'numeric' }).format(new Date(v));
}

export function fmtDateTime(v) {
  if (!v) return '—';
  return new Intl.DateTimeFormat('sk-SK', {
    timeZone: TZ, day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(v));
}

export function customerName(r) {
  return [r.first_name, r.last_name].filter(Boolean).join(' ');
}

function lessorLines(s) {
  return [
    s.company_name || '—',
    s.company_address && `sídlo/miesto podnikania: ${s.company_address}`,
    [s.company_ico && `IČO: ${s.company_ico}`, s.company_dic && `DIČ: ${s.company_dic}`].filter(Boolean).join(', '),
    [s.company_phone && `tel.: ${s.company_phone}`, s.company_email && `e-mail: ${s.company_email}`].filter(Boolean).join(', '),
  ].filter(Boolean);
}

function lesseeLines(r) {
  return [
    customerName(r) || '—',
    r.birth_date && `dátum narodenia: ${fmtDate(r.birth_date)}`,
    r.birth_number && `rodné číslo: ${r.birth_number}`,
    r.address && `trvalý pobyt: ${r.address}`,
    r.id_number && `číslo OP: ${r.id_number}`,
    [r.phone && `tel.: ${r.phone}`, r.email && `e-mail: ${r.email}`].filter(Boolean).join(', '),
  ].filter(Boolean);
}

function machineLabel(r) {
  return [r.machine_name, r.machine_serial && `(výr. č. ${r.machine_serial})`].filter(Boolean).join(' ') || 'tepovací stroj';
}

// r = údaje požičania, s = nastavenia firmy
export function contractDocument(r, s) {
  const deposit = money(r.deposit);
  const price = money(r.price);
  const blocks = [
    { heading: 'Prenajímateľ', lines: lessorLines(s) },
    { heading: 'Nájomca', lines: lesseeLines(r) },
    {
      heading: 'Čl. I – Predmet nájmu',
      paragraphs: [
        `Prenajímateľ prenecháva nájomcovi do dočasného užívania ${machineLabel(r)}${r.accessories ? ` s príslušenstvom: ${r.accessories}` : ''} (ďalej len „stroj“).`,
        'Nájomca potvrdzuje, že stroj prevzal kompletný, čistý, funkčný a bez viditeľného poškodenia a že bol oboznámený s jeho obsluhou.',
      ],
    },
    {
      heading: 'Čl. II – Doba nájmu',
      paragraphs: [
        `Nájom začína dňa ${fmtDateTime(r.created_at)} a nájomca sa zaväzuje stroj vrátiť najneskôr dňa ${fmtDate(r.return_due)}.`,
        `Za každý začatý deň omeškania s vrátením stroja je nájomca povinný zaplatiť ďalšie nájomné vo výške ${money(s.late_fee)}.`,
      ],
    },
    {
      heading: 'Čl. III – Nájomné a zábezpeka',
      paragraphs: [
        `Nájomné za dohodnutú dobu nájmu je ${price}. Nájomca ďalej skladá peňažnú zábezpeku (zálohu) vo výške ${deposit}. Nájomné aj zábezpeka sa platia v hotovosti pri odovzdaní stroja.`,
        'Zábezpeka bude nájomcovi vrátená v plnej výške pri vrátení kompletného, funkčného a nepoškodeného stroja. Prenajímateľ je oprávnený zo zábezpeky započítať náklady na odstránenie škody, chýbajúceho príslušenstva, mimoriadneho znečistenia alebo nájomné za omeškanie.',
      ],
    },
    {
      heading: 'Čl. IV – Povinnosti nájomcu',
      paragraphs: [
        'Nájomca je povinný užívať stroj riadne, v súlade s návodom a len na čistenie kobercov, sedačiek a textílií, používať iba vhodné čistiace prostriedky, chrániť stroj pred poškodením, mrazom, stratou a odcudzením a neprenechať ho tretej osobe.',
        'Nájomca vráti stroj vyčistený, s vyprázdnenými nádržami. Nájomca zodpovedá za škodu na stroji vzniknutú od jeho prevzatia až do vrátenia; pri strate alebo zničení stroja uhradí jeho obvyklú cenu.',
      ],
    },
    {
      heading: 'Čl. V – Osobné údaje a kópia dokladu',
      paragraphs: [
        'Nájomca udeľuje súhlas s vyhotovením a uchovaním kópie (fotografie) svojho dokladu totožnosti podľa § 78 ods. 6 zákona č. 18/2018 Z. z. o ochrane osobných údajov. Kópia a osobné údaje sa spracúvajú výlučne na účel uzatvorenia a plnenia tejto zmluvy a uplatnenia prípadných nárokov z nej a uchovávajú sa po dobu nevyhnutnú na tento účel.',
      ],
    },
    {
      heading: 'Čl. VI – Záverečné ustanovenia',
      paragraphs: [
        'Zmluva sa riadi ustanoveniami § 663 a nasl. Občianskeho zákonníka. Zmluvné strany ju podpísali vlastnoručným podpisom na dotykovej obrazovke zariadenia prenajímateľa; nájomca dostane jej vyhotovenie v PDF na uvedený e-mail.',
        ...(s.extra_terms ? [s.extra_terms] : []),
        'Zmluvné strany vyhlasujú, že si zmluvu prečítali, jej obsahu porozumeli a na znak súhlasu ju podpisujú.',
      ],
    },
  ];
  return {
    title: 'ZMLUVA O NÁJME HNUTEĽNEJ VECI',
    subtitle: `č. ${r.number || '(pridelí sa pri podpise)'}`,
    blocks,
  };
}

export function paymentConfirmation(r, s) {
  return {
    heading: 'Potvrdenie o prijatí platby',
    paragraphs: [
      `Prenajímateľ potvrdzuje, že dňa ${fmtDateTime(r.paid_at)} prijal od nájomcu v hotovosti:`,
    ],
    rows: [
      ['Nájomné', money(r.price)],
      ['Zábezpeka (záloha) – vratná', money(r.deposit)],
      ['Spolu prijaté', money(Number(r.price) + Number(r.deposit))],
    ],
    note: `Zábezpeka bude vrátená pri vrátení nepoškodeného stroja. ${s.company_name || ''}`.trim(),
  };
}

export function returnDocument(r, s) {
  const full = Number(r.deposit_returned) >= Number(r.deposit);
  const paragraphs = [
    `K zmluve o nájme č. ${r.number} zo dňa ${fmtDate(r.created_at)}.`,
    `Dňa ${fmtDateTime(r.returned_at)} nájomca vrátil prenajímateľovi ${machineLabel(r)}.`,
  ];
  if (r.return_ok) {
    paragraphs.push('Zmluvné strany potvrdzujú, že stroj bol vrátený kompletný, funkčný a nepoškodený. Prenajímateľ voči nájomcovi nemá v súvislosti s nájmom žiadne ďalšie nároky.');
  } else {
    paragraphs.push('Pri preberaní stroja boli zistené nedostatky (pozri poznámku).');
  }
  if (r.return_note) paragraphs.push(`Poznámka: ${r.return_note}`);
  paragraphs.push(
    full
      ? `Prenajímateľ vrátil nájomcovi zábezpeku v plnej výške ${money(r.deposit_returned)} v hotovosti a nájomca svojím podpisom potvrdzuje jej prevzatie.`
      : `Prenajímateľ vrátil nájomcovi zo zábezpeky ${money(r.deposit)} sumu ${money(r.deposit_returned)} v hotovosti (zadržané: ${money(Number(r.deposit) - Number(r.deposit_returned))}) a nájomca svojím podpisom potvrdzuje jej prevzatie.`,
  );
  return {
    title: 'PREBERACÍ PROTOKOL – VRÁTENIE STROJA',
    subtitle: `k zmluve č. ${r.number}`,
    blocks: [
      { heading: 'Prenajímateľ', lines: lessorLines(s) },
      { heading: 'Nájomca', lines: lesseeLines(r) },
      { heading: 'Vrátenie stroja a zábezpeky', paragraphs },
    ],
  };
}

// Jednoduché HTML pre náhľad v appke.
export function documentToHtml(doc, esc) {
  let html = `<h2>${esc(doc.title)}</h2><p class="doc-sub">${esc(doc.subtitle)}</p>`;
  for (const b of doc.blocks) {
    html += `<h3>${esc(b.heading)}</h3>`;
    if (b.lines) html += `<p>${b.lines.map(esc).join('<br>')}</p>`;
    if (b.paragraphs) html += b.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');
  }
  return html;
}
