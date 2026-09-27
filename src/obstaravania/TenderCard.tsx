import { Building2, CalendarClock, MapPin, Sparkles } from "lucide-react";
import type { Tender } from "./core";
import { RELEVANCE_LABEL, STAGE_LABEL } from "./core";
import { daysLeft, deadlineText, fmtDate, fmtMoney, isOpen } from "./format";
import type { Tracking } from "./store";
import { TRACK_STATUSES } from "./store";

export function DeadlinePill({ tender }: { tender: Tender }) {
  const n = daysLeft(tender.deadline);
  const open = isOpen(tender);
  const tone =
    !open || n == null
      ? "bg-muted text-muted-foreground"
      : n <= 3
        ? "bg-destructive/15 text-destructive"
        : n <= 7
          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
          : "bg-primary/10 text-primary";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>
      <CalendarClock className="h-3.5 w-3.5" />
      {tender.deadline ? `${fmtDate(tender.deadline)} · ${deadlineText(tender.deadline)}` : deadlineText()}
    </span>
  );
}

export function StatusBadge({ tracking }: { tracking?: Tracking }) {
  const s = TRACK_STATUSES.find((x) => x.id === tracking?.status);
  if (!s) return null;
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${s.tone}`}>{s.label}</span>;
}

export default function TenderCard({
  tender,
  tracking,
  isNew,
  onOpen,
}: {
  tender: Tender;
  tracking?: Tracking;
  isNew?: boolean;
  onOpen: () => void;
}) {
  const dim = tracking?.status === "skip";
  return (
    <button
      onClick={onOpen}
      className={`w-full rounded-2xl border border-border/70 bg-card p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-hover ${
        dim ? "opacity-55" : ""
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {isNew && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-primary-foreground">
            <Sparkles className="h-3 w-3" /> Nové
          </span>
        )}
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
            tender.relevance === "tepovanie" ? "bg-eco/15 text-eco" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {RELEVANCE_LABEL[tender.relevance]}
        </span>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
          {STAGE_LABEL[tender.stage]}
        </span>
        {tender.source === "manual" && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            Pridané ručne
          </span>
        )}
      </div>

      <h3 className="line-clamp-3 font-bold leading-snug">{tender.title}</h3>

      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
        {tender.buyer && (
          <p className="flex items-start gap-1.5">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="line-clamp-2">{tender.buyer}</span>
          </p>
        )}
        {tender.city && (
          <p className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0" />
            {tender.city}
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <DeadlinePill tender={tender} />
        {tender.value != null && (
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold">{fmtMoney(tender.value, tender.currency)}</span>
        )}
        <StatusBadge tracking={tracking} />
        {tracking?.note && <span className="text-xs text-muted-foreground">📝 poznámka</span>}
      </div>
    </button>
  );
}
