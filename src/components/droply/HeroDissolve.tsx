import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Star, Leaf, Boxes, Truck } from "lucide-react";
import Bubbles from "./Bubbles";
import { products } from "@/lib/droply-data";

/**
 * Hero bez videa (spoľahlivé na každom zariadení vrátane iOS Low Power Mode).
 * Reálna fotka produktu + plynulé CSS efekty: aurora gradient, plávanie,
 * stúpajúce bublinky a jemný parallax na scroll.
 */
export default function HeroDissolve() {
  const heroImg = products[0].image;
  const ref = useRef<HTMLDivElement | null>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setY(window.scrollY);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="top" ref={ref} className="grain relative overflow-hidden bg-background">
      {/* animované aurora pozadie */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="aurora" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      <Bubbles count={12} color="14 165 233" />

      <div className="container-tight relative z-10 grid min-h-[calc(100svh-72px)] items-center gap-10 py-14 md:grid-cols-2 md:py-20">
        {/* Text */}
        <div className="reveal is-visible">
          <span className="kicker">Šumivé čistiace tablety</span>

          <h1 className="mt-5 font-display text-[13.5vw] font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Vyčistíš celý dom.
            <br />
            Z jednej <span className="font-accent">tablety.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Tabletu Droply hodíš do fľaše s vodou a o dve minúty máš plnohodnotný čistiaci prostriedok.
            Žiadne ťahanie litrov z obchodu, žiadne hromady plastu.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#produkty"
              className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-hover transition-transform hover:scale-[1.03]"
            >
              Objaviť produkty
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#ako"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-4 text-base font-semibold text-foreground backdrop-blur transition-colors hover:bg-card"
            >
              Ako to funguje
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-sunny text-sunny" />
                ))}
              </span>
              <strong className="text-foreground">4,9/5</strong> · 2 300+ recenzií
            </span>
          </div>
        </div>

        {/* Vizuál – reálna fotka + plávajúce prvky */}
        <div className="relative">
          <div
            className="relative mx-auto max-w-md"
            style={{ transform: `translateY(${y * -0.04}px)` }}
          >
            {/* žiara za fotkou */}
            <div className="absolute inset-6 rounded-[2rem] bg-water-gradient opacity-40 blur-3xl" />

            <div className="animate-float-slow relative overflow-hidden rounded-[2rem] border border-white/60 bg-card shadow-hover">
              <img
                src={heroImg}
                alt="Droply šumivé čistiace tablety s čistiacou fľašou"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/25 to-transparent" />
            </div>

            {/* plávajúce chipy */}
            <Chip className="-left-4 top-8" icon={<Leaf className="h-4 w-4 text-eco" />} sub="−1 plastová fľaša" />
            <Chip
              className="-right-3 top-1/3 [animation-delay:1.1s]"
              icon={<Boxes className="h-4 w-4 text-primary" />}
              sub="10× menej miesta"
            />
            <Chip
              className="bottom-10 -left-3 [animation-delay:0.6s]"
              icon={<Truck className="h-4 w-4 text-accent" />}
              sub="Doprava zdarma"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({ icon, sub, className = "" }: { icon: React.ReactNode; sub: string; className?: string }) {
  return (
    <div
      className={`animate-float-slow absolute flex items-center gap-2 rounded-2xl border border-border bg-card/90 px-3.5 py-2.5 text-sm font-semibold shadow-card backdrop-blur ${className}`}
    >
      {icon}
      {sub}
    </div>
  );
}
