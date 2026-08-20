import { Sparkles, UtensilsCrossed, PanelTop, ShowerHead, Footprints, Shirt } from "lucide-react";
import { categories, productsByCategory, type IconKey } from "@/lib/droply-data";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

const ICONS: Record<IconKey, typeof Sparkles> = {
  universal: Sparkles,
  kitchen: UtensilsCrossed,
  glass: PanelTop,
  bathroom: ShowerHead,
  floor: Footprints,
  laundry: Shirt,
};

export default function Catalog() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="container-tight">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Naše produkty</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
            Vyskladaj si <span className="font-accent">domácnosť</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Vyber kategóriu a v nej vôňu či funkciu, ktorá ti sadne. Každé balenie = 10 šumivých tabliet.
          </p>
        </Reveal>

        {/* rýchle prepínače kategórií */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {c.name}
            </a>
          ))}
        </div>

        <div className="mt-14 space-y-16">
          {categories.map((c) => {
            const Icon = ICONS[c.icon];
            const items = productsByCategory(c.id);
            return (
              <div key={c.id} id={c.id} className="scroll-mt-28">
                <Reveal className="mb-6 flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-water-gradient text-white shadow-card">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-bold">{c.name}</h2>
                    <p className="text-sm text-muted-foreground">{c.tagline}</p>
                  </div>
                  <span className="ml-auto hidden text-sm text-muted-foreground sm:block">{items.length} vôní</span>
                </Reveal>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p, i) => (
                    <Reveal key={p.id} delay={(i % 3) * 80}>
                      <ProductCard product={p} />
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
