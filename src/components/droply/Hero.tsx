import { useEffect, useRef, useState } from "react";
import { Star, Leaf, ShieldCheck, Droplets, ArrowRight, PackageOpen } from "lucide-react";
import Bubbles from "./Bubbles";
import DissolveGlass from "./DissolveGlass";

export default function Hero() {
  const [progress, setProgress] = useState(0.1);
  const raf = useRef<number>();

  // pomalá slučka rozpúšťania pre živý hero vizuál
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setProgress(0.6);
      return;
    }
    const period = 7000;
    const start = performance.now();
    const loop = (now: number) => {
      const t = ((now - start) % period) / period; // 0..1
      // 0 -> 1 rozpúšťanie, potom rýchly reset
      const val = t < 0.82 ? t / 0.82 : 1 - (t - 0.82) / 0.18;
      setProgress(val);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden bg-hero-gradient text-white">
      <Bubbles count={16} />
      {/* jemné svetelné škvrny */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />

      <div className="container-tight relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        {/* Ľavá strana – text */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Leaf className="h-4 w-4 text-eco" />
            Ekologické čistenie novej generácie
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            Čistá domácnosť.
            <br />
            <span className="bg-gradient-to-r from-accent via-accent-glow to-eco bg-clip-text text-transparent">
              Bez zbytočného plastu.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-white/80">
            Šumivú tabletu <strong className="text-white">Droply</strong> hodíte do vody a o dve minúty máte
            plnohodnotný čistiaci prostriedok. Žiadne ťahanie litrov z obchodu. Žiadne hromady plastových fliaš.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#produkty"
              className="btn-sheen inline-flex items-center gap-2 rounded-full bg-water-gradient px-7 py-4 text-base font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
            >
              Vyskúšať Droply
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#ako-funguje"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              <PackageOpen className="h-5 w-5" />
              Ako to funguje
            </a>
          </div>

          {/* Social proof + dôvera */}
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-sunny text-sunny" />
                ))}
              </div>
              <span className="text-sm text-white/80">
                <strong className="text-white">4,9/5</strong> · 2 300+ recenzií
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <ShieldCheck className="h-4 w-4 text-eco" /> 30 dní na vrátenie
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Droplets className="h-4 w-4 text-accent" /> Vyrobené v EU
            </div>
          </div>
        </div>

        {/* Pravá strana – pohár */}
        <div className="relative z-10">
          <div className="glass-dark relative mx-auto max-w-sm rounded-3xl p-6 shadow-glow">
            <DissolveGlass progress={progress} />
            {/* plávajúce benefit chipy */}
            <FloatingChip className="-left-4 top-6" icon={<Leaf className="h-4 w-4 text-eco" />}>
              −1 plastová fľaša
            </FloatingChip>
            <FloatingChip className="-right-3 top-24 [animation-delay:1.2s]" icon={<Droplets className="h-4 w-4 text-accent" />}>
              95 % menej vody v preprave
            </FloatingChip>
            <FloatingChip className="-left-3 bottom-8 [animation-delay:0.6s]" icon={<PackageOpen className="h-4 w-4 text-primary-foreground" />}>
              10× menej miesta
            </FloatingChip>
          </div>
        </div>
      </div>

      {/* vlnitý prechod dole */}
      <div className="relative">
        <svg viewBox="0 0 1440 90" className="block h-[60px] w-full" preserveAspectRatio="none">
          <path
            d="M0 60 C 240 90 480 20 720 40 C 960 60 1200 95 1440 55 L1440 90 L0 90 Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}

function FloatingChip({
  children,
  icon,
  className = "",
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-foreground shadow-hover animate-floaty ${className}`}
    >
      {icon}
      {children}
    </div>
  );
}
