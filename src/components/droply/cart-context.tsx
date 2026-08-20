import { createContext, useContext, useMemo, useState, ReactNode, useCallback } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  meta?: string;
};

type ApplyResult = { ok: boolean; message: string };

type CartCtx = {
  items: CartItem[];
  count: number;
  /** medzisúčet (bez dopravy a zľavy) */
  total: number;
  shipping: number;
  discount: number;
  discountCode: string | null;
  grandTotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  applyCode: (code: string) => ApplyResult;
  removeCode: () => void;
  clear: () => void;
};

const FREE_SHIPPING_THRESHOLD = 25;
const SHIPPING_FEE = 3.99;

/** Demo zľavové kódy (percentuálna zľava z medzisúčtu). */
const CODES: Record<string, number> = {
  DROPLY10: 0.1,
  EKO15: 0.15,
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { ...item, qty }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(0, qty) } : p))
        .filter((p) => p.qty > 0),
    );
  }, []);

  const applyCode = useCallback((code: string): ApplyResult => {
    const norm = code.trim().toUpperCase();
    if (!norm) return { ok: false, message: "Zadaj zľavový kód." };
    if (!(norm in CODES)) return { ok: false, message: "Neplatný zľavový kód." };
    setDiscountCode(norm);
    return { ok: true, message: `Kód ${norm} aktivovaný (−${Math.round(CODES[norm] * 100)} %).` };
  }, []);

  const removeCode = useCallback(() => setDiscountCode(null), []);

  const clear = useCallback(() => {
    setItems([]);
    setDiscountCode(null);
  }, []);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    const discount = discountCode ? total * (CODES[discountCode] ?? 0) : 0;
    const afterDiscount = total - discount;
    const shipping = count === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const grandTotal = Math.max(0, afterDiscount + shipping);
    return {
      items,
      count,
      total,
      shipping,
      discount,
      discountCode,
      grandTotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      add,
      remove,
      setQty,
      applyCode,
      removeCode,
      clear,
    };
  }, [items, isOpen, discountCode, add, remove, setQty, applyCode, removeCode, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart musí byť použitý vnútri <CartProvider>");
  return ctx;
}

export { FREE_SHIPPING_THRESHOLD };
