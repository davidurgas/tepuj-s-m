// Detail zákazky: stav našej ponuky, poznámka, odkazy, termín do kalendára.
import { CalendarPlus, ExternalLink, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Tender } from "./core";
import { CPV_CODES, RELEVANCE_LABEL, STAGE_LABEL } from "./core";
import { exportIcs, fmtDate, fmtMoney } from "./format";
import type { LocalStore } from "./store";
import { TRACK_STATUSES } from "./store";
import { DeadlinePill } from "./TenderCard";

export default function TenderSheet({
  tender,
  store,
  onClose,
}: {
  tender: Tender | null;
  store: LocalStore;
  onClose: () => void;
}) {
  const tr = tender ? store.data.tracking[tender.id] : undefined;

  return (
    <Sheet open={!!tender} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl sm:mx-auto sm:max-w-2xl">
        {tender && (
          <div className="space-y-5 pb-4">
            <SheetHeader className="text-left">
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-eco/15 px-2 py-0.5 text-[11px] font-bold text-eco">
                  {RELEVANCE_LABEL[tender.relevance]}
                </span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {STAGE_LABEL[tender.stage]}
                  {tender.noticeType && tender.source !== "manual" ? ` (${tender.noticeType})` : ""}
                </span>
              </div>
              <SheetTitle className="text-lg leading-snug">{tender.title}</SheetTitle>
              <SheetDescription>{[tender.buyer, tender.city].filter(Boolean).join(" · ")}</SheetDescription>
            </SheetHeader>

            <div className="flex flex-wrap gap-2">
              <DeadlinePill tender={tender} />
              {tender.value != null && (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold">
                  Predpokladaná hodnota {fmtMoney(tender.value, tender.currency)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {tender.url.startsWith("http") ? (
                <Button asChild>
                  <a href={tender.url} target="_blank" rel="noreferrer">
                    <ExternalLink /> Otvoriť oznámenie
                  </a>
                </Button>
              ) : (
                <Button disabled>
                  <ExternalLink /> Bez odkazu
                </Button>
              )}
              <Button variant="secondary" disabled={!tender.deadline} onClick={() => exportIcs(tender)}>
                <CalendarPlus /> Termín do kalendára
              </Button>
            </div>

            <section>
              <h4 className="mb-2 text-sm font-bold">Stav našej ponuky</h4>
              <div className="flex flex-wrap gap-2">
                {TRACK_STATUSES.map((s) => {
                  const active = tr?.status === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => store.setTracking(tender.id, { status: active ? undefined : s.id })}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                        active ? `${s.tone} border-transparent ring-2 ring-primary/40` : "border-border hover:bg-secondary"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h4 className="mb-2 text-sm font-bold">Poznámka</h4>
              <Textarea
                // key → pri prepnutí zákazky sa načíta jej poznámka
                key={tender.id}
                defaultValue={tr?.note ?? ""}
                placeholder="Napr. obhliadka 12. 10., plocha 850 m² kobercov, kontakt: …"
                onBlur={(e) => store.setTracking(tender.id, { note: e.target.value.trim() || undefined })}
                rows={3}
              />
            </section>

            {tender.description && (
              <section>
                <h4 className="mb-1 text-sm font-bold">Popis</h4>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{tender.description}</p>
              </section>
            )}

            <section className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Zverejnené</p>
                <p className="font-semibold">{fmtDate(tender.publishedAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Zdroj</p>
                <p className="font-semibold">{tender.source === "manual" ? "Pridané ručne" : "TED (Úradný vestník EÚ)"}</p>
              </div>
            </section>

            {tender.cpv.length > 0 && (
              <section>
                <h4 className="mb-1 text-sm font-bold">CPV kódy</h4>
                <ul className="space-y-0.5 text-sm text-muted-foreground">
                  {tender.cpv.map((c) => (
                    <li key={c}>
                      {c} {CPV_CODES.find((x) => x.code === c.slice(0, 8))?.label ?? ""}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {tender.matched.length > 0 && (
              <p className="text-xs text-muted-foreground">Zaradené podľa: {tender.matched.join(", ")}</p>
            )}

            {tender.source === "manual" && (
              <Button
                variant="ghost"
                className="text-destructive"
                onClick={() => {
                  store.removeManual(tender.id);
                  onClose();
                }}
              >
                <Trash2 /> Odstrániť ručne pridanú zákazku
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
