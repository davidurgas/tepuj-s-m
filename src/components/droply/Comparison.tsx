import { Check, X } from "lucide-react";
import Reveal from "./Reveal";

const ROWS = [
  { label: "Plastový odpad", classic: "Nová fľaša pri každom kúpení", droply: "1 fľašu používaš stále dokola" },
  { label: "Hmotnosť pri nákupe", classic: "Ťaháš litre vody domov", droply: "Ľahká tableta príde poštou" },
  { label: "Miesto v skrini", classic: "Rad fliaš pod drezom", droply: "Malá krabička" },
  { label: "Zloženie", classic: "~95 % voda + plast", droply: "Koncentrát bez zbytočnej vody" },
  { label: "Uhlíková stopa dopravy", classic: "Vysoká (prepravuje sa voda)", droply: "Nízka (ľahké a malé)" },
  { label: "Cena za použitie", classic: "Vyššia", droply: "Nižšia" },
];

export default function Comparison() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="container-tight">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Porovnanie</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            Klasické fľaše <span className="font-accent">vs.</span> Droply
          </h2>
        </Reveal>

        {/* MOBIL – karty */}
        <div className="mt-10 space-y-3 sm:hidden">
          {ROWS.map((row) => (
            <Reveal key={row.label} className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <p className="font-display text-base font-bold">{row.label}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <X className="h-3.5 w-3.5 text-destructive/70" /> Klasické
                  </div>
                  <p className="text-sm text-muted-foreground">{row.classic}</p>
                </div>
                <div className="rounded-xl bg-accent/10 p-3">
                  <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-eco">
                    <Check className="h-3.5 w-3.5" /> Droply
                  </div>
                  <p className="text-sm font-medium">{row.droply}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* DESKTOP – tabuľka */}
        <Reveal className="mx-auto mt-10 hidden max-w-4xl overflow-hidden rounded-3xl border border-border shadow-card sm:block">
          <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-muted/60 text-base font-semibold">
            <div className="p-4" />
            <div className="p-4 text-center text-muted-foreground">Klasické čističe</div>
            <div className="bg-water-gradient p-4 text-center text-white">Droply tablety</div>
          </div>

          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-[1.2fr_1fr_1fr] items-center text-sm ${i % 2 ? "bg-card" : "bg-muted/20"}`}
            >
              <div className="p-4 font-medium">{row.label}</div>
              <div className="flex items-center gap-2 p-4 text-muted-foreground">
                <X className="h-4 w-4 shrink-0 text-destructive/70" />
                <span>{row.classic}</span>
              </div>
              <div className="flex items-center gap-2 border-l border-accent/10 bg-accent/5 p-4 font-medium">
                <Check className="h-4 w-4 shrink-0 text-eco" />
                <span>{row.droply}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
