// Prebiehajúci tréning: zapisovanie váh a opakovaní po sériách, oddych, objem.
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, ChevronLeft, Dumbbell, Flag, History, Plus, Timer, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useStore, emptySet } from "@/lib/workout/store";
import { useRestTimer } from "@/components/workout/RestTimer";
import { bestSet, exerciseVolume, lastPerformance, sessionReps, sessionSetCount, sessionVolume, uid } from "@/lib/workout/calc";
import { fmtDuration, fmtRepRange, fmtWeight } from "@/lib/workout/format";
import type { LoggedSet, Session, SessionExercise } from "@/lib/workout/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ActiveWorkout() {
  const { data, startSession, updateActive, finishSession, discardActive } = useStore();
  const [params, setParams] = useSearchParams();
  const nav = useNavigate();
  const rest = useRestTimer();
  const active = data.active;
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  // Štart tréningu z ?plan=..., ak žiadny neprebieha.
  useEffect(() => {
    const planId = params.get("plan");
    if (planId && !data.active) {
      startSession(planId);
      setParams({}, { replace: true });
    } else if (planId && data.active) {
      setParams({}, { replace: true });
    }
  }, [params, data.active, startSession, setParams]);

  if (!active) {
    return <StartScreen />;
  }

  const patch = (updater: (s: Session) => Session) => updateActive(updater);

  const updateSet = (exId: string, idx: number, field: "weight" | "reps", raw: string) => {
    const value = raw === "" ? null : Math.max(0, parseFloat(raw.replace(",", ".")));
    patch((s) => ({
      ...s,
      exercises: s.exercises.map((ex) =>
        ex.exerciseId === exId
          ? { ...ex, sets: ex.sets.map((set, i) => (i === idx ? { ...set, [field]: Number.isNaN(value as number) ? null : value } : set)) }
          : ex,
      ),
    }));
  };

  const toggleDone = (exId: string, idx: number) => {
    // Stav prepočítame z aktuálnych dát (setData je asynchrónny).
    const current = active.exercises.find((ex) => ex.exerciseId === exId)?.sets[idx];
    const becameDone = !(current?.done ?? false);
    patch((s) => ({
      ...s,
      exercises: s.exercises.map((ex) =>
        ex.exerciseId === exId
          ? { ...ex, sets: ex.sets.map((set, i) => (i === idx ? { ...set, done: becameDone } : set)) }
          : ex,
      ),
    }));
    if (becameDone && data.settings.restSeconds > 0) {
      rest.start(data.settings.restSeconds);
    }
  };

  const addSet = (exId: string) => {
    patch((s) => ({
      ...s,
      exercises: s.exercises.map((ex) =>
        ex.exerciseId === exId ? { ...ex, sets: [...ex.sets, emptySet()] } : ex,
      ),
    }));
  };

  const removeSet = (exId: string, idx: number) => {
    patch((s) => ({
      ...s,
      exercises: s.exercises.map((ex) =>
        ex.exerciseId === exId ? { ...ex, sets: ex.sets.filter((_, i) => i !== idx) } : ex,
      ),
    }));
  };

  const addExercise = () => {
    const name = window.prompt("Názov cviku");
    if (!name || !name.trim()) return;
    patch((s) => ({
      ...s,
      exercises: [
        ...s.exercises,
        { exerciseId: uid(), name: name.trim(), targetReps: 10, sets: [emptySet(), emptySet(), emptySet()] },
      ],
    }));
  };

  const volume = sessionVolume(active);
  const setCount = sessionSetCount(active);
  const reps = sessionReps(active);

  return (
    <div className="space-y-4">
      {/* Hlavička tréningu */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => nav("/")}
          className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted"
          aria-label="Späť"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-extrabold tracking-tight">{active.planName}</h1>
          <ElapsedClock start={active.date} />
        </div>
        <button
          onClick={() => setConfirmDiscard(true)}
          className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          aria-label="Zahodiť tréning"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Živé štatistiky */}
      <div className="grid grid-cols-3 gap-2">
        <LiveStat label="Objem" value={`${Math.round(volume)}`} suffix={data.settings.unit} />
        <LiveStat label="Série" value={`${setCount}`} />
        <LiveStat label="Opakovania" value={`${reps}`} />
      </div>

      {/* Cviky */}
      {active.exercises.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Voľný tréning — pridaj si prvý cvik.
        </div>
      ) : (
        <div className="space-y-3">
          {active.exercises.map((ex) => (
            <ExerciseCard
              key={ex.exerciseId}
              ex={ex}
              unit={data.settings.unit}
              prev={lastPerformance(data.sessions, ex.name, active.id)}
              onSet={updateSet}
              onToggle={toggleDone}
              onAddSet={addSet}
              onRemoveSet={removeSet}
            />
          ))}
        </div>
      )}

      <button
        onClick={addExercise}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-sm font-bold text-muted-foreground transition hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" /> Pridať cvik
      </button>

      {/* Ukončiť */}
      <button
        onClick={() => setConfirmFinish(true)}
        className="sticky bottom-24 z-30 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-extrabold text-primary-foreground shadow-hover transition hover:brightness-105"
      >
        <Flag className="h-5 w-5" /> Ukončiť tréning
      </button>

      <ConfirmDialog
        open={confirmFinish}
        onOpenChange={setConfirmFinish}
        title="Ukončiť tréning?"
        description={`Uloží sa ${setCount} sérií a ${Math.round(volume)} ${data.settings.unit} objemu. Prázdne série sa zahodia.`}
        confirmLabel="Ukončiť a uložiť"
        onConfirm={() => {
          finishSession();
          rest.stop();
          setConfirmFinish(false);
          toast.success("Tréning uložený 💪");
          nav("/progres");
        }}
      />
      <ConfirmDialog
        open={confirmDiscard}
        onOpenChange={setConfirmDiscard}
        title="Zahodiť tréning?"
        description="Rozpracovaný tréning sa neuloží a stratí sa."
        confirmLabel="Zahodiť"
        danger
        onConfirm={() => {
          discardActive();
          rest.stop();
          setConfirmDiscard(false);
          nav("/");
        }}
      />
    </div>
  );
}

