// Ukážkové dáta pri prvom spustení, aby appka nebola prázdna.
import { uid } from "./calc";
import type { AppData, Plan } from "./types";

function plan(name: string, note: string, ex: [string, number, number][]): Plan {
  return {
    id: uid(),
    name,
    note,
    createdAt: Date.now(),
    exercises: ex.map(([name, sets, reps]) => ({
      id: uid(),
      name,
      sets,
      targetReps: reps,
    })),
  };
}

export function seedData(): AppData {
  return {
    version: 1,
    plans: [
      plan("Push (tlak)", "Hrudník, ramená, triceps", [
        ["Bench press", 4, 8],
        ["Tlak s činkami nad hlavu", 3, 10],
        ["Rozpažovanie", 3, 12],
        ["Tlaky na triceps", 3, 12],
      ]),
      plan("Pull (ťah)", "Chrbát, biceps", [
        ["Mŕtvy ťah", 3, 6],
        ["Zhyby", 4, 8],
        ["Priťahovanie v predklone", 3, 10],
        ["Biceps s činkami", 3, 12],
      ]),
      plan("Nohy", "Kvadricepsy, hamstringy, lýtka", [
        ["Drep", 4, 8],
        ["Predkopávanie", 3, 12],
        ["Zakopávanie", 3, 12],
        ["Výpony na lýtka", 4, 15],
      ]),
    ],
    sessions: [],
    active: null,
    settings: {
      restSeconds: 90,
      unit: "kg",
      sound: true,
    },
  };
}
