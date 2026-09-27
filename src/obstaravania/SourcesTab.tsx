// Odkiaľ dáta pochádzajú, ručná aktualizácia, ďalšie portály, zálohy.
import { useRef } from "react";
import { CheckCircle2, Download, ExternalLink, RefreshCw, Upload, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Tender, TenderFeed } from "./core";
import { CPV_CODES } from "./core";
import AddTenderDialog from "./AddTenderDialog";
import { exportBackup, exportCsv, fmtDate } from "./format";
import type { LocalData, LocalStore } from "./store";

const PORTALS = [
  {
    name: "ÚVO – Vyhľadávanie zákaziek",
    url: "https://www.uvo.gov.sk/vyhladavanie/vyhladavanie-zakaziek",
    note: "Vestník verejného obstarávania – nadlimitné aj podlimitné zákazky. Hľadaj „tepovanie“, „čistenie kobercov“.",
  },
  {
    name: "EKS – Elektronický kontraktačný systém",
    url: "https://www.eks.sk/",
    note: "Zákazky s nízkou hodnotou a bežne dostupné služby. Registrácia dodávateľa je zadarmo.",
  },
  {
    name: "Josephine",
    url: "https://josephine.proebiz.com/sk/",
    note: "Najčastejší systém miest, škôl a nemocníc. Po registrácii posiela upozornenia e-mailom.",
  },
  {
    name: "TED – Úradný vestník EÚ",
    url: "https://ted.europa.eu/sk/",
    note: "Veľké (nadlimitné) zákazky. Z neho appka čerpá automaticky.",
  },
];

export default function SourcesTab({
  feed,
  tenders,
  store,
  refreshing,
  onRefresh,
}: {
  feed: TenderFeed | null;
  tenders: Tender[];
  store: LocalStore;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function restore(file: File) {
    try {
      const d = JSON.parse(await file.text()) as LocalData;
      if (!d || typeof d.tracking !== "object") throw new Error();
      store.replaceAll(d);
      toast.success("Záloha obnovená");
    } catch {
      toast.error("Súbor nie je platná záloha");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-card">
        <h2 className="font-bold">Automatický zber</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Každé ráno sa stiahnu slovenské zákazky z TED podľa CPV kódov upratovania a čistenia textílií a podľa kľúčových
          slov. Posledná aktualizácia: <b>{feed?.generatedAt ? fmtDate(feed.generatedAt.slice(0, 16)) : "zatiaľ neprebehla"}</b>
        </p>
        <ul className="mt-3 space-y-1.5 text-sm">
          {(feed?.sources ?? []).map((s) => (
            <li key={s.name} className="flex items-start gap-2">
              {s.ok ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-eco" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              )}
              <span>
                {s.name}: {s.count} zákaziek
                {s.error && <span className="block text-xs text-muted-foreground">Upozornenie: {s.error}</span>}
              </span>
            </li>
          ))}
        </ul>
        <Button className="mt-4" variant="secondary" onClick={onRefresh} disabled={refreshing}>
          <RefreshCw className={refreshing ? "animate-spin" : ""} /> {refreshing ? "Sťahujem…" : "Skontrolovať TED teraz"}
        </Button>
      </section>

      <section>
        <h2 className="mb-2 font-bold">Ďalšie portály (menšie zákazky)</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Menšie zákazky na tepovanie (školy, úrady, škôlky) často idú cez tieto systémy. Keď tam nájdeš niečo zaujímavé,
          pridaj si to ručne a sleduj termín tu.
        </p>
        <div className="space-y-2">
          {PORTALS.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-card p-3.5 transition hover:bg-secondary"
            >
              <span>
                <span className="block font-semibold">{p.name}</span>
                <span className="block text-sm text-muted-foreground">{p.note}</span>
              </span>
              <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
          ))}
        </div>
        <div className="mt-3">
          <AddTenderDialog
            onAdd={(t) => {
              store.addManual(t);
              toast.success("Zákazka pridaná medzi sledované");
            }}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-bold">Čo hľadáme</h2>
        <p className="text-sm text-muted-foreground">
          <b>Kľúčové slová:</b> tepovanie, koberce, čalúnenie, sedačky, matrace, textilné podlahové krytiny, strojové a
          hĺbkové čistenie, záclony a závesy (bez ohľadu na diakritiku a tvar slova)
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          <b>CPV:</b> {CPV_CODES.map((c) => `${c.code} ${c.label}`).join(" · ")}
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-bold">Export a záloha</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => exportCsv(tenders, store.data.tracking)}>
            <Download /> Export do Excelu (CSV)
          </Button>
          <Button variant="secondary" onClick={() => exportBackup(store.data)}>
            <Download /> Zálohovať poznámky
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload /> Obnoviť zo zálohy
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) restore(f);
              e.target.value = "";
            }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Stavy a poznámky sa ukladajú len v tomto prehliadači. Na prenos do iného zariadenia použi zálohu.
        </p>
      </section>
    </div>
  );
}
