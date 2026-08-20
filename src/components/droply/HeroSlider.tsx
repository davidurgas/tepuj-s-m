import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Check, Star, Leaf, Percent } from "lucide-react";
import { DISSOLVE_VIDEO, HERO_IMAGE, BANNER_SALE, BANNER_BEST, BANNER_ECO } from "@/lib/droply-data";

type Badge = { label: string; tone: "sale" | "star" | "eco" };

type Slide = {
  kind: "video" | "image";
  media: string;
  poster?: string;
  kicker?: string;
  badge?: Badge;
  title: React.ReactNode;
  text: string;
  note?: string;
  ctas: { label: string; href: string; primary?: boolean }[];
  overlay?: string;
};

const SLIDES: Slide[] = [
  {
    kind: "video",
    media: DISSOLVE_VIDEO,
    poster: HERO_IMAGE,
    kicker: "Šumivé čistiace tablety",
    title: (
      <>
        Vyčistíš celý dom.
        <br />
        Z jednej <span className="text-accent-glow">tablety.</span>
      </>
    ),
    text: "Hodíš do fľaše s vodou a o dve minúty máš plnohodnotný čistiaci prostriedok. Bez plastu navyše.",
    note: "4,9/5 · 10 000+ spokojných domácností",
    ctas: [
      { label: "Objaviť produkty", href: "#produkty", primary: true },
      { label: "Ako to funguje", href: "#ako" },
    ],
    overlay: "bg-gradient-to-t from-secondary via-secondary/45 to-secondary/65",
  },
  {
    kind: "image",
    media: BANNER_SALE,
    badge: { label: "Akcia · −35 %", tone: "sale" },
    title: (
      <>
        Prvá objednávka
        <br />
        lacnejšie o <span className="text-accent-glow">tretinu</span>
      </>
    ),
    text: "Vyskúšaj Droply za zlomok ceny. Zľava −35 % sa pridá automaticky pri prvom nákupe.",
    note: "Doprava zdarma nad 25 € · 30 dní na vrátenie",
    ctas: [
      { label: "Chcem zľavu", href: "#cennik", primary: true },
      { label: "Pozrieť produkty", href: "#produkty" },
    ],
    overlay: "bg-gradient-to-r from-secondary/90 via-secondary/45 to-transparent",
  },
  {
    kind: "image",
    media: BANNER_BEST,
    badge: { label: "Bestseller", tone: "star" },
    title: (
      <>
        Univerzál —<br />
        poradí si so <span className="text-accent-glow">všetkým</span>
      </>
    ),
    text: "Jedna tableta nahradí plnú fľašu čističa. Náš najpredávanejší produkt.",
    note: "Hodnotenie 4,9/5 · 1 243 recenzií",
    ctas: [
      { label: "Kúpiť Univerzál", href: "#produkty", primary: true },
      { label: "Celá ponuka", href: "#produkty" },
    ],
    overlay: "bg-gradient-to-r from-secondary/90 via-secondary/45 to-transparent",
  },
  {
    kind: "image",
    media: BANNER_ECO,
    badge: { label: "Eko voľba", tone: "eco" },
    title: (
      <>
        Menej plastu.
        <br />
        <span className="text-accent-glow">Viac čistoty.</span>
      </>
    ),
    text: "Jedna domácnosť ušetrí s Droply desiatky plastových fliaš ročne. Malá tableta, veľký rozdiel.",
    note: "100 % recyklovateľné obaly · vyrobené v EU",
    ctas: [
      { label: "Spočítať úsporu", href: "#vyhody", primary: true },
      { label: "Prečo Droply", href: "#vyhody" },
    ],
    overlay: "bg-gradient-to-r from-secondary/90 via-secondary/45 to-transparent",
  },
];

const BADGE_STYLE: Record<Badge["tone"], string> = {
  sale: "bg-sunny text-sunny-foreground",
  star: "bg-white text-secondary",
  eco: "bg-eco text-white",
};

function BadgePill({ badge }: { badge: Badge }) {
  const Icon = badge.tone === "sale" ? Percent : badge.tone === "eco" ? Leaf : Star;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide shadow-card ${BADGE_STYLE[badge.tone]}`}
    >
      <Icon className={`h-3.5 w-3.5 ${badge.tone === "star" ? "fill-sunny text-sunny" : ""}`} />
      {badge.label}
    </span>
  );
}

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>();

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);
  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const stop = useCallback(() => timer.current && clearInterval(timer.current), []);
  const play = useCallback(() => {
    stop();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => emblaApi?.scrollNext(), 6000);
  }, [emblaApi, stop]);

  useEffect(() => {
    if (!emblaApi) return;
    play();
    emblaApi.on("pointerDown", stop);
    emblaApi.on("pointerUp", play);
    return () => {
      stop();
      emblaApi.off("pointerDown", stop);
      emblaApi.off("pointerUp", play);
    };
  }, [emblaApi, play, stop]);

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-secondary"
      onMouseEnter={stop}
      onMouseLeave={play}
    >
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {SLIDES.map((s, i) => (
            <div key={i} className="relative h-full min-w-0 flex-[0_0_100%]">
              {s.kind === "video" ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={s.media}
                  poster={s.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  // @ts-expect-error iOS
                  webkit-playsinline="true"
                />
              ) : (
                <img
                  src={s.media}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-[72%_center] sm:object-center"
                />
              )}

              {/* Prekrytie: mobil tmavší dole (fotka hore vidieť), desktop gradient zľava */}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/55 to-secondary/25 sm:hidden" />
              <div className="absolute inset-0 hidden bg-gradient-to-r from-secondary/90 via-secondary/40 to-transparent sm:block" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-secondary/50 to-transparent" />

              <div className="relative z-10 flex h-full items-end pb-28 sm:items-center sm:pb-0">
                <div className="container-tight">
                  <div className="max-w-2xl">
                    {s.badge ? <BadgePill badge={s.badge} /> : <span className="kicker !text-white/70 before:!bg-accent">{s.kicker}</span>}
                    <h1 className="mt-5 font-display text-[12vw] font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                      {s.title}
                    </h1>
                    <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85">{s.text}</p>
                    {s.note && (
                      <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white/70">
                        <Check className="h-4 w-4 text-eco" /> {s.note}
                      </p>
                    )}
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      {s.ctas.map((c) => (
                        <a
                          key={c.label}
                          href={c.href}
                          className={
                            c.primary
                              ? "btn-sheen group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-secondary transition-transform hover:scale-[1.03]"
                              : "inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                          }
                        >
                          {c.label}
                          {c.primary && (
                            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-secondary/30 p-3 text-white backdrop-blur transition-colors hover:bg-secondary/60 sm:grid"
        aria-label="Predchádzajúci"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-secondary/30 p-3 text-white backdrop-blur transition-colors hover:bg-secondary/60 sm:grid"
        aria-label="Ďalší"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Slajd ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === selected ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
