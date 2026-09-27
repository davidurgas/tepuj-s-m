// Zákazky na tepovanie — prehľad verejných obstarávaní na Slovensku.
import { useCallback, useEffect, useMemo, useState } from "react";
import { Briefcase, Database, Search, SearchX, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import type { Relevance, Tender, TenderFeed } from "./core";
import { fetchTedTenders, mergeFeeds, normalize } from "./core";
import { daysLeft, isOpen } from "./format";
import { TRACK_STATUSES, useLocalData } from "./store";
import TenderCard from "./TenderCard";
import TenderSheet from "./TenderSheet";
import SourcesTab from "./SourcesTab";

type Tab = "zakazky" | "moje" | "zdroje";
type StageFilter = "otvorene" | "vysledky" | "vsetky";

const TABS: { id: Tab; label: string; icon: typeof Search }[] = [
  { id: "zakazky", label: "Zákazky", icon: Search },
  { id: "moje", label: "Moje ponuky", icon: Briefcase },
  { id: "zdroje", label: "Zdroje", icon: Database },
];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
        active ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary text-secondary-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

export default function App() {
  const store = useLocalData();
  const [feed, setFeed] = useState<TenderFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<Tab>("zakazky");
  const [query, setQuery] = useState("");
  const [relevance, setRelevance] = useState<Relevance | "all">("tepovanie");
  const [stage, setStage] = useState<StageFilter>("otvorene");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/tenders.json`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: TenderFeed | null) => setFeed(d))
      .catch(() => setFeed(null))
      .finally(() => setLoading(false));
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const r = await fetchTedTenders({ sinceDays: 180, maxPages: 2 });
      if (!r.status.ok) throw new Error(r.status.error);
      const now = new Date().toISOString();
      setFeed((prev) => ({
        generatedAt: now,
        sources: [r.status],
        tenders: mergeFeeds(prev?.tenders ?? [], r.tenders, now),
      }));
      toast.success(`TED: ${r.tenders.length} zákaziek skontrolovaných`);
    } catch {
      toast.error("Priame spojenie s TED sa nepodarilo (prehliadač ho môže blokovať). Dáta sa aj tak aktualizujú každé ráno.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const all: Tender[] = useMemo(() => [...store.data.manual, ...(feed?.tenders ?? [])], [store.data.manual, feed]);
  const tracking = store.data.tracking;
  const isNew = (t: Tender) => !!(store.prevVisit && t.firstSeenAt && t.firstSeenAt > store.prevVisit);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    const list = all.filter((t) => {
      if (relevance !== "all" && t.relevance !== relevance && t.source !== "manual") return false;
      if (stage === "otvorene" && !isOpen(t)) return false;
      if (stage === "vysledky" && t.stage !== "vysledok") return false;
      if (q && !normalize(`${t.title} ${t.buyer} ${t.city ?? ""} ${t.description ?? ""}`).includes(q)) return false;
      return true;
    });
    if (stage === "otvorene") {
      // najskôr tie, ktorým najskôr končí lehota; nezaujímavé na koniec
      return list.sort((a, b) => {
        const skip = Number(tracking[a.id]?.status === "skip") - Number(tracking[b.id]?.status === "skip");
        if (skip) return skip;
        return (daysLeft(a.deadline) ?? 9999) - (daysLeft(b.deadline) ?? 9999);
      });
    }
    return list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [all, relevance, stage, query, tracking]);

  const mine = useMemo(() => all.filter((t) => tracking[t.id]?.status && tracking[t.id].status !== "skip"), [all, tracking]);
  const openTender = all.find((t) => t.id === openId) ?? null;

  const openCount = all.filter((t) => t.relevance === "tepovanie" && isOpen(t)).length;
  const newCount = all.filter(isNew).length;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col">
      <Toaster position="top-center" />
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-lg">
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight">
                Zákazky<span className="text-primary">.</span>
              </span>
              <span className="block text-[11px] font-semibold text-muted-foreground">tepovanie · verejné obstarávanie SK</span>
            </span>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <b className="text-base text-foreground">{openCount}</b> otvorených
            {newCount > 0 && <span className="block font-bold text-primary">{newCount} nových</span>}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pb-28 pt-5 sm:px-5">
        {tab === "zakazky" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Hľadať (mesto, škola, koberce…)"
                className="h-11 rounded-xl pl-10"
              />
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              <Chip active={stage === "otvorene"} onClick={() => setStage("otvorene")}>
                Otvorené
              </Chip>
              <Chip active={stage === "vysledky"} onClick={() => setStage("vysledky")}>
                Výsledky (kto vyhral)
              </Chip>
              <Chip active={stage === "vsetky"} onClick={() => setStage("vsetky")}>
                Všetky
              </Chip>
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              <Chip active={relevance === "tepovanie"} onClick={() => setRelevance("tepovanie")}>
                Tepovanie
              </Chip>
              <Chip active={relevance === "cistenie"} onClick={() => setRelevance("cistenie")}>
                Upratovanie / čistenie
              </Chip>
              <Chip active={relevance === "all"} onClick={() => setRelevance("all")}>
                Všetko
              </Chip>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-36 animate-pulse rounded-2xl bg-muted" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState hasData={!!feed?.generatedAt} onSources={() => setTab("zdroje")} />
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{filtered.length} zákaziek</p>
                {filtered.map((t) => (
                  <TenderCard key={t.id} tender={t} tracking={tracking[t.id]} isNew={isNew(t)} onOpen={() => setOpenId(t.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "moje" && (
          <div className="space-y-6">
            {mine.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Zatiaľ nič nesleduješ. Otvor zákazku a označ ju napr. „Zaujíma nás“ — tu uvidíš všetky rozpracované ponuky a
                ich termíny.
              </div>
            )}
            {TRACK_STATUSES.filter((s) => s.id !== "skip").map((s) => {
              const items = mine
                .filter((t) => tracking[t.id]?.status === s.id)
                .sort((a, b) => (a.deadline ?? "9").localeCompare(b.deadline ?? "9"));
              if (!items.length) return null;
              return (
                <section key={s.id}>
                  <h2 className="mb-2 flex items-center gap-2 font-bold">
                    <span className={`rounded-full px-2.5 py-0.5 text-sm ${s.tone}`}>{s.label}</span>
                    <span className="text-sm text-muted-foreground">{items.length}</span>
                  </h2>
                  <div className="space-y-3">
                    {items.map((t) => (
                      <TenderCard key={t.id} tender={t} tracking={tracking[t.id]} onOpen={() => setOpenId(t.id)} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {tab === "zdroje" && (
          <SourcesTab feed={feed} tenders={all} store={store} refreshing={refreshing} onRefresh={refresh} />
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-stretch justify-around px-2 py-1.5">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setTab(id);
                  window.scrollTo({ top: 0 });
                }}
                className={`relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.6 : 2} />
                {label}
                {id === "moje" && mine.length > 0 && (
                  <span className="absolute right-6 top-1 rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                    {mine.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <TenderSheet tender={openTender} store={store} onClose={() => setOpenId(null)} />
    </div>
  );
}

function EmptyState({ hasData, onSources }: { hasData: boolean; onSources: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-6 text-center">
      <SearchX className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="mt-2 font-semibold">{hasData ? "Nič nezodpovedá filtru" : "Dáta ešte neboli stiahnuté"}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasData
          ? "Skús „Všetky“ alebo „Upratovanie / čistenie“ — veľké upratovacie zákazky často obsahujú aj tepovanie."
          : "Automatický zber beží každé ráno. Medzitým môžeš skontrolovať TED priamo alebo pozrieť ďalšie portály."}
      </p>
      <button onClick={onSources} className="mt-3 text-sm font-bold text-primary">
        Zdroje a portály →
      </button>
    </div>
  );
}
