// Ukladanie do localStorage (appka funguje offline, bez prihlásenia).
import type { AppData } from "./types";
import { seedData } from "./seed";

const KEY = "rep-workout-data-v1";

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedData();
    const parsed = JSON.parse(raw) as Partial<AppData>;
    const seed = seedData();
    return {
      version: parsed.version ?? seed.version,
      plans: parsed.plans ?? seed.plans,
      sessions: parsed.sessions ?? [],
      active: parsed.active ?? null,
      settings: { ...seed.settings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return seedData();
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // úložisko nedostupné (napr. súkromné okno) – ticho ignorujeme
  }
}

export function exportData(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function importData(json: string): AppData | null {
  try {
    const parsed = JSON.parse(json) as AppData;
    if (!parsed || !Array.isArray(parsed.plans) || !Array.isArray(parsed.sessions)) return null;
    return parsed;
  } catch {
    return null;
  }
}
