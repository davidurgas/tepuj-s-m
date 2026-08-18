import {
  Sparkles,
  UtensilsCrossed,
  PanelTop,
  ShowerHead,
  Footprints,
  Shirt,
  Star,
  Check,
  Plus,
  Leaf,
} from "lucide-react";
import { products, type Product } from "@/lib/droply-data";
import { useCart } from "./cart-context";
import { DroplyMark } from "./Logo";
import Reveal from "./Reveal";

const THEME: Record<Product["theme"], { icon: typeof Sparkles; from: string; to: string }> = {
  universal: { icon: Sparkles, from: "from-sky-400", to: "to-blue-600" },
  kitchen: { icon: UtensilsCrossed, from: "from-lime-400", to: "to-emerald-600" },
  glass: { icon: PanelTop, from: "from-cyan-300", to: "to-sky-500" },
  bathroom: { icon: ShowerHead, from: "from-teal-400", to: "to-cyan-600" },
  floor: { icon: Footprints, from: "from-emerald-400", to: "to-teal-600" },
  laundry: { icon: Shirt, from: "from-violet-400", to: "to-indigo-600" },
};

function discountPct(p: Product) {
  return Math.round((1 - p.price / p.compareAt) * 100);
}

function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const theme = THEME[product.theme];
  const Icon = theme.icon;
  const stockPct = Math.min(100, Math.round((product.stock / 60) * 100));
  const low = product.stock <= 15;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hover">
      {/* vizuál */}
      <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${theme.from} ${theme.to}`}>
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 20%, #fff, transparent 60%)" }} />
        <div className="relative flex flex-col items-center">
          <DroplyMark size={54} className="drop-shadow-lg transition-transform duration-500 group-hover:scale-110" />
          <Icon className="mt-2 h-6 w-6 text-white/90" />
        </div>
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow ${
              low ? "bg-sunny text-sunny-foreground" : "bg-white text-primary"
            }`}
          >
            {product.badge}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-secondary/90 px-2.5 py-1 text-xs font-bold text-white">
          −{discountPct(product)} %
        </span>
      </div>

      {/* obsah */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-bold">{product.name}</h3>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-sunny text-sunny" />
            {product.rating.toLocaleString("sk-SK", { minimumFractionDigits: 1 })}
            <span className="text-muted-foreground/70">({product.reviews})</span>
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-eco/10 px-2.5 py-1 text-xs font-medium text-eco">
            <Leaf className="h-3 w-3" /> nahradí {product.replacesBottles} fliaš
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {product.scent}
          </span>
        </div>

        {/* vzácnosť – stav skladu */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs">
            <span className={low ? "font-semibold text-sunny" : "text-muted-foreground"}>
              {low ? "Skladom posledné kusy!" : "Skladom"}
            </span>
            <span className="text-muted-foreground">{product.stock} ks</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${low ? "bg-sunny" : "bg-water-gradient"}`}
              style={{ width: `${stockPct}%` }}
            />
          </div>
        </div>

        {/* cena + CTA */}
        <div className="mt-5 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold">
                {product.price.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {product.compareAt.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
              </span>
            </div>
            <span className="text-xs text-muted-foreground">balenie 10 tabliet</span>
          </div>
          <button
            onClick={() =>
              add({ id: product.id, name: `Droply ${product.name}`, price: product.price, meta: product.scent })
            }
            className="btn-sheen inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Do košíka
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Products() {
  return (
    <section id="produkty" className="relative py-20 sm:py-28">
      <div className="container-tight">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-accent">Sortiment</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Jedna tableta pre každú <span className="text-gradient">miestnosť</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Vyskladaj si vlastnú sadu. Každé balenie obsahuje 10 šumivých tabliet a vydrží mesiace.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-eco" />
          Doprava zdarma nad 25 € · 30 dní na vrátenie · odoslanie do 24 h
        </div>
      </div>
    </section>
  );
}
