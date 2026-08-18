import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { DISSOLVE_VIDEO } from "@/lib/droply-data";

/**
 * Hero s reálnym videom rozpúšťania tablety v čistiacej fľaši.
 * Video sa prehráva plynulo v slučke (žiadne scrubovanie = žiadne sekanie),
 * s jemným parallaxom na scroll pre hĺbku.
 */
export default function HeroDissolve() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          setOffset(Math.max(-1, Math.min(1, -rect.top / window.innerHeight)));
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="top" ref={wrapRef} className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-secondary">
      {/* Reálne video – plynulá slučka */}
      <video
        className="absolute inset-0 h-[118%] w-full object-cover"
        style={{ transform: `translateY(${offset * 8}%) scale(1.05)` }}
        src={DISSOLVE_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // @ts-expect-error iOS atribút
        webkit-playsinline="true"
      />

      {/* Editorial prekrytie */}
      <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/45 to-secondary/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/10 to-transparent" />

      {/* Obsah */}
      <div className="relative z-10 flex h-full flex-col">
        {/* horný label riadok */}
        <div className="container-tight flex items-center justify-between pt-24 text-white/70">
          <span className="kicker !text-white/70 before:!bg-accent">01 — Šumivé čistiace tablety</span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-white/50 sm:block">
            Rozpustné vo vode · Bez plastu navyše
          </span>
        </div>

        {/* stred – headline */}
        <div className="container-tight flex flex-1 flex-col justify-center">
          <h1 className="max-w-4xl font-display text-[13vw] font-bold leading-[0.92] text-white sm:text-7xl lg:text-8xl">
            Vyčistíš celý dom.
            <br />
            <span className="text-white/95">Z jednej </span>
            <span className="font-accent text-accent-glow">tablety.</span>
          </h1>

          <p className="mt-7 max-w-lg text-lg text-white/80">
            Tabletu Droply hodíš do fľaše s vodou, o dve minúty máš plnohodnotný čistiaci prostriedok.
            Žiadne ťahanie litrov z obchodu, žiadne hromady plastu.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#produkty"
              className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-secondary transition-transform hover:scale-[1.03]"
            >
              Objaviť produkty
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#ako"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              Ako to funguje
            </a>
          </div>
        </div>

        {/* dolný pás – dôkazy */}
        <div className="border-t border-white/10">
          <div className="container-tight flex flex-wrap items-center gap-x-10 gap-y-3 py-5 text-sm text-white/75">
            <span className="inline-flex items-center gap-2">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </span>
              <strong className="text-white">4,9/5</strong>
            </span>
            <span className="h-4 w-px bg-white/20" />
            <span>10 000+ domácností</span>
            <span className="h-4 w-px bg-white/20" />
            <span>1 tableta = 1 fľaša čističa</span>
            <span className="h-4 w-px bg-white/20" />
            <span>Doprava zdarma nad 25 €</span>
          </div>
        </div>
      </div>
    </section>
  );
}
