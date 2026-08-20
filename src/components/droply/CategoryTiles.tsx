import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { categories, productsByCategory } from "@/lib/droply-data";
import Reveal from "./Reveal";

export default function CategoryTiles() {
  return (
    <section id="produkty" className="relative py-20 sm:py-24">
      <div className="container-tight">
        <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="kicker">Sortiment</span>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-tight sm:text-5xl">
              Nakupuj podľa <span className="font-accent">kategórie</span>
            </h2>
          </div>
          <Link to="/produkty" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            Zobraziť všetky produkty <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 80}>
              <Link
                to={`/produkty#${c.id}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-border shadow-card"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-xs text-white/70">{productsByCategory(c.id).length} vôní</p>
                  <h3 className="font-display text-lg font-bold leading-tight sm:text-xl">{c.name}</h3>
                </div>
                <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
