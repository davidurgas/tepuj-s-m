import { useEffect, useRef, useState } from "react";
import { Droplets, Sparkles, CheckCircle2 } from "lucide-react";
import DissolveGlass from "./DissolveGlass";

const STEPS = [
  {
    icon: Droplets,
    title: "1 · Naplň fľašu vodou",
    text: "Do priloženej dávkovacej fľaše natočíš obyčajnú vodu z vodovodu. Žiadne litre nosené z obchodu.",
  },
  {
    icon: Sparkles,
    title: "2 · Vhoď tabletu Droply",
    text: "Tableta začne šumieť a rozpúšťať sa. Koncentrát sa uvoľní a rovnomerne rozmieša vo vode.",
  },
  {
    icon: CheckCircle2,
    title: "3 · Hotovo – môžeš čistiť",
    text: "O dve minúty máš plnohodnotný čistiaci prostriedok. Rovnaký výkon, zlomkový dopad na planétu.",
  },
];

export default function DissolveScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const compute = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeStep = progress < 0.34 ? 0 : progress < 0.7 ? 1 : 2;

  return (
    <section id="ako-funguje" ref={sectionRef} className="relative bg-background" style={{ height: "300vh" }}>
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-12">
        <div className="container-tight grid w-full items-center gap-8 md:grid-cols-2">
          {/* Vizuál */}
          <div className="order-2 md:order-1">
            <div className="relative mx-auto max-w-md rounded-3xl bg-gradient-to-b from-accent/10 to-primary/10 p-8">
              <DissolveGlass progress={progress} />
              {/* progres bar rozpúšťania */}
              <div className="mx-auto mt-6 max-w-xs">
                <div className="mb-2 flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Rozpúšťanie</span>
                  <span>{Math.round(progress * 100)} %</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-water-gradient transition-[width] duration-150"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kroky */}
          <div className="order-1 md:order-2">
            <span className="text-sm font-bold uppercase tracking-wider text-accent">Ako to funguje</span>
            <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
              Tri jednoduché kroky. <span className="text-gradient">Scrolluj a sleduj.</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Posúvaj stránku a sleduj, ako sa tableta postupne rozpúšťa vo vode.
            </p>

            <div className="mt-8 space-y-3">
              {STEPS.map((step, i) => {
                const active = i === activeStep;
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className={`flex gap-4 rounded-2xl border p-4 transition-all duration-300 ${
                      active
                        ? "border-accent/40 bg-white shadow-card scale-[1.02]"
                        : "border-transparent bg-muted/40 opacity-60"
                    }`}
                  >
                    <div
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${
                        active ? "bg-water-gradient text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
