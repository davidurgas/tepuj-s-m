import { useState } from "react";
import { X, Plus, Minus, Check, ShoppingBag } from "lucide-react";
import { products, type Bundle } from "@/lib/droply-data";
import { useCart } from "./cart-context";

/**
 * Modálny konfigurátor balíčka – používateľ si naklikáva, koľko ktorých
 * tabliet chce, dokopy presne toľko, koľko balíček obsahuje.
 */
export default function BundleBuilder({ bundle, onClose }: { bundle: Bundle; onClose: () => void }) {
  const { add } = useCart();
  const [counts, setCounts] = useState<Record<string, number>>({});

  const total = Object.values(counts).reduce((s, n) => s + n, 0);
  const remaining = bundle.tablets - total;
  const complete = total === bundle.tablets;

  const step = (id: string, delta: number) => {
    setCounts((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      if (delta > 0 && total >= bundle.tablets) return prev; // nepovoliť viac než limit
      return { ...prev, [id]: next };
    });
  };

  const addToCart = () => {
    const mix = products
      .filter((p) => counts[p.id])
      .map((p) => `${p.name} ×${counts[p.id]}`)
      .join(", ");
    add({
      id: `bundle-${bundle.id}-${Date.now()}`,
      name: `Balíček ${bundle.name}`,
      price: bundle.price,
      meta: mix || `${bundle.tablets} tabliet`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-background shadow-hover sm:rounded-3xl">
        {/* hlavička */}
        <div className="flex items-start justify-between border-b border-border p-5">
          <div>
            <h3 className="font-display text-xl font-bold">Balíček {bundle.name}</h3>
            <p className="text-sm text-muted-foreground">
              Vyskladaj si {bundle.tablets} tabliet podľa seba
            </p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Zavrieť">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* počítadlo */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-3">
          <span className="text-sm font-medium">
            Vybraných <strong className="text-primary">{total}</strong> z {bundle.tablets}
          </span>
          <span className={`text-sm font-semibold ${complete ? "text-eco" : "text-muted-foreground"}`}>
            {complete ? "Hotovo ✓" : `Zostáva ${remaining}`}
          </span>
        </div>

        {/* zoznam produktov */}
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {products.map((p) => {
            const c = counts[p.id] ?? 0;
            return (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <img src={p.image} alt={p.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.scent}</p>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-border">
                  <button
                    onClick={() => step(p.id, -1)}
                    disabled={c === 0}
                    className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted disabled:opacity-30"
                    aria-label="Menej"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-7 text-center text-sm font-bold tabular-nums">{c}</span>
                  <button
                    onClick={() => step(p.id, 1)}
                    disabled={remaining <= 0}
                    className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted disabled:opacity-30"
                    aria-label="Viac"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* pätka */}
        <div className="border-t border-border p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cena balíčka</span>
            <span className="font-display text-xl font-extrabold">
              {bundle.price.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
            </span>
          </div>
          <button
            onClick={addToCart}
            disabled={!complete}
            className="btn-sheen flex w-full items-center justify-center gap-2 rounded-full bg-water-gradient py-3.5 font-semibold text-white shadow-glow transition-transform enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {complete ? <ShoppingBag className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            {complete ? "Pridať do košíka" : `Rozdeľ ešte ${remaining} tabliet`}
          </button>
        </div>
      </div>
    </div>
  );
}
