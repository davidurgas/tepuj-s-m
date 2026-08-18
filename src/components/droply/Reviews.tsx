import { Star, BadgeCheck } from "lucide-react";
import { reviews } from "@/lib/droply-data";
import Reveal from "./Reveal";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Reviews() {
  return (
    <section id="recenzie" className="relative py-20 sm:py-28">
      <div className="container-tight">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Recenzie</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            Domácnosti, ktoré prešli na <span className="font-accent text-primary">Droply</span>
          </h2>
          <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-card">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-sunny text-sunny" />
              ))}
            </div>
            <span className="text-sm font-semibold">4,9 z 5</span>
            <span className="text-sm text-muted-foreground">· 2 300+ overených recenzií</span>
          </div>
        </Reveal>

        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 80} className="mb-6 break-inside-avoid">
              <figure className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="mb-3 flex">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${j < r.rating ? "fill-sunny text-sunny" : "text-muted"}`}
                    />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground/90">„{r.text}“</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-water-gradient text-sm font-bold text-white">
                    {initials(r.name)}
                  </span>
                  <span>
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      {r.name}
                      {r.verified && <BadgeCheck className="h-4 w-4 text-accent" />}
                    </span>
                    <span className="text-xs text-muted-foreground">{r.city}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
