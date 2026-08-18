import { useEffect, useRef, useState } from "react";
import { Star, Leaf, ShieldCheck, Droplets, ArrowRight, ChevronDown, Check } from "lucide-react";
import { DISSOLVE_VIDEO } from "@/lib/droply-data";

const STEPS = [
  { title: "Naplň fľašu vodou", text: "Obyčajná voda z vodovodu do dávkovacej fľaše." },
  { title: "Vhoď tabletu Droply", text: "Tableta začne šumieť a rozpúšťať sa vo vode." },
  { title: "Hotovo — môžeš čistiť", text: "O dve minúty máš plnohodnotný čistiaci prostriedok." },
];

export default function HeroDissolve() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const durationRef = useRef(0);
  const unlockedRef = useRef(false);
  const [progress, setProgress] = useState(0);

  // odomknutie prehrávania na mobile (iOS vyžaduje interakciu na seek)
  const unlock = () => {
    const v = videoRef.current;
    if (!v || unlockedRef.current) return;
    unlockedRef.current = true;
    v.play().then(() => v.pause()).catch(() => {});
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => (durationRef.current = v.duration || 5);
    v.addEventListener("loadedmetadata", onMeta);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      v.loop = true;
      v.play().catch(() => {});
      return () => v.removeEventListener("loadedmetadata", onMeta);
    }

    let ticking = false;
    const compute = () => {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
        setProgress(p);
        const dur = durationRef.current || v.duration || 5;
        if (dur) {
          const t = Math.min(p * dur, dur - 0.05);
          if (Math.abs((v.currentTime || 0) - t) > 0.03) {
            try {
              v.currentTime = t;
            } catch {
              /* seek not ready */
            }
          }
        }
      }
      ticking = false;
    };
    const onScroll = () => {
      unlock();
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("touchstart", unlock, { passive: true });
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("touchstart", unlock);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  const heroOpacity = progress < 0.26 ? 1 : Math.max(0, 1 - (progress - 0.26) / 0.16);
  const stepsOpacity = progress < 0.2 ? 0 : Math.min(1, (progress - 0.2) / 0.14);
  const activeStep = progress < 0.42 ? 0 : progress < 0.74 ? 1 : 2;

  return (
    <section id="top" ref={sectionRef} className="relative" style={{ height: "260vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Reálne video – rozpúšťanie tablety vo vode */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={DISSOLVE_VIDEO}
          muted
          playsInline
          preload="auto"
          // @ts-expect-error – webkit atribút pre iOS
          webkit-playsinline="true"
        />

        {/* Prekrytie pre čitateľnosť */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/85 via-secondary/45 to-secondary/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/70 via-transparent to-transparent" />

        {/* Obsah hero */}
        <div
          className="absolute inset-0 flex flex-col justify-center px-5 text-white sm:px-10"
          style={{ opacity: heroOpacity, transition: "opacity 0.15s linear" }}
        >
          <div className="container-tight">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <Leaf className="h-4 w-4 text-eco" />
              Ekologické čistenie novej generácie
            </span>

            <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
              Čistá domácnosť.
              <br />
              <span className="bg-gradient-to-r from-accent via-accent-glow to-eco bg-clip-text text-transparent">
                Bez zbytočného plastu.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-lg text-white/85">
              Šumivú tabletu <strong className="text-white">Droply</strong> hodíš do vody a o dve minúty máš
              plnohodnotný čistiaci prostriedok. Žiadne ťahanie litrov z obchodu.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#produkty"
                className="btn-sheen inline-flex items-center gap-2 rounded-full bg-water-gradient px-7 py-4 text-base font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
              >
                Vyskúšať Droply
                <ArrowRight className="h-5 w-5" />
              </a>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-sunny text-sunny" />
                  ))}
                </div>
                <span className="text-sm text-white/85">
                  <strong className="text-white">4,9/5</strong> · 2 300+ recenzií
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-eco" /> 30 dní na vrátenie
              </span>
              <span className="inline-flex items-center gap-2">
                <Droplets className="h-4 w-4 text-accent" /> Vyrobené v EU
              </span>
            </div>

            <div className="mt-10 inline-flex items-center gap-2 text-sm text-white/70">
              <ChevronDown className="h-4 w-4 animate-bounce" />
              Scrolluj a sleduj, ako sa tableta rozpúšťa vo vode
            </div>
          </div>
        </div>

        {/* Kroky „Ako to funguje“ – objavia sa počas scrollovania (na pozadí videa) */}
        <div
          className="absolute inset-x-0 bottom-0 px-5 pb-10 text-white sm:px-10"
          style={{ opacity: stepsOpacity, transition: "opacity 0.2s linear", pointerEvents: "none" }}
        >
          <div className="container-tight">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Ako to funguje</span>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {STEPS.map((step, i) => {
                const active = i === activeStep;
                const done = i < activeStep;
                return (
                  <div
                    key={step.title}
                    className={`rounded-2xl border p-4 backdrop-blur transition-all duration-300 ${
                      active
                        ? "border-accent/60 bg-white/15 shadow-glow"
                        : "border-white/15 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${
                          active ? "bg-water-gradient text-white" : done ? "bg-eco text-white" : "bg-white/20 text-white/80"
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" /> : i + 1}
                      </span>
                      <h3 className="font-display text-base font-bold">{step.title}</h3>
                    </div>
                    <p className={`mt-2 text-sm ${active ? "text-white/90" : "text-white/60"}`}>{step.text}</p>
                  </div>
                );
              })}
            </div>

            {/* progres rozpúšťania */}
            <div className="mt-4 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-water-gradient" style={{ width: `${progress * 100}%` }} />
              </div>
              <span className="w-12 text-right text-xs font-semibold tabular-nums text-white/80">
                {Math.round(progress * 100)} %
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
