// Formátovanie dátumov/súm + exporty (CSV, kalendár .ics).
import type { Tender } from "./core";
import { STAGE_LABEL } from "./core";
import type { Tracking } from "./store";
import { TRACK_STATUSES } from "./store";

export function fmtDate(iso?: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  const time = iso.length > 10 ? ` ${iso.slice(11, 16)}` : "";
  return `${Number(d)}. ${Number(m)}. ${y}${time}`;
}

export function fmtMoney(v?: number, cur = "EUR"): string {
  if (v == null) return "";
  try {
    return new Intl.NumberFormat("sk-SK", { style: "currency", currency: cur || "EUR", maximumFractionDigits: 0 }).format(v);
  } catch {
    return `${Math.round(v)} ${cur}`;
  }
}

/** Počet dní do termínu (0 = dnes, záporné = po termíne). */
export function daysLeft(deadline?: string): number | null {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(deadline.slice(0, 10) + "T00:00:00");
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export function deadlineText(deadline?: string): string {
  const n = daysLeft(deadline);
  if (n == null) return "bez termínu";
  if (n < 0) return "po termíne";
  if (n === 0) return "končí dnes";
  if (n === 1) return "končí zajtra";
  if (n < 5) return `ešte ${n} dni`;
  return `ešte ${n} dní`;
}

export function isOpen(t: Tender): boolean {
  if (t.stage === "vysledok" || t.stage === "oprava") return false;
  const n = daysLeft(t.deadline);
  return n == null ? t.stage !== "ine" : n >= 0;
}

function download(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export function exportCsv(tenders: Tender[], tracking: Record<string, Tracking>) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = ["Názov", "Obstarávateľ", "Mesto", "Zverejnené", "Termín ponúk", "Typ", "Hodnota", "Stav", "Poznámka", "Odkaz"];
  const rows = tenders.map((t) => {
    const tr = tracking[t.id];
    return [
      t.title,
      t.buyer,
      t.city,
      t.publishedAt,
      t.deadline,
      STAGE_LABEL[t.stage],
      t.value ?? "",
      TRACK_STATUSES.find((s) => s.id === tr?.status)?.label ?? "",
      tr?.note ?? "",
      t.url,
    ]
      .map(esc)
      .join(";");
  });
  // BOM, aby Excel správne zobrazil diakritiku
  download(`zakazky-${new Date().toISOString().slice(0, 10)}.csv`, "﻿" + [head.join(";"), ...rows].join("\r\n"), "text/csv");
}

export function exportIcs(t: Tender) {
  if (!t.deadline) return;
  const d = t.deadline.slice(0, 10).replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const text = (s: string) => s.replace(/[\\;,]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
  const time = t.deadline.length > 10 ? ` o ${t.deadline.slice(11, 16)}` : "";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//zakazky-tepovanie//SK",
    "BEGIN:VEVENT",
    `UID:${t.id}@zakazky-tepovanie`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${d}`,
    `SUMMARY:${text(`Termín ponuky${time}: ${t.title}`)}`,
    `DESCRIPTION:${text(`${t.buyer}\n${t.url}`)}`,
    `URL:${t.url}`,
    "BEGIN:VALARM",
    "TRIGGER:-P3D",
    "ACTION:DISPLAY",
    "DESCRIPTION:O 3 dni končí lehota na predloženie ponuky",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  download(`termin-${t.id}.ics`, ics, "text/calendar");
}

export function exportBackup(data: unknown) {
  download(`zakazky-zaloha-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 1), "application/json");
}
