import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

/** lineárna interpolácia medzi dvoma RGB farbami */
function lerpColor(a: number[], b: number[], t: number) {
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

const BG_START = [232, 245, 255]; // svetlá voda
const BG_END = [10, 38, 71]; // sfarbený čistiaci prostriedok
const TXT_START = [12, 27, 43];
const TXT_END = [255, 255, 255];

/**
 * Hero na úvodnej stránke: na pozadí veľká tableta, ktorá sa pri scrollovaní
 * postupne rozpúšťa (zmenšuje + mizne + bublinky), a pozadie sa mení zo
 * svetlej vody na modrý čistiaci prostriedok. Plynulé (len CSS transformy).
 */
export default function DissolveHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [p, setP] = useState(0);

  const bubbles = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        key: i,
        left: 20 + Math.random() * 60,
        size: 5 + Math.random() * 16,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 3,
      })),
    [],
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ticking = false;
    const compute = () => {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const prog = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
        setP(reduce ? 0.5 : prog);
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };
    compute();
    if (reduce) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const bg = lerpColor(BG_START, BG_END, p);
  const txt = lerpColor(TXT_START, TXT_END, p);
  const tabletScale = 1 - p * 0.82;
  const tabletOpacity = p > 0.8 ? Math.max(0, (1 - p) / 0.2) : 1;
  const fizz = p < 0.06 ? 0 : p > 0.9 ? Math.max(0, (1 - p) / 0.1) : 1;
  const cloud = p; // sfarbenie okolo tablety

  return (
    <section id="top" ref={sectionRef} className="relative" style={{ height: "220vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden" style={{ background: bg, transition: "background 0.1s linear" }}>
        {/* rozpúšťajúci sa oblak farby */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            width: `${40 + p * 60}vmin`,
            height: `${40 + p * 60}vmin`,
            background: "radial-gradient(circle, rgba(34,180,220,0.55), rgba(14,120,200,0) 70%)",
            opacity: cloud * 0.9,
          }}
        />

        {/* tableta */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{
            width: "46vmin",
            height: "46vmin",
            transform: `translate(-50%, calc(-50% - ${p * 6}vmin)) scale(${tabletScale})`,
            opacity: tabletOpacity,
          }}
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background: "radial-gradient(circle at 38% 32%, #ffffff, #eef5fc 55%, #d9e9f6 100%)",
              boxShadow: "inset 0 -10px 30px rgba(6,60,120,0.18), inset 0 8px 20px rgba(255,255,255,0.7), 0 30px 70px rgba(6,40,90,0.25)",
            }}
          />
          {/* drážka tablety */}
          <div className="absolute left-1/2 top-1/2 h-[3px] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bcd8ee]" />
        </div>

        {/* bublinky */}
        <div className="pointer-events-none absolute inset-0" style={{ opacity: fizz }}>
          {bubbles.map((b) => (
            <span
              key={b.key}
              className="absolute bottom-[35%] rounded-full bg-white/70"
              style={{
                left: `${b.left}%`,
                width: b.size,
                height: b.size,
                boxShadow: "0 0 6px rgba(255,255,255,0.6)",
                animation: `rise ${b.duration}s linear ${b.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* obsah */}
        <div className="container-tight relative z-10 text-center" style={{ color: txt }}>
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: lerpColor([14, 165, 233], [125, 211, 252], p) }}
          >
            Šumivé čistiace tablety
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-[12vw] font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Z tablety čistý domov.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg" style={{ opacity: 0.85 }}>
            Scrolluj a sleduj, ako sa tableta rozpustí a voda sa zmení na plnohodnotný čistiaci prostriedok.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#produkty"
              className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-hover transition-transform hover:scale-[1.03]"
            >
              Objaviť produkty
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* nápoveda scrollovania */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-sm"
          style={{ color: txt, opacity: (1 - p * 3) }}
        >
          <ChevronDown className="mx-auto h-5 w-5 animate-bounce" />
          Scrolluj
        </div>
      </div>
    </section>
  );
}
