// Zoznam tréningových plánov + vytvorenie nového.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Dumbbell, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/workout/store";
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

export default function Plans() {
  const { data, createPlan, deletePlan, duplicatePlan } = useStore();
  const nav = useNavigate();
  const [toDelete, setToDelete] = useState<string | null>(null);

  const handleCreate = () => {
    const plan = createPlan("Nový plán");
    nav(`/plany/${plan.id}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Tréningové plány</h1>
          <p className="text-sm text-muted-foreground">Cviky, série a cieľové opakovania</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:brightness-105"
        >
          <Plus className="h-4 w-4" /> Nový
        </button>
      </div>

      {data.plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <Dumbbell className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-semibold">Zatiaľ žiadny plán</p>
          <p className="mt-1 text-sm text-muted-foreground">Vytvor si prvý tréningový plán so svojimi cvikmi.</p>
          <button
            onClick={handleCreate}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Vytvoriť plán
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.plans.map((plan) => (
            <div key={plan.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="flex items-start gap-3 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Dumbbell className="h-5 w-5" />
                </span>
                <button onClick={() => nav(`/plany/${plan.id}`)} className="min-w-0 flex-1 text-left">
                  <p className="truncate font-bold">{plan.name}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {plan.exercises.length} cvikov
                    {plan.exercises.length > 0 &&
                      ` • ${plan.exercises
                        .slice(0, 3)
                        .map((e) => e.name || "cvik")
                        .join(", ")}${plan.exercises.length > 3 ? "…" : ""}`}
                  </p>
                </button>
              </div>
              <div className="flex items-center gap-1 border-t border-border/70 bg-muted/30 px-2 py-1.5">
                <button
                  onClick={() => nav(`/trening?plan=${plan.id}`)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-bold text-primary transition hover:bg-primary/10"
                >
                  <Play className="h-4 w-4" /> Cvičiť
                </button>
                <IconAction label="Upraviť" onClick={() => nav(`/plany/${plan.id}`)}>
                  <Pencil className="h-4 w-4" />
                </IconAction>
                <IconAction
                  label="Duplikovať"
                  onClick={() => {
                    duplicatePlan(plan.id);
                    toast.success("Plán skopírovaný");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </IconAction>
                <IconAction label="Vymazať" danger onClick={() => setToDelete(plan.id)}>
                  <Trash2 className="h-4 w-4" />
                </IconAction>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vymazať plán?</AlertDialogTitle>
            <AlertDialogDescription>
              Tréningový plán sa odstráni. Odcvičené tréningy v histórii ostanú zachované.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) deletePlan(toDelete);
                setToDelete(null);
                toast.success("Plán vymazaný");
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Vymazať
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function IconAction({
  children,
  onClick,
  label,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-lg transition hover:bg-muted ${
        danger ? "text-destructive" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}
