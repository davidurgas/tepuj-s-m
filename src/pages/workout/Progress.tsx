// Progres: grafy váh v čase, odhad 1RM, objem, rekordy, história, nastavenia.
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Download, Trash2, TrendingUp, Trophy, Upload } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/workout/store";
import {
  allExerciseNames,
  exerciseHistory,
  personalRecords,
  sessionSetCount,
  sessionVolume,
} from "@/lib/workout/calc";
import { exportData, importData } from "@/lib/workout/storage";
import { fmtClock, fmtDate, fmtNumber, fmtRelative, fmtWeight } from "@/lib/workout/format";
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

type Metric = "est1RM" | "topWeight" | "volume";
const METRICS: { key: Metric; label: string }[] = [
  { key: "est1RM", label: "Odhad 1RM" },
  { key: "topWeight", label: "Najťažšia séria" },
  { key: "volume", label: "Objem" },
];

export default function Progress() {
  const { data, deleteSession } = useStore();
  const { sessions, settings } = data;
  const finished = useMemo(() => sessions.filter((s) => s.finishedAt), [sessions]);

  const names = useMemo(() => allExerciseNames(finished), [finished]);
  const [exercise, setExercise] = useState<string>("");
  const [metric, setMetric] = useState<Metric>("est1RM");
  const [toDelete, setToDelete] = useState<string | null>(null);

  const selected = exercise || names[0] || "";
  const history = useMemo(
    () => (selected ? exerciseHistory(finished, selected) : []),
    [finished, selected],
  );
  const prs = useMemo(() => personalRecords(finished), [finished]);

  const trend = useMemo(() => {
    if (history.length < 2) return null;
    const first = history[0][metric];
    const last = history[history.length - 1][metric];
    if (!first) return null;
    return Math.round(((last - first) / first) * 100);
  }, [history, metric]);

  if (finished.length === 0) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Progres</h1>
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <TrendingUp className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-semibold">Zatiaľ žiadne dáta</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Odcvič prvý tréning a uvidíš tu grafy progresu a osobné rekordy.
          </p>
        </div>
        <SettingsSection />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Progres</h1>

      {/* Graf cviku */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4.5 w-4.5 text-primary" />
          <select
            value={selected}
            onChange={(e) => setExercise(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-bold outline-none focus:border-primary"
          >
            {names.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3 flex gap-1.5">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-bold transition ${
                metric === m.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {history.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Žiadne dáta pre tento cvik.</p>
        ) : (
          <>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">
                {fmtWeight(history[history.length - 1][metric], metric === "volume" ? undefined : settings.unit)}
              </span>
              {trend != null && (
                <span className={`text-sm font-bold ${trend >= 0 ? "text-eco" : "text-destructive"}`}>
                  {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)} %
                </span>
              )}
              <span className="ml-auto text-xs text-muted-foreground">{history.length} tréningov</span>
            </div>
            <ExerciseChart data={history} metric={metric} unit={settings.unit} />
          </>
        )}
      </section>

      {/* Osobné rekordy */}
      {prs.length > 0 && (
        <section>
          <h2 className="mb-2.5 flex items-center gap-2 text-base font-bold">
            <Trophy className="h-4.5 w-4.5 text-sunny" /> Osobné rekordy
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {prs.map((pr) => (
              <div key={pr.name} className="rounded-xl border border-border bg-card p-3">
                <p className="truncate text-sm font-bold">{pr.name}</p>
                <div className="mt-1 flex items-end justify-between">
                  <p className="text-lg font-extrabold text-primary">
                    {fmtWeight(pr.weight, settings.unit)}{" "}
                    <span className="text-sm font-semibold text-muted-foreground">× {pr.reps}</span>
                  </p>
                  <p className="text-right text-[11px] text-muted-foreground">
                    1RM ~{fmtWeight(pr.est1RM, settings.unit)}
                    <br />
                    {fmtDate(pr.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* História */}
      <section>
        <h2 className="mb-2.5 text-base font-bold">História tréningov</h2>
        <div className="space-y-2">
          {finished.map((s) => (
            <details key={s.id} className="group overflow-hidden rounded-xl border border-border bg-card">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{s.planName}</p>
                  <p className="text-xs text-muted-foreground">
                    {fmtRelative(s.finishedAt ?? s.date)} • {sessionSetCount(s)} sérií •{" "}
                    {fmtNumber(sessionVolume(s))} {settings.unit}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setToDelete(s.id);
                  }}
                  aria-label="Vymazať tréning"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </summary>
              <div className="space-y-2 border-t border-border/60 px-3 pb-3 pt-2">
                {s.exercises.map((ex, i) => (
                  <div key={i} className="text-sm">
                    <p className="font-semibold">{ex.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ex.sets
                        .filter((set) => set.weight != null || set.reps != null)
                        .map((set) => `${set.weight ?? "–"}${settings.unit}×${set.reps ?? "–"}`)
                        .join("  •  ")}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <SettingsSection />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vymazať tréning?</AlertDialogTitle>
            <AlertDialogDescription>Tento záznam z histórie sa natrvalo odstráni.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) deleteSession(toDelete);
                setToDelete(null);
                toast.success("Tréning vymazaný");
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

function ExerciseChart({
  data,
  metric,
  unit,
}: {
  data: ReturnType<typeof exerciseHistory>;
  metric: Metric;
  unit: string;
}) {
  const chartData = data.map((p) => ({ ...p, label: fmtDate(p.date) }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          minTickGap={20}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          width={40}
          domain={["dataMin - 5", "dataMax + 5"]}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 12,
            fontSize: 12,
          }}
          labelStyle={{ fontWeight: 700, color: "hsl(var(--foreground))" }}
          formatter={(value: number) => [`${value} ${unit}`, METRICS.find((m) => m.key === metric)?.label]}
        />
        <Area
          type="monotone"
          dataKey={metric}
          stroke="hsl(var(--primary))"
          strokeWidth={2.5}
          fill="url(#fillMetric)"
          dot={{ r: 3, fill: "hsl(var(--primary))", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ---------- Nastavenia ---------- */
function SettingsSection() {
  const { data, updateSettings, replaceAll } = useStore();
  const { settings } = data;

  const doExport = () => {
    const blob = new Blob([exportData(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rep-zaloha-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Záloha stiahnutá");
  };

  const doImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const parsed = importData(String(reader.result));
        if (parsed) {
          replaceAll(parsed);
          toast.success("Dáta obnovené zo zálohy");
        } else {
          toast.error("Neplatný súbor zálohy");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <section>
      <h2 className="mb-2.5 text-base font-bold">Nastavenia</h2>
      <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
        {/* Oddych */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Oddych medzi sériami</p>
            <p className="text-xs text-muted-foreground">Časovač po označení série</p>
          </div>
          <div className="flex items-center gap-1.5">
            {[60, 90, 120, 180].map((sec) => (
              <button
                key={sec}
                onClick={() => updateSettings({ restSeconds: sec })}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                  settings.restSeconds === sec
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {fmtClock(sec)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/60" />

        {/* Jednotka */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">Jednotka váhy</p>
          <div className="flex items-center gap-1.5">
            {(["kg", "lb"] as const).map((u) => (
              <button
                key={u}
                onClick={() => updateSettings({ unit: u })}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition ${
                  settings.unit === u
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/60" />

        {/* Zvuk */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Zvuk časovača</p>
            <p className="text-xs text-muted-foreground">Pípnutie po skončení oddychu</p>
          </div>
          <button
            onClick={() => updateSettings({ sound: !settings.sound })}
            className={`relative h-6 w-11 rounded-full transition ${settings.sound ? "bg-primary" : "bg-muted"}`}
            aria-label="Prepnúť zvuk"
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                settings.sound ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>

        <div className="h-px bg-border/60" />

        {/* Záloha */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={doExport}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-muted py-2.5 text-xs font-bold transition hover:bg-muted/70"
          >
            <Download className="h-4 w-4" /> Zálohovať
          </button>
          <button
            onClick={doImport}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-muted py-2.5 text-xs font-bold transition hover:bg-muted/70"
          >
            <Upload className="h-4 w-4" /> Obnoviť
          </button>
        </div>
        <p className="pt-1 text-center text-[11px] text-muted-foreground">
          Dáta sú uložené len v tomto zariadení. Zálohu si odlož do súboru.
        </p>
      </div>
    </section>
  );
}
