// Formátovanie čísel, dátumov a času pre slovenské rozhranie.
import type { Unit } from "./types";

export function fmtWeight(value: number | null | undefined, unit: Unit = "kg"): string {
  if (value == null) return "–";
  const rounded = Math.round(value * 10) / 10;
  const num = Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
  return `${num} ${unit}`;
}

export function fmtNumber(value: number): string {
  return new Intl.NumberFormat("sk-SK").format(Math.round(value));
}

const dateFmt = new Intl.DateTimeFormat("sk-SK", { day: "numeric", month: "short", year: "numeric" });
const dayFmt = new Intl.DateTimeFormat("sk-SK", { weekday: "short", day: "numeric", month: "short" });
const timeFmt = new Intl.DateTimeFormat("sk-SK", { hour: "2-digit", minute: "2-digit" });

export function fmtDate(ts: number): string {
  return dateFmt.format(new Date(ts));
}

export function fmtDay(ts: number): string {
  return dayFmt.format(new Date(ts));
}

export function fmtTime(ts: number): string {
  return timeFmt.format(new Date(ts));
}

/** Relatívny čas: „dnes", „včera", „pred 3 dňami". */
export function fmtRelative(ts: number): string {
  const now = new Date();
  const then = new Date(ts);
  const day = 24 * 60 * 60 * 1000;
  const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((midnight(now) - midnight(then)) / day);
  if (diff === 0) return "dnes";
  if (diff === 1) return "včera";
  if (diff > 1 && diff < 5) return `pred ${diff} dňami`;
  if (diff >= 5) return `pred ${diff} dňami`;
  return fmtDate(ts);
}

export function fmtDuration(ms: number): string {
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 60) return `${totalMin} min`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** Cieľové opakovania: „8" alebo rozsah „6–8". */
export function fmtRepRange(low: number, high?: number): string {
  if (high != null && high > low) return `${low}–${high}`;
  return `${low}`;
}

export function fmtClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