/* ---------- Obrazovka výberu, keď nič neprebieha ---------- */
function StartScreen() {
  const { data, startEmptySession } = useStore();
  const nav = useNavigate();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Začať tréning</h1>
        <p className="text-sm text-muted-foreground">Vyber si plán alebo cvič naľahko.</p>
      </div>
      {data.plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <Dumbbell className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-semibold">Žiadny plán</p>
          <button
            onClick={() => nav("/plany")}
            className="mt-3 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Vytvoriť plán
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {data.plans.map((p) => (
            <button
              key={p.id}
              onClick={() => nav(`/trening?plan=${p.id}`)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-card transition hover:border-primary/60"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Dumbbell className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.exercises.length} cvikov</p>
              </div>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => {
          startEmptySession();
        }}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-sm font-bold text-muted-foreground transition hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" /> Voľný tréning (bez plánu)
      </button>
    </div>
  );
}

/* ---------- Karta cviku ---------- */
function ExerciseCard({
  ex,
  unit,
  prev,
  onSet,
  onToggle,
  onAddSet,
  onRemoveSet,
}: {
  ex: SessionExercise;
  unit: string;
  prev: SessionExercise | null;
  onSet: (exId: string, idx: number, field: "weight" | "reps", raw: string) => void;
  onToggle: (exId: string, idx: number) => void;
  onAddSet: (exId: string) => void;
  onRemoveSet: (exId: string, idx: number) => void;
}) {
  const vol = exerciseVolume(ex.sets);
  const best = bestSet(ex.sets);
  const prevBest = prev ? bestSet(prev.sets) : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-3">
        <h3 className="min-w-0 truncate font-bold">{ex.name}</h3>
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">
          cieľ {fmtRepRange(ex.targetReps, ex.targetRepsMax)} opak.
        </span>
      </div>

      {prevBest && (
        <div className="mx-4 mb-2 flex items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground">
          <History className="h-3.5 w-3.5 shrink-0" />
          <span>
            Minule najlepšie:{" "}
            <span className="font-semibold text-foreground">
              {fmtWeight(prevBest.weight, unit as "kg")} × {prevBest.reps}
            </span>
          </span>
        </div>
      )}

      {/* hlavička stĺpcov */}
      <div className="grid grid-cols-[1.5rem_1fr_1fr_2.25rem] items-center gap-2 px-4 pb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        <span className="text-center">#</span>
        <span>Váha ({unit})</span>
        <span>Opak.</span>
        <span />
      </div>

      <div className="space-y-1.5 px-4 pb-2">
        {ex.sets.map((set, i) => (
          <SetRow
            key={i}
            index={i}
            set={set}
            prev={prev?.sets[i] ?? null}
            unit={unit}
            onWeight={(v) => onSet(ex.exerciseId, i, "weight", v)}
            onReps={(v) => onSet(ex.exerciseId, i, "reps", v)}
            onToggle={() => onToggle(ex.exerciseId, i)}
            onRemove={() => onRemoveSet(ex.exerciseId, i)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2">
        <button
          onClick={() => onAddSet(ex.exerciseId)}
          className="flex items-center gap-1.5 text-xs font-bold text-primary transition hover:opacity-80"
        >
          <Plus className="h-3.5 w-3.5" /> Séria
        </button>
        <span className="text-xs text-muted-foreground">
          {best && (
            <span className="mr-3">
              top <span className="font-semibold text-foreground">{fmtWeight(best.weight, unit as "kg")}</span>
            </span>
          )}
          objem <span className="font-semibold text-foreground">{Math.round(vol)} {unit}</span>
        </span>
      </div>
    </div>
  );
}

function SetRow({
  index,
  set,
  prev,
  unit,
  onWeight,
  onReps,
  onToggle,
  onRemove,
}: {
  index: number;
  set: LoggedSet;
  prev: LoggedSet | null;
  unit: string;
  onWeight: (v: string) => void;
  onReps: (v: string) => void;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const placeholderW = prev?.weight != null ? String(prev.weight) : "–";
  const placeholderR = prev?.reps != null ? String(prev.reps) : String("");
  return (
    <div
      className={`grid grid-cols-[1.5rem_1fr_1fr_2.25rem] items-center gap-2 rounded-xl px-1 py-1 transition ${
        set.done ? "bg-primary/10" : ""
      }`}
    >
      <span
        className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
          set.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {index + 1}
      </span>
      <input
        inputMode="decimal"
        value={set.weight ?? ""}
        onChange={(e) => onWeight(e.target.value)}
        placeholder={placeholderW}
        aria-label={`Séria ${index + 1} váha`}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-center text-base font-bold outline-none transition focus:border-primary"
      />
      <input
        inputMode="numeric"
        value={set.reps ?? ""}
        onChange={(e) => onReps(e.target.value)}
        placeholder={placeholderR || "0"}
        aria-label={`Séria ${index + 1} opakovania`}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-center text-base font-bold outline-none transition focus:border-primary"
      />
      <div className="flex items-center justify-end">
        {set.weight == null && set.reps == null ? (
          <button
            onClick={onRemove}
            aria-label="Odstrániť sériu"
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={onToggle}
            aria-label="Označiť sériu ako hotovú"
            className={`grid h-8 w-8 place-items-center rounded-lg border-2 transition ${
              set.done
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            <Check className="h-4 w-4" strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- Pomocné ---------- */
function LiveStat({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-2 py-2.5 text-center">
      <p className="text-lg font-extrabold leading-none tracking-tight">
        {value}
        {suffix && <span className="ml-0.5 text-[11px] font-semibold text-muted-foreground">{suffix}</span>}
      </p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function ElapsedClock({ start }: { start: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="flex items-center gap-1 text-xs text-muted-foreground">
      <Timer className="h-3.5 w-3.5" /> {fmtDuration(now - start)}
    </p>
  );
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  danger,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  danger?: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Späť</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={danger ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
