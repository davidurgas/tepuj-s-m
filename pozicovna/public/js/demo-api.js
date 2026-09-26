// Demo režim: napodobňuje API servera priamo v prehliadači s ukážkovými dátami.
// Nič sa neposiela, emaily sa len simulujú a po obnovení stránky sa všetko vráti na začiatok.

export const SAMPLE_ID = {
  first_name: 'Ján',
  last_name: 'Kováč',
  birth_date: '1985-03-15',
  birth_number: '850315/1234',
  id_number: 'EA1234567',
  id_expiry: '2031-01-01',
  address: 'Hlavná 12, Bratislava - Staré Mesto',
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const iso = (daysAgo, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
};
const day = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Vygeneruje „ručný“ podpis ako PNG, nech ukážkové zmluvy nie sú prázdne.
function fakeSignature(seed) {
  const c = document.createElement('canvas');
  c.width = 420;
  c.height = 130;
  const ctx = c.getContext('2d');
  ctx.strokeStyle = '#13235b';
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  ctx.beginPath();
  let x = 20;
  let y = 80;
  ctx.moveTo(x, y);
  for (let i = 0; i < 9; i++) {
    const nx = x + 30 + rnd() * 25;
    ctx.bezierCurveTo(x + 10, y - 60 * rnd() - 10, nx - 10, y + 50 * rnd(), nx, 60 + rnd() * 30);
    x = nx;
    y = 60 + rnd() * 30;
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(30, 105);
  ctx.quadraticCurveTo(200, 95 + rnd() * 10, 390, 100);
  ctx.stroke();
  return c.toDataURL('image/png');
}

let db;
function seed() {
  const settings = {
    company_name: 'Tepuj s.r.o.',
    company_address: 'Dlhá 5, 949 01 Nitra',
    company_ico: '12345678',
    company_dic: '2120123456',
    company_phone: '0900 123 456',
    company_email: 'info@tepuj.sk',
    default_price: '25',
    deposit: '100',
    late_fee: '25',
    extra_terms: '',
    owner_signature: fakeSignature(7),
  };
  const machines = [
    { id: 1, name: 'Kärcher Puzzi 10/1', serial: 'KP-01', accessories: 'hubica na koberce, ručná hubica' },
    { id: 2, name: 'Kärcher Puzzi 8/1', serial: 'KP-02', accessories: 'ručná hubica' },
    { id: 3, name: 'Kärcher SE 4001', serial: 'SE-03', accessories: 'hubica na koberce' },
  ];
  const base = (id, m, extra) => ({
    id,
    number: `${new Date().getFullYear()}-${String(id).padStart(4, '0')}`,
    machine_id: m.id,
    machine_name: m.name,
    machine_serial: m.serial,
    accessories: m.accessories,
    price: 25,
    deposit: 100,
    id_consent: 1,
    birth_number: '',
    note: '',
    contract_email_error: null,
    return_email_error: null,
    ...extra,
  });
  const rentals = [
    base(1, machines[1], {
      status: 'returned', first_name: 'Lucia', last_name: 'Kováčová', email: 'lucia.kovacova@example.sk', phone: '0905 111 222',
      birth_date: '1990-06-02', id_number: 'EB7788990', id_expiry: '2029-04-10', address: 'Štúrova 8, Nitra',
      created_at: iso(9), paid_at: iso(9), contract_email_at: iso(9), return_due: day(-7),
      returned_at: iso(7, 17), return_ok: 1, deposit_returned: 100, return_email_at: iso(7, 17),
    }),
    base(2, machines[2], {
      status: 'active', first_name: 'Peter', last_name: 'Novák', email: 'peter.novak@example.sk', phone: '0918 333 444',
      birth_date: '1978-11-20', id_number: 'EC1122334', id_expiry: '2030-09-01', address: 'Mierová 21, Levice',
      created_at: iso(4), paid_at: iso(4), contract_email_at: iso(4), return_due: day(-1),
    }),
    base(3, machines[0], {
      status: 'active', first_name: 'Mária', last_name: 'Horváthová', email: 'maria.h@example.sk', phone: '0907 555 666',
      birth_date: '1986-01-14', id_number: 'ED5566778', id_expiry: '2032-02-28', address: 'Lipová 3, Zlaté Moravce',
      created_at: iso(1), paid_at: iso(1), contract_email_at: iso(1), return_due: day(1), note: 'Sedačka + 2 koberce',
    }),
  ];
  const files = {};
  for (const r of rentals) {
    files[r.id] = { signature: fakeSignature(r.id * 31 + 3), id_front: 'demo-id-front.jpg', id_back: 'demo-id-back.jpg' };
    if (r.returned_at) files[r.id].return_signature = fakeSignature(r.id * 17 + 11);
  }
  db = { settings, machines, rentals, files, nextId: 4, nextMachine: 4 };
}

function present(r) {
  const f = db.files[r.id] || {};
  return {
    ...r,
    files: {
      id_front: f.id_front || null,
      id_back: f.id_back || null,
      signature: f.signature || null,
      return_signature: f.return_signature || null,
      contract: r.paid_at ? 'doc:contract' : null,
      return: r.returned_at ? 'doc:return' : null,
    },
  };
}

const fail = (msg) => {
  throw new Error(msg);
};
const findRental = (id) => db.rentals.find((r) => r.id === Number(id)) || fail('Požičanie neexistuje.');

export async function demoApi(method, url, body) {
  if (!db) seed();
  await wait(120); // aby demo pôsobilo ako naozajstné pripojenie
  const [path, query = ''] = url.split('?');
  const q = new URLSearchParams(query);
  const parts = path.replace(/^\/api\//, '').split('/');

  if (path === '/api/me') return { loggedIn: true, mailConfigured: true, demo: true };
  if (path === '/api/login' || path === '/api/logout') return { ok: true };

  if (parts[0] === 'settings') {
    if (parts[1] === 'test-email') {
      await wait(500);
      return { ok: true, to: body?.to };
    }
    if (method === 'PUT') Object.assign(db.settings, body);
    return { ...db.settings };
  }

  if (parts[0] === 'machines') {
    const withRented = () => db.machines.map((m) => ({ ...m, rented: db.rentals.filter((r) => r.machine_id === m.id && r.status !== 'returned').length }));
    if (method === 'GET') return withRented();
    if (method === 'POST') {
      if (!body?.name?.trim()) fail('Zadaj názov stroja.');
      const m = { id: db.nextMachine++, name: body.name.trim(), serial: body.serial || '', accessories: body.accessories || '' };
      db.machines.push(m);
      return m;
    }
    const m = db.machines.find((x) => x.id === Number(parts[1]));
    if (method === 'PUT' && m) Object.assign(m, { name: body.name, serial: body.serial, accessories: body.accessories });
    if (method === 'DELETE') db.machines = db.machines.filter((x) => x.id !== Number(parts[1]));
    return { ok: true };
  }

  if (parts[0] === 'rentals') {
    if (parts.length === 1 && method === 'GET') {
      const status = q.get('status');
      const term = (q.get('q') || '').toLowerCase();
      return db.rentals
        .filter((r) => (status === 'open' ? r.status !== 'returned' : status ? r.status === status : true))
        .filter((r) => !term || [r.first_name, r.last_name, r.number, r.phone, r.email, r.machine_name].join(' ').toLowerCase().includes(term))
        .sort((a, b) => b.id - a.id);
    }
    if (parts.length === 1 && method === 'POST') {
      const d = JSON.parse(body.get('data'));
      const m = db.machines.find((x) => String(x.id) === String(d.machine_id)) || {};
      const id = db.nextId++;
      const r = {
        id,
        number: `${new Date().getFullYear()}-${String(id).padStart(4, '0')}`,
        status: 'signed',
        created_at: new Date().toISOString(),
        first_name: d.first_name, last_name: d.last_name, birth_date: d.birth_date, birth_number: d.birth_number,
        id_number: d.id_number, id_expiry: d.id_expiry, address: d.address, email: d.email, phone: d.phone,
        machine_id: m.id, machine_name: m.name, machine_serial: m.serial, accessories: m.accessories,
        price: Number(d.price) || 0, deposit: Number(d.deposit) || 0, return_due: d.return_due, note: d.note, id_consent: 1,
      };
      db.rentals.push(r);
      const photo = (k) => (body.get(k) ? URL.createObjectURL(body.get(k)) : null);
      db.files[id] = { signature: d.signature, id_front: photo('id_front'), id_back: photo('id_back') };
      return present(r);
    }
    const r = findRental(parts[1]);
    const action = parts[2];
    if (!action && method === 'GET') return present(r);
    if (!action && method === 'DELETE') {
      db.rentals = db.rentals.filter((x) => x !== r);
      return { ok: true };
    }
    if (action === 'pay') {
      await wait(700);
      Object.assign(r, { paid_at: r.paid_at || new Date().toISOString(), status: 'active', contract_email_at: new Date().toISOString() });
      return present(r);
    }
    if (action === 'return') {
      await wait(700);
      db.files[r.id].return_signature = body.signature;
      Object.assign(r, {
        status: 'returned', returned_at: new Date().toISOString(), return_ok: body.return_ok ? 1 : 0,
        return_note: body.return_note, deposit_returned: Math.min(r.deposit, Number(body.deposit_returned)),
        return_email_at: new Date().toISOString(),
      });
      return present(r);
    }
    if (action === 'resend') {
      await wait(600);
      if (body.email) r.email = body.email;
      return present(r);
    }
  }
  fail('Neznáma požiadavka.');
}
