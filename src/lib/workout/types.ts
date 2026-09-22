// Dátové typy pre tréningový denník „Rep".

export type Unit = "kg" | "lb";

/** Jeden cvik v tréningovom pláne (šablóna). */
export interface PlanExercise {
  id: string;
  name: string;
  /** Plánovaný počet sérií. */
  sets: number;
  /** Cieľový počet opakovaní na sériu. */
  targetReps: number;
  /** Voliteľný oddych medzi sériami (s) – prepíše globálne nastavenie. */
  restSeconds?: number;
  note?: string;
}

/** Tréningový plán = pomenovaná zostava cvikov. */
export interface Plan {
  id: string;
  name: string;
  note?: string;
  exercises: PlanExercise[];
  createdAt: number;
}

/** Jedna odcvičená séria. */
export interface LoggedSet {
  weight: number | null;
  reps: number | null;
  done: boolean;
}

/** Cvik v rámci konkrétneho tréningu (so zapísanými sériami). */
export interface SessionExercise {
  exerciseId: string;
  name: string;
  targetReps: number;
  sets: LoggedSet[];
}

/** Jeden odcvičený (alebo práve prebiehajúci) tréning. */
export interface Session {
  id: string;
  planId: string | null;
  planName: string;
  /** Začiatok tréningu (timestamp). */
  date: number;
  /** Koniec tréningu (timestamp) – vyplní sa pri ukončení. */
  finishedAt?: number;
  exercises: SessionExercise[];
  bodyweight?: number | null;
  note?: string;
}

export interface Settings {
  /** Predvolený oddych medzi sériami (s). */
  restSeconds: number;
  unit: Unit;
  /** Pípnutie po skončení oddychu. */
  sound: boolean;
}

export interface AppData {
  version: number;
  plans: Plan[];
  sessions: Session[];
  /** Rozpracovaný tréning (prežije aj refresh stránky). */
  active: Session | null;
  settings: Settings;
}
