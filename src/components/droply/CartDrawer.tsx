import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, Truck, Check, Lock, Tag, ShieldCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useCart, FREE_SHIPPING_THRESHOLD } from "./cart-context";
import { useAccount } from "./account-context";

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, remove, total, count, clear, shipping, discount, discountCode, grandTotal, applyCode, removeCode } =
    useCart();
  const { user, placeOrder, openAccount } = useAccount();
  const [code, setCode] = useState("");

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const shippingPct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCode(code);
    res.ok ? toast.success(res.message) : toast.error(res.message);
    if (res.ok) setCode("");
  };

  const eur = (n: number) => `${n.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €`;

  const checkout = () => {
    if (!user) {
      toast.info("Prihlás sa alebo si vytvor účet, aby sa objednávka uložila do histórie.");
      closeCart();
      openAccount();
      return;
    }
    const order = placeOrder(
      items.map((i) => ({ name: i.name, qty: i.qty, price: i.price, meta: i.meta })),
      grandTotal,
    );
    toast.success(`Objednávka ${order ? "#" + order.id : ""} vytvorená! (demo)`, {
      description: "Nájdeš ju vo svojom účte. Platobná brána zatiaľ nie je aktívna.",
    });
    clear();
    closeCart();
    openAccount();
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
              {/* zľavový kód */}
              {discountCode ? (
                <div className="mb-3 flex items-center justify-between rounded-xl bg-eco/10 px-3 py-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 font-medium text-eco">
                    <Tag className="h-4 w-4" /> Kód {discountCode} aktívny
                  </span>
                  <button onClick={removeCode} className="text-xs text-muted-foreground underline hover:text-destructive">
                    odstrániť
                  </button>
                </div>
              ) : (
                <form onSubmit={submitCode} className="mb-3 flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Zľavový kód (napr. DROPLY10)"
                    className="min-w-0 flex-1 rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  <button type="submit" className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground">
                    Použiť
                  </button>
                </form>
              )}

              {/* súhrn objednávky */}
              <div className="mb-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Medzisúčet</span>
                  <span className="tabular-nums text-foreground">{eur(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-eco">
                    <span>Zľava</span>
                    <span className="tabular-nums">−{eur(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Doprava</span>
                  <span className="tabular-nums">{shipping === 0 ? <span className="text-eco">Zdarma</span> : eur(shipping)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2.5">
                  <span className="font-semibold">Spolu</span>
                  <span className="font-display text-xl font-extrabold tabular-nums">{eur(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={checkout}
                className="btn-sheen flex w-full items-center justify-center gap-2 rounded-full bg-water-gradient py-3.5 font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
              >
                <Lock className="h-4 w-4" />
                Prejsť k pokladni
              </button>

              {/* dôvera */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><RotateCcw className="h-3.5 w-3.5 text-eco" /> 30 dní na vrátenie</span>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-eco" /> Bezpečná platba</span>
                <span className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-eco" /> Doručenie 1–2 dni</span>
              </div>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
