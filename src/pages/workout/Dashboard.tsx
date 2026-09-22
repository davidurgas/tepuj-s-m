// Prehľad: rýchly štart, štatistiky, osobné rekordy, posledné tréningy.
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowRight, CalendarDays, Dumbbell, Flame, Play, Trophy, Weight } from "lucide-react";
import { useStore } from "@/lib/workout/store";
import { personalRecords, sessionSetCount, sessionVolume } from "@/lib/workout/calc";
import { fmtDuration, fmtNumber, fmtRelative, fmtWeight } from "@/lib/workout/format";

export default function Dashboard() {
  const { data } = useStore();
  const nav = useNavigate();
  const { sessions, plans, settings, active } = data;

  const stats = useMemo(() => {
    const finished = sessions.filter((s) => s.finishedAt);
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = finished.filter((s) => (s.finishedAt ?? 0) >= weekAgo).length;
    const totalVolume = finished.reduce((sum, s) => sum + sessionVolume(s), 0);
    return { count: finished.length, thisWeek, totalVolume, streak: computeStreak(finished.map((s) => s.finishedAt ?? s.date)) };
  }, [sessions]);

  const prs = useMemo(() => personalRecords(sessions).slice(0, 4), [sessions]);
  const recent = useMemo(
    () => sessions.filter((s) => s.finishedAt).slice(0, 4),
    [sessions],
  );

  const hour = new Date().getHours();
  const greeting = hour < 10 ? "Dobré ráno" : hour < 18 ? "Poď na to" : "Večerný tréning";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{greeting} 👋</p>
        <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight">Tvoj tréningový denník</h1>
      </div>

      {/* Rýchly štart */}
      {active ? (
        <button
          onClick={() => nav("/trening")}
          className="group flex w-full items-center gap-4 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-left transition hover:bg-primary/15"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Activity className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Prebieha tréning</p>
            <p className="truncate font-bold">{active.planName}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-primary transition group-hover:translate-x-1" />
        </button>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold">
            <Play className="h-4 w-4 text-primary" /> Rýchly štart
          </div>
          {plans.length === 0 ? (
            <Link
              to="/plany"
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-6 text-sm font-semibold text-muted-foreground"
            >
              Najprv si vytvor tréningový plán <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {plans.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => nav(`/trening?plan=${p.id}`)}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-left transition hover:border-primary/60 hover:bg-primary/5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Dumbbell className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.exercises.length} cvikov</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Štatistiky */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={CalendarDays} label="Tento týždeň" value={`${stats.thisWeek}×`} />
        <Stat icon={Flame} label="Séria dní" value={`${stats.streak}`} accent />
        <Stat icon={Dumbbell} label="Spolu tréningov" value={`${stats.count}`} />
        <Stat icon={Weight} label="Nadvihnuté" value={fmtNumber(stats.totalVolume)} suffix={settings.unit} />
      </div>

      {/* Osobné rekordy */}
      {prs.length > 0 && (
        <section>
          <SectionHeader icon={Trophy} title="Osobné rekordy" to="/progres" cta="Progres" />
          <div className="grid gap-2 sm:grid-cols-2">
            {prs.map((pr) => (
              <div key={pr.name} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sunny/15 text-sunny">
                  <Trophy className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{pr.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {fmtWeight(pr.weight, settings.unit)} × {pr.reps} • odhad 1RM {fmtWeight(pr.est1RM, settings.unit)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Posledné tréningy */}
      <section>
        <SectionHeader icon={CalendarDays} title="Posledné tréningy" to="/progres" cta="História" />
        {recent.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Zatiaľ žiadny odcvičený tréning. Poď na prvý! 💪
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((s) => {
              const dur = s.finishedAt ? s.finishedAt - s.date : 0;
              return (
                <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Dumbbell className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{s.planName}</p>
                    <p className="text-xs text-muted-foreground">
                      {fmtRelative(s.finishedAt ?? s.date)} • {sessionSetCount(s)} sérií
                      {dur > 60000 ? ` • ${fmtDuration(dur)}` : ""}
                    </p>
                  </div>
                  <span className="text-right text-xs font-semibold text-muted-foreground">
                    {fmtNumber(sessionVolume(s))} {settings.unit}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  suffix,
  accent,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-3 ${accent ? "border-primary/40 bg-primary/10" : "border-border bg-card"}`}>
      <Icon className={`mb-2 h-4.5 w-4.5 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      <p className="text-xl font-extrabold leading-none tracking-tight">
        {value}
        {suffix && <span className="ml-1 text-xs font-semibold text-muted-foreground">{suffix}</span>}
      </p>
      <p className="mt-1 text-[11px] font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  to,
  cta,
}: {
  icon: typeof Flame;
  title: string;
  to: string;
  cta: string;
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-base font-bold">
        <Icon className="h-4.5 w-4.5 text-muted-foreground" /> {title}
      </h2>
      <Link to={to} className="flex items-center gap-1 text-xs font-semibold text-primary">
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

/** Séria po sebe idúcich dní s tréningom (končí dnes alebo včera). */
function computeStreak(timestamps: number[]): number {
  if (timestamps.length === 0) return 0;
  const day = 24 * 60 * 60 * 1000;
  const midnight = (ts: number) => {
    const d = new Date(ts);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  };
  const days = new Set(timestamps.map(midnight));
  const today = midnight(Date.now());
  let cursor = days.has(today) ? today : today - day;
  if (!days.has(cursor)) return 0;
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor -= day;
  }
  return streak;
}
