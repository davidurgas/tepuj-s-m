import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { DISSOLVE_VIDEO, HERO_IMAGE, products } from "@/lib/droply-data";

type Slide = {
  kind: "video" | "image";
  media: string;
  poster?: string;
  kicker: string;
  title: React.ReactNode;
  text: string;
  ctas: { label: string; href: string; primary?: boolean }[];
  /** intenzita tmavého prekrytia pre čitateľnosť */
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
    ctas: [
      { label: "Objaviť produkty", href: "#produkty", primary: true },
      { label: "Ako to funguje", href: "#ako" },
    ],
    overlay: "bg-gradient-to-t from-secondary via-secondary/45 to-secondary/65",
  },
  {
    kind: "image",
    media: HERO_IMAGE,
    kicker: "Uvádzacia ponuka",
    title: (
      <>
        Prvá objednávka
        <br />
        so zľavou <span className="text-accent-glow">−35 %</span>
      </>
    ),
    text: "Vyskúšaj Droply za zlomok ceny. Doprava zdarma nad 25 € a 30 dní na vrátenie.",
    ctas: [{ label: "Chcem zľavu", href: "#cennik", primary: true }],
    overlay: "bg-gradient-to-r from-secondary/95 via-secondary/70 to-secondary/30",
  },
  {
    kind: "image",
    media: products[0].image,
    kicker: "Bestseller",
    title: (
      <>
        Univerzál —<br />
        na <span className="text-accent-glow">všetko</span> v dome
      </>
    ),
    text: "Jedna tableta nahradí plnú fľašu čističa. Sviežа bavlna, hodnotenie 4,9 z 5.",
    ctas: [{ label: "Kúpiť Univerzál", href: "#produkty", primary: true }],
    overlay: "bg-gradient-to-r from-secondary/95 via-secondary/65 to-secondary/25",
  },
  {
    kind: "image",
    media: products[4].image,
    kicker: "Ekológia",
    title: (
      <>
        Menej plastu.
        <br />
        <span className="text-accent-glow">Viac čistoty.</span>
      </>
    ),
    text: "Jedna domácnosť ušetrí s Droply desiatky plastových fliaš ročne. Malá tableta, veľký rozdiel.",
    ctas: [
      { label: "Prečo Droply", href: "#vyhody", primary: true },
      { label: "Spočítať úsporu", href: "#vyhody" },
    ],
    overlay: "bg-gradient-to-r from-secondary/95 via-secondary/65 to-secondary/25",
  },
];

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>();

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);
  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // sledovanie aktívneho slajdu
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // autoplay s pauzou pri interakcii
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
              {/* pozadie */}
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
                <img src={s.media} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )}

              <div className={`absolute inset-0 ${s.overlay ?? "bg-secondary/60"}`} />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/70 via-transparent to-transparent" />

              {/* obsah */}
              <div className="relative z-10 flex h-full items-center">
                <div className="container-tight">
                  <div className="max-w-2xl">
                    <span className="kicker !text-white/70 before:!bg-accent">{s.kicker}</span>
                    <h1 className="mt-5 font-display text-[12.5vw] font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                      {s.title}
                    </h1>
                    <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">{s.text}</p>
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

      {/* šípky */}
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

      {/* bodky */}
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
