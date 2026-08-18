import { X, Plus, Minus, Trash2, ShoppingBag, Truck, Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { useCart, FREE_SHIPPING_THRESHOLD } from "./cart-context";

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, remove, total, count, clear } = useCart();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const shippingPct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  const checkout = () => {
    toast.success("Toto je demo 🙂 Platobná brána zatiaľ nie je aktívna.", {
      description: "V ostrej verzii by teraz nasledovala pokladňa a platba.",
    });
    clear();
    closeCart();
  };

  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-secondary/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* panel */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-background shadow-hover transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Nákupný košík"
      >
        <header className="flex items-center justify-between border-b border-border p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Košík {count > 0 && <span className="text-muted-foreground">({count})</span>}
          </h2>
          <button onClick={closeCart} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Zavrieť">
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-display text-lg font-semibold">Košík je zatiaľ prázdny</p>
            <p className="text-sm text-muted-foreground">Pridaj si tablety alebo výhodný balíček.</p>
            <button
              onClick={closeCart}
              className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Prezrieť produkty
            </button>
          </div>
        ) : (
          <>
            {/* free shipping progress */}
            <div className="border-b border-border bg-muted/40 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-accent" />
                {remaining > 0 ? (
                  <span>
                    Do <strong>dopravy zdarma</strong> ti chýba{" "}
                    <strong className="text-primary">
                      {remaining.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
                    </strong>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-medium text-eco">
                    <Check className="h-4 w-4" /> Máš dopravu zdarma!
                  </span>
                )}
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-eco-gradient transition-[width] duration-500" style={{ width: `${shippingPct}%` }} />
              </div>
            </div>

            {/* items */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-water-gradient text-xs font-bold text-white">
                    Droply
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold leading-tight">{item.name}</p>
                        {item.meta && <p className="text-xs text-muted-foreground">{item.meta}</p>}
                      </div>
                      <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive" aria-label="Odstrániť">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 rounded-full border border-border">
                        <button onClick={() => setQty(item.id, item.qty - 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-muted" aria-label="Menej">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">{item.qty}</span>
                        <button onClick={() => setQty(item.id, item.qty + 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-muted" aria-label="Viac">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-display text-sm font-bold">
                        {(item.price * item.qty).toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* footer */}
            <footer className="border-t border-border p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Medzisúčet</span>
                <span className="font-display text-xl font-extrabold">
                  {total.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
                </span>
              </div>
              <button
                onClick={checkout}
                className="btn-sheen flex w-full items-center justify-center gap-2 rounded-full bg-water-gradient py-3.5 font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
              >
                <Lock className="h-4 w-4" />
                Prejsť k pokladni
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-eco" /> 30 dní na vrátenie · bezpečná platba
              </p>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
