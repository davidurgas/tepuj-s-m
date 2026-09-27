// Lokálny stav appky (sledovanie zákaziek, poznámky, ručne pridané zákazky).
// Ukladá sa v prehliadači (localStorage), rovnako ako v appke Rep.
import { useCallback, useEffect, useState } from "react";
import type { Tender } from "./core";

export type TrackStatus = "zaujem" | "priprava" | "podane" | "vyhra" | "prehra" | "skip";

export const TRACK_STATUSES: { id: TrackStatus; label: string; tone: string }[] = [
  { id: "zaujem", label: "Zaujíma nás", tone: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  { id: "priprava", label: "Pripravujeme ponuku", tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  { id: "podane", label: "Ponuka podaná", tone: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
  { id: "vyhra", label: "Vyhrali sme", tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  { id: "prehra", label: "Nevyšlo", tone: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
  { id: "skip", label: "Nezaujíma", tone: "bg-muted text-muted-foreground" },
];

export interface Tracking {
  status?: TrackStatus;
  note?: string;
  updatedAt: string;
}

export interface LocalData {
  version: 1;
  tracking: Record<string, Tracking>;
  manual: Tender[];
  lastVisit?: string;
}

const KEY = "zakazky-tepovanie-v1";

function load(): LocalData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as LocalData;
      return { version: 1, tracking: d.tracking ?? {}, manual: d.manual ?? [], lastVisit: d.lastVisit };
    }
  } catch {
    /* poškodené dáta / zakázané úložisko */
  }
  return { version: 1, tracking: {}, manual: [] };
}

export function useLocalData() {
  const [data, setData] = useState<LocalData>(load);
  // čas predošlej návštevy (na zvýraznenie nových zákaziek) — zistí sa raz
  const [prevVisit] = useState<string | undefined>(() => data.lastVisit);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* plné / zakázané úložisko */
    }
  }, [data]);

  useEffect(() => {
    setData((d) => ({ ...d, lastVisit: new Date().toISOString() }));
  }, []);

  const setTracking = useCallback((id: string, patch: Partial<Omit<Tracking, "updatedAt">>) => {
    setData((d) => {
      const next = { ...d.tracking[id], ...patch, updatedAt: new Date().toISOString() };
      const tracking = { ...d.tracking };
      if (!next.status && !next.note) delete tracking[id];
      else tracking[id] = next;
      return { ...d, tracking };
    });
  }, []);

  const addManual = useCallback((t: Tender) => {
    setData((d) => ({
      ...d,
      manual: [t, ...d.manual.filter((m) => m.id !== t.id)],
      tracking: { ...d.tracking, [t.id]: { status: "zaujem", updatedAt: new Date().toISOString(), ...d.tracking[t.id] } },
    }));
  }, []);

  const removeManual = useCallback((id: string) => {
    setData((d) => {
      const tracking = { ...d.tracking };
      delete tracking[id];
      return { ...d, manual: d.manual.filter((m) => m.id !== id), tracking };
    });
  }, []);

  const replaceAll = useCallback((next: LocalData) => {
    setData({ version: 1, tracking: next.tracking ?? {}, manual: next.manual ?? [], lastVisit: new Date().toISOString() });
  }, []);

  return { data, prevVisit, setTracking, addManual, removeManual, replaceAll };
}

export type LocalStore = ReturnType<typeof useLocalData>;
