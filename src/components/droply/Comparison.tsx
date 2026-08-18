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
          <span className="text-sm font-bold uppercase tracking-wider text-accent">Porovnanie</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Klasické fľaše vs. <span className="text-gradient">Droply</span>
          </h2>
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-border shadow-card">
          {/* hlavička */}
          <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-muted/60 text-sm font-semibold sm:text-base">
            <div className="p-4" />
            <div className="p-4 text-center text-muted-foreground">Klasické čističe</div>
            <div className="bg-water-gradient p-4 text-center text-white">Droply tablety</div>
          </div>

          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-[1.2fr_1fr_1fr] items-center text-sm ${
                i % 2 ? "bg-card" : "bg-muted/20"
              }`}
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
