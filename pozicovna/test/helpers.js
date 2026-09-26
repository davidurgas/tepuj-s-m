import { checkDigit } from '../public/js/mrz.js';

// Vyrobí platnú MRZ slovenského OP (s korektnými kontrolnými číslicami).
export function slovakMrz({ doc = 'EA1234567', birth = '850315', sex = 'M', expiry = '310101', surname = 'KOVAC', given = 'JAN<PETER' } = {}) {
  const l1 = `IDSVK${doc}${checkDigit(doc)}`.padEnd(30, '<');
  const l2core = `${birth}${checkDigit(birth)}${sex}${expiry}${checkDigit(expiry)}SVK`.padEnd(29, '<');
  const composite = l1.slice(5, 30) + l2core.slice(0, 7) + l2core.slice(8, 15) + l2core.slice(18, 29);
  const l2 = l2core + checkDigit(composite);
  const l3 = `${surname}<<${given}`.padEnd(30, '<');
  return [l1, l2, l3];
}
