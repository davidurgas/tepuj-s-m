// Počiatočné dáta pri prvom spustení.
// Appka štartuje prázdna – svoje plány si vytvoríš v sekcii „Plány".
import type { AppData } from "./types";

export function seedData(): AppData {
  return {
    version: 1,
    plans: [],
    sessions: [],
    active: null,
    settings: {
      restSeconds: 90,
      unit: "kg",
      sound: true,
    },
  };
}
