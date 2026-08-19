import { useRef, useState } from "react";
import { Droplets, Sparkles, Wand2, Play } from "lucide-react";
import { DISSOLVE_VIDEO, HERO_IMAGE } from "@/lib/droply-data";
import Reveal from "./Reveal";

const STEPS = [
  {
    icon: Droplets,
    title: "Naplň fľašu vodou",
    text: "Do dávkovacej fľaše natočíš obyčajnú vodu z vodovodu. Žiadne nosenie litrov z obchodu.",
  },
  {
    icon: Sparkles,
    title: "Vhoď tabletu Droply",
    text: "Tableta začne šumieť a rozpúšťať sa. Koncentrát sa uvoľní a rovnomerne rozmieša vo vode.",
  },
  {
    icon: Wand2,
    title: "Čisti ako zvyčajne",
    text: "O dve minúty máš plnohodnotný čistiaci prostriedok. Rovnaký výkon, zlomkový dopad na planétu.",
  },
];

function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => {});
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-secondary shadow-hover">
      <video
        ref={videoRef}
        className="aspect-[4/5] w-full object-cover sm:aspect-square"
        src={DISSOLVE_VIDEO}
        poster={HERO_IMAGE}
        playsInline
        loop
        muted
        controls={playing}
        preload="metadata"
      />
      {!playing && (
        <button
          onClick={play}
          className="absolute inset-0 flex items-center justify-center bg-secondary/25 transition-colors hover:bg-secondary/10"
          aria-label="Prehrať video"
        >
          <span className="grid h-20 w-20 place-items-center rounded-full bg-white/90 text-primary shadow-hover transition-transform group-hover:scale-110">
            <Play className="ml-1 h-8 w-8 fill-primary" />
          </span>
          <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-secondary">
            Pozri, ako sa tableta rozpúšťa
          </span>
        </button>
      )}
    </div>
  );
}

export default function AkoFunguje() {
  return (
    <section id="ako" className="relative py-20 sm:py-28">
      <div className="container-tight">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="kicker justify-center">Ako to funguje</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-5xl">
            Tri kroky k <span className="font-accent">čistej</span> domácnosti
          </h2>
        </Reveal>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <VideoShowcase />
          </Reveal>

          <div className="flex flex-col gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal
                  key={step.title}
                  delay={i * 100}
                  className="group flex items-start gap-5 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-water-gradient text-white shadow-card transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
