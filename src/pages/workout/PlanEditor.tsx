// Editor plánu: názov, cviky, počet sérií a cieľové opakovania.
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Play, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/workout/store";
import { uid } from "@/lib/workout/calc";
import type { Plan, PlanExercise } from "@/lib/workout/types";

export default function PlanEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, updatePlan } = useStore();
  const existing = data.plans.find((p) => p.id === id);
  const [plan, setPlan] = useState<Plan | null>(existing ?? null);

  // drž lokálnu kópiu, ukladaj priebežne
  useEffect(() => {
    if (existing) setPlan((prev) => prev ?? existing);
  }, [existing]);

  if (!plan) {
    return (
      <div className="space-y-4">
        <BackBtn onClick={() => nav("/plany")} />
        <p className="text-sm text-muted-foreground">Plán sa nenašiel.</p>
      </div>
    );
  }

  const commit = (next: Plan) => {
    setPlan(next);
    updatePlan(next);
  };

  const setExercise = (exId: string, patch: Partial<PlanExercise>) => {
    commit({ ...plan, exercises: plan.exercises.map((e) => (e.id === exId ? { ...e, ...patch } : e)) });
  };

  const addExercise = () => {
    commit({
      ...plan,
      exercises: [...plan.exercises, { id: uid(), name: "", sets: 3, targetReps: 10 }],
    });
  };

  const removeExercise = (exId: string) => {
    commit({ ...plan, exercises: plan.exercises.filter((e) => e.id !== exId) });
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...plan.exercises];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    commit({ ...plan, exercises: next });
  };

  const canTrain = plan.exercises.some((e) => e.name.trim());

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <BackBtn onClick={() => nav("/plany")} />
        <button
          disabled={!canTrain}
          onClick={() => nav(`/trening?plan=${plan.id}`)}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm font-bold text-primary-foreground shadow-glow transition enabled:hover:brightness-105 disabled:opacity-40"
        >
          <Play className="h-4 w-4" /> Cvičiť
        </button>
      </div>

      <div className="space-y-3">
        <input
          value={plan.name}
          onChange={(e) => commit({ ...plan, name: e.target.value })}
          placeholder="Názov plánu"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-lg font-extrabold tracking-tight outline-none transition focus:border-primary"
        />
        <input
          value={plan.note ?? ""}
          onChange={(e) => commit({ ...plan, note: e.target.value })}
          placeholder="Poznámka (napr. partie: hrudník, triceps)"
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition focus:border-primary"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Cviky</h2>
          <span className="text-xs text-muted-foreground">{plan.exercises.length}</span>
        </div>

        {plan.exercises.map((ex, i) => (
          <div key={ex.id} className="rounded-2xl border border-border bg-card p-3 shadow-card">
            <div className="flex items-center gap-2">
              <div className="flex flex-col text-muted-foreground">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Posunúť vyššie"
                  className="grid h-5 w-5 place-items-center rounded transition hover:text-foreground disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === plan.exercises.length - 1}
                  aria-label="Posunúť nižšie"
                  className="grid h-5 w-5 place-items-center rounded transition hover:text-foreground disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <input
                value={ex.name}
                onChange={(e) => setExercise(ex.id, { name: e.target.value })}
                placeholder={`Cvik ${i + 1} (napr. Bench press)`}
                className="min-w-0 flex-1 rounded-lg border border-transparent bg-muted/40 px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-primary focus:bg-background"
              />
              <button
                onClick={() => removeExercise(ex.id)}
                aria-label="Odstrániť cvik"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2.5 space-y-2">
              <ControlBlock label="Série">
                <Stepper
                  value={ex.sets}
                  min={1}
                  max={20}
                  onChange={(v) => setExercise(ex.id, { sets: v })}
                />
              </ControlBlock>

              <ControlBlock
                label="Opakovania"
                action={
                  ex.targetRepsMax == null ? (
                    <button
                      onClick={() =>
                        setExercise(ex.id, { targetRepsMax: Math.min(100, ex.targetReps + 2) })
                      }
                      className="text-xs font-bold text-primary transition hover:opacity-80"
                    >
                      + rozsah
                    </button>
                  ) : (
                    <button
                      onClick={() => setExercise(ex.id, { targetRepsMax: undefined })}
                      className="text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                    >
                      zrušiť rozsah
                    </button>
                  )
                }
              >
                <Stepper
                  value={ex.targetReps}
                  min={1}
                  max={100}
                  onChange={(v) =>
                    setExercise(ex.id, {
                      targetReps: v,
                      // udrž hornú hranicu ≥ dolnej
                      targetRepsMax:
                        ex.targetRepsMax != null && ex.targetRepsMax < v ? v : ex.targetRepsMax,
                    })
                  }
                />
                {ex.targetRepsMax != null && (
                  <>
                    <span className="px-0.5 text-sm font-bold text-muted-foreground">–</span>
                    <Stepper
                      value={ex.targetRepsMax}
                      min={ex.targetReps}
                      max={100}
                      onChange={(v) => setExercise(ex.id, { targetRepsMax: v })}
                    />
                  </>
                )}
              </ControlBlock>
            </div>
          </div>
        ))}

        <button
          onClick={addExercise}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3.5 text-sm font-bold text-muted-foreground transition hover:border-primary hover:text-primary"
        >
          <Plus className="h-4 w-4" /> Pridať cvik
        </button>
      </div>

      <p className="px-1 text-center text-xs text-muted-foreground">Zmeny sa ukladajú automaticky.</p>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg py-1 pr-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" /> Plány
    </button>
  );
}

/** Blok ovládača: názov (+ voliteľná akcia vpravo) a pod ním samotné ovládanie. */
function ControlBlock({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-muted/40 px-3 py-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
        {action}
      </div>
      <div className="mt-2 flex items-center gap-2">{children}</div>
    </div>
  );
}

/** Kompaktný stepper: [−] hodnota [+]. */
function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, Number.isNaN(v) ? min : v));
  return (
    <div className="flex items-center gap-1.5">
      <StepBtn label="Znížiť" onClick={() => onChange(clamp(value - 1))}>
        −
      </StepBtn>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(clamp(parseInt(e.target.value || "0", 10)))}
        className="w-11 rounded-lg bg-background py-1.5 text-center text-base font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <StepBtn label="Zvýšiť" onClick={() => onChange(clamp(value + 1))}>
        +
      </StepBtn>
    </div>
  );
}

function StepBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-background text-lg font-bold text-foreground shadow-sm transition active:scale-95 hover:bg-primary hover:text-primary-foreground"
    >
      {children}
    </button>
  );
}
