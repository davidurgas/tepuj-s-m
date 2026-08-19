import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Star, ShieldCheck, Leaf } from "lucide-react";
import { DISSOLVE_VIDEO, HERO_IMAGE } from "@/lib/droply-data";

/**
 * Hero s reálnym videom rozpúšťania tablety na POZADÍ (full-bleed, bez rámika).
 * Autoplay + plynulá slučka (žiadne scrubovanie = žiadne sekanie). Ak by mal
 * návštevník iOS Low Power Mode, zobrazí sa aspoň reálny poster (nie čierna).
 */
export default function HeroDissolve() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    // pokus o spustenie + spomalenie pre pokojnejšiu slučku
    if (videoRef.current) videoRef.current.playbackRate = 0.7;
    videoRef.current?.play().catch(() => {});
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
    <section id="top" className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-secondary">
      {/* Video pozadie – cez celú plochu, bez viditeľného ohraničenia */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: `scale(1.06) translateY(${y * 0.03}px)` }}
        src={DISSOLVE_VIDEO}
        poster={HERO_IMAGE}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // @ts-expect-error iOS atribút
        webkit-playsinline="true"
      />

      {/* Prekrytie pre čitateľnosť textu */}
      <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/45 to-secondary/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/85 via-secondary/20 to-transparent" />

      {/* Obsah */}
      <div className="relative z-10 flex h-full flex-col">
        <div className="container-tight flex flex-1 flex-col justify-center pt-24">
          <span className="kicker !text-white/70 before:!bg-accent">Šumivé čistiace tablety</span>

          <h1 className="mt-5 max-w-3xl font-display text-[13.5vw] font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Vyčistíš celý dom.
            <br />
            Z jednej <span className="text-accent-glow">tablety.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">
            Tabletu Droply hodíš do fľaše s vodou a o dve minúty máš plnohodnotný čistiaci prostriedok.
            Žiadne ťahanie litrov z obchodu, žiadne hromady plastu.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
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

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">
            <span className="inline-flex items-center gap-2">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-sunny text-sunny" />
                ))}
              </span>
              <strong className="text-white">4,9/5</strong> · 2 300+ recenzií
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-eco" /> 30 dní na vrátenie
            </span>
            <span className="inline-flex items-center gap-2">
              <Leaf className="h-4 w-4 text-eco" /> Vyrobené v EU
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
