import { Star, Plus, Leaf, ShieldCheck } from "lucide-react";
import { type Product, getCategory, productFullName } from "@/lib/droply-data";
import { useCart } from "./cart-context";

function discountPct(p: Product) {
  return Math.round((1 - p.price / p.compareAt) * 100);
}

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const category = getCategory(product.categoryId);
  const low = product.stock <= 15;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hover">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={productFullName(product)}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
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

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">{category.name}</span>
        <div className="mt-0.5 flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-bold leading-tight">{product.scent}</h3>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-sunny text-sunny" />
            {product.rating.toLocaleString("sk-SK", { minimumFractionDigits: 1 })}
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-eco/10 px-2 py-0.5 text-[11px] font-medium text-eco">
            <Leaf className="h-3 w-3" /> nahradí {product.replacesBottles} fliaš
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            <ShieldCheck className="h-3 w-3" /> EÚ
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-xl font-extrabold">
                {product.price.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
              </span>
              <span className="text-xs text-muted-foreground line-through">
                {product.compareAt.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">balenie 10 tabliet</span>
          </div>
          <button
            onClick={() => add({ id: product.id, name: productFullName(product), price: product.price, meta: product.scent })}
            className="btn-sheen inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            aria-label={`Pridať ${productFullName(product)} do košíka`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
