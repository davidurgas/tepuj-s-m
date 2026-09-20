// Globálny stav appky + akcie. Načíta z localStorage a pri zmene ukladá.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { uid } from "./calc";
import { loadData, saveData } from "./storage";
import type { AppData, LoggedSet, Plan, PlanExercise, Session, Settings } from "./types";

interface StoreValue {
  data: AppData;
  // plány
  createPlan: (name: string) => Plan;
  updatePlan: (plan: Plan) => void;
  deletePlan: (id: string) => void;
  duplicatePlan: (id: string) => void;
  // tréning
  startSession: (planId: string) => Session | null;
  startEmptySession: () => Session;
  updateActive: (updater: (s: Session) => Session) => void;
  finishSession: () => void;
  discardActive: () => void;
  deleteSession: (id: string) => void;
  // nastavenia
  updateSettings: (patch: Partial<Settings>) => void;
  replaceAll: (next: AppData) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function emptyPlanExercise(): PlanExercise {
  return { id: uid(), name: "", sets: 3, targetReps: 10 };
}

function sessionFromPlan(plan: Plan): Session {
  return {
    id: uid(),
    planId: plan.id,
    planName: plan.name,
    date: Date.now(),
    exercises: plan.exercises.map((ex) => ({
      exerciseId: ex.id,
      name: ex.name,
      targetReps: ex.targetReps,
      sets: Array.from({ length: Math.max(1, ex.sets) }, () => emptySet()),
    })),
  };
}

export function emptySet(): LoggedSet {
  return { weight: null, reps: null, done: false };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    saveData(data);
  }, [data]);

  const createPlan = useCallback((name: string): Plan => {
    const plan: Plan = {
      id: uid(),
      name: name.trim() || "Nový plán",
      exercises: [emptyPlanExercise()],
      createdAt: Date.now(),
    };
    setData((d) => ({ ...d, plans: [plan, ...d.plans] }));
    return plan;
  }, []);

  const updatePlan = useCallback((plan: Plan) => {
    setData((d) => ({ ...d, plans: d.plans.map((p) => (p.id === plan.id ? plan : p)) }));
  }, []);

  const deletePlan = useCallback((id: string) => {
    setData((d) => ({ ...d, plans: d.plans.filter((p) => p.id !== id) }));
  }, []);

  const duplicatePlan = useCallback((id: string) => {
    setData((d) => {
      const src = d.plans.find((p) => p.id === id);
      if (!src) return d;
      const copy: Plan = {
        ...src,
        id: uid(),
        name: `${src.name} (kópia)`,
        createdAt: Date.now(),
        exercises: src.exercises.map((e) => ({ ...e, id: uid() })),
      };
      return { ...d, plans: [copy, ...d.plans] };
    });
  }, []);

  const startSession = useCallback((planId: string): Session | null => {
    let created: Session | null = null;
    setData((d) => {
      const plan = d.plans.find((p) => p.id === planId);
      if (!plan) return d;
      created = sessionFromPlan(plan);
      return { ...d, active: created };
    });
    return created;
  }, []);

  const startEmptySession = useCallback((): Session => {
    const s: Session = {
      id: uid(),
      planId: null,
      planName: "Voľný tréning",
      date: Date.now(),
      exercises: [],
    };
    setData((d) => ({ ...d, active: s }));
    return s;
  }, []);

  const updateActive = useCallback((updater: (s: Session) => Session) => {
    setData((d) => (d.active ? { ...d, active: updater(d.active) } : d));
  }, []);

  const finishSession = useCallback(() => {
    setData((d) => {
      if (!d.active) return d;
      // odstráň úplne prázdne cviky a ponechaj len zapísané série
      const cleaned: Session = {
        ...d.active,
        finishedAt: Date.now(),
        exercises: d.active.exercises
          .map((ex) => ({
            ...ex,
            sets: ex.sets.filter((s) => s.weight != null || s.reps != null),
          }))
          .filter((ex) => ex.sets.length > 0),
      };
      if (cleaned.exercises.length === 0) {
        return { ...d, active: null };
      }
      return { ...d, active: null, sessions: [cleaned, ...d.sessions] };
    });
  }, []);

  const discardActive = useCallback(() => {
    setData((d) => ({ ...d, active: null }));
  }, []);

  const deleteSession = useCallback((id: string) => {
    setData((d) => ({ ...d, sessions: d.sessions.filter((s) => s.id !== id) }));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
  }, []);

  const replaceAll = useCallback((next: AppData) => setData(next), []);

  const value = useMemo<StoreValue>(
    () => ({
      data,
      createPlan,
      updatePlan,
      deletePlan,
      duplicatePlan,
      startSession,
      startEmptySession,
      updateActive,
      finishSession,
      discardActive,
      deleteSession,
      updateSettings,
      replaceAll,
    }),
    [
      data,
      createPlan,
      updatePlan,
      deletePlan,
      duplicatePlan,
      startSession,
      startEmptySession,
      updateActive,
      finishSession,
      discardActive,
      deleteSession,
      updateSettings,
      replaceAll,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore musí byť použité vnútri StoreProvider");
  return ctx;
}
