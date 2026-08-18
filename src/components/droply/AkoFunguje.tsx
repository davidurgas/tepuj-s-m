import { Droplets, Sparkles, Wand2 } from "lucide-react";
import Reveal from "./Reveal";

const STEPS = [
  {
    n: "01",
    icon: Droplets,
    title: "Naplň fľašu vodou",
    text: "Do dávkovacej fľaše natočíš obyčajnú vodu z vodovodu. Žiadne nosenie litrov z obchodu.",
  },
  {
    n: "02",
    icon: Sparkles,
    title: "Vhoď tabletu Droply",
    text: "Tableta začne šumieť a rozpúšťať sa. Koncentrát sa uvoľní a rovnomerne rozmieša vo vode.",
  },
  {
    n: "03",
    icon: Wand2,
    title: "Čisti ako zvyčajne",
    text: "O dve minúty máš plnohodnotný čistiaci prostriedok. Rovnaký výkon, zlomkový dopad na planétu.",
  },
];

export default function AkoFunguje() {
  return (
    <section id="ako" className="relative py-20 sm:py-28">
      <div className="container-tight">
        <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="kicker">02 — Ako to funguje</span>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-tight sm:text-5xl">
              Tri kroky k <span className="font-accent text-primary">čistej</span> domácnosti
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Namiesto police plnej fliaš ti stačí krabička tabliet a jedna fľaša, ktorú používaš stále dokola.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal
                key={step.n}
                delay={i * 90}
                className="group relative flex flex-col bg-card p-8 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-5xl font-bold text-muted/60 transition-colors group-hover:text-primary/30">
                    {step.n}
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-border text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-8 font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
