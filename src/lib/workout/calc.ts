// Výpočty pre progres, objem a odhad maximálky.
import type { LoggedSet, Session, SessionExercise } from "./types";

/** Jednoduché ID bez závislostí. */
export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

/** Odhad 1RM (jednorázová maximálka) – Epleyho vzorec. */
export function epley1RM(weight: number, reps: number): number {
  if (!weight || weight <= 0 || !reps || reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

/** Najlepšia (najťažšia platná) séria cviku – podľa odhadu 1RM. */
export function bestSet(sets: LoggedSet[]): LoggedSet | null {
  let best: LoggedSet | null = null;
  let bestScore = -1;
  for (const s of sets) {
    if (s.weight == null || s.reps == null || s.weight <= 0 || s.reps <= 0) continue;
    const score = epley1RM(s.weight, s.reps);
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  return best;
}

/** Objem cviku = súčet váha × opakovania cez platné série. */
export function exerciseVolume(sets: LoggedSet[]): number {
  return sets.reduce((sum, s) => {
    if (s.weight == null || s.reps == null) return sum;
    return sum + s.weight * s.reps;
  }, 0);
}

/** Celkový objem tréningu. */
export function sessionVolume(session: Session): number {
  return session.exercises.reduce((sum, ex) => sum + exerciseVolume(ex.sets), 0);
}

/** Počet zapísaných (platných) sérií v tréningu. */
export function sessionSetCount(session: Session): number {
  return session.exercises.reduce(
    (n, ex) => n + ex.sets.filter((s) => s.weight != null && s.reps != null).length,
    0,
  );
}

/** Celkový počet zdvihnutých opakovaní. */
export function sessionReps(session: Session): number {
  return session.exercises.reduce(
    (n, ex) => n + ex.sets.reduce((r, s) => r + (s.reps ?? 0), 0),
    0,
  );
}

export interface ExercisePoint {
  date: number;
  topWeight: number;
  est1RM: number;
  volume: number;
  reps: number;
}

/** Časový rad hodnôt pre jeden cvik naprieč všetkými tréningmi. */
export function exerciseHistory(sessions: Session[], exerciseName: string): ExercisePoint[] {
  const points: ExercisePoint[] = [];
  for (const s of sessions) {
    if (!s.finishedAt) continue;
    const ex = s.exercises.find((e) => e.name.toLowerCase() === exerciseName.toLowerCase());
    if (!ex) continue;
    const best = bestSet(ex.sets);
    if (!best) continue;
    points.push({
      date: s.finishedAt ?? s.date,
      topWeight: best.weight ?? 0,
      est1RM: Math.round(epley1RM(best.weight ?? 0, best.reps ?? 0)),
      volume: Math.round(exerciseVolume(ex.sets)),
      reps: ex.sets.reduce((r, x) => r + (x.reps ?? 0), 0),
    });
  }
  return points.sort((a, b) => a.date - b.date);
}

export interface PersonalRecord {
  name: string;
  weight: number;
  reps: number;
  est1RM: number;
  date: number;
}

/** Osobné rekordy – najlepší odhad 1RM pre každý cvik. */
export function personalRecords(sessions: Session[]): PersonalRecord[] {
  const map = new Map<string, PersonalRecord>();
  for (const s of sessions) {
    if (!s.finishedAt) continue;
    for (const ex of s.exercises) {
      const best = bestSet(ex.sets);
      if (!best || best.weight == null || best.reps == null) continue;
      const est = epley1RM(best.weight, best.reps);
      const key = ex.name.toLowerCase();
      const current = map.get(key);
      if (!current || est > current.est1RM) {
        map.set(key, {
          name: ex.name,
          weight: best.weight,
          reps: best.reps,
          est1RM: Math.round(est),
          date: s.finishedAt ?? s.date,
        });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.est1RM - a.est1RM);
}

/**
 * Posledný odcvičený výkon daného cviku pred zadaným časom.
 * Slúži ako referencia „minule si dal…" počas tréningu.
 */
export function lastPerformance(
  sessions: Session[],
  exerciseName: string,
  beforeId?: string,
): SessionExercise | null {
  const done = sessions
    .filter((s) => s.finishedAt && s.id !== beforeId)
    .sort((a, b) => (b.finishedAt ?? b.date) - (a.finishedAt ?? a.date));
  for (const s of done) {
    const ex = s.exercises.find(
      (e) => e.name.toLowerCase() === exerciseName.toLowerCase() && bestSet(e.sets),
    );
    if (ex) return ex;
  }
  return null;
}

/** Zoznam unikátnych názvov cvikov naprieč históriou. */
export function allExerciseNames(sessions: Session[]): string[] {
  const set = new Set<string>();
  for (const s of sessions) {
    for (const ex of s.exercises) {
      if (bestSet(ex.sets)) set.add(ex.name);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "sk"));
}
