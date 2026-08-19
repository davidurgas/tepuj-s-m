import { useEffect, useRef } from "react";
import { Droplets, Sparkles, Wand2 } from "lucide-react";
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

/** Video rozpúšťania – autoplay, votkané do pozadia mäkkými okrajmi (bez rámika). */
function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  // mäkké okraje – video splýva s pozadím, nevidno ohraničenie
  const feather = "radial-gradient(115% 115% at 50% 45%, #000 55%, transparent 100%)";

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-6 rounded-full bg-water-gradient opacity-25 blur-3xl" />
      <video
        ref={videoRef}
        className="relative mx-auto aspect-square w-full max-w-lg object-cover"
        style={{ maskImage: feather, WebkitMaskImage: feather }}
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
