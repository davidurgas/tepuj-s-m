import { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect } from "react";

export type Order = {
  id: string;
  date: string;
  items: { name: string; qty: number; price: number; meta?: string }[];
  total: number;
  status: string;
};

type Account = { name: string; email: string; password: string; orders: Order[] };

type Result = { ok: boolean; message: string };

type AccountCtx = {
  user: { name: string; email: string } | null;
  orders: Order[];
  isOpen: boolean;
  openAccount: () => void;
  closeAccount: () => void;
  register: (name: string, email: string, password: string) => Result;
  login: (email: string, password: string) => Result;
  logout: () => void;
  placeOrder: (items: Order["items"], total: number) => Order | null;
};

const ACCOUNTS_KEY = "droply-accounts";
const SESSION_KEY = "droply-session";

function loadAccounts(): Record<string, Account> {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveAccounts(a: Record<string, Account>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(a));
}

const Ctx = createContext<AccountCtx | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Record<string, Account>>({});
  const [isOpen, setIsOpen] = useState(false);

  // načítanie zo storage po mounte
  useEffect(() => {
    setAccounts(loadAccounts());
    setEmail(localStorage.getItem(SESSION_KEY));
  }, []);

  const persist = useCallback((next: Record<string, Account>) => {
    setAccounts(next);
    saveAccounts(next);
  }, []);

  const register = useCallback(
    (name: string, mail: string, password: string): Result => {
      const key = mail.trim().toLowerCase();
      if (!name.trim()) return { ok: false, message: "Zadaj meno." };
      if (!key.includes("@")) return { ok: false, message: "Zadaj platný e-mail." };
      if (password.length < 4) return { ok: false, message: "Heslo musí mať aspoň 4 znaky." };
      const current = loadAccounts();
      if (current[key]) return { ok: false, message: "Účet s týmto e-mailom už existuje." };
      current[key] = { name: name.trim(), email: key, password, orders: [] };
      persist(current);
      setEmail(key);
      localStorage.setItem(SESSION_KEY, key);
      return { ok: true, message: `Vitaj, ${name.trim()}! Účet je vytvorený.` };
    },
    [persist],
  );

  const login = useCallback((mail: string, password: string): Result => {
    const key = mail.trim().toLowerCase();
    const current = loadAccounts();
    const acc = current[key];
    if (!acc || acc.password !== password) return { ok: false, message: "Nesprávny e-mail alebo heslo." };
    setAccounts(current);
    setEmail(key);
    localStorage.setItem(SESSION_KEY, key);
    return { ok: true, message: `Vitaj späť, ${acc.name}!` };
  }, []);

  const logout = useCallback(() => {
    setEmail(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const placeOrder = useCallback(
    (items: Order["items"], total: number): Order | null => {
      if (!email) return null;
      const current = loadAccounts();
      const acc = current[email];
      if (!acc) return null;
      const order: Order = {
        id: `DR${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString("sk-SK"),
        items,
        total,
        status: "Spracováva sa",
      };
      acc.orders = [order, ...acc.orders];
      persist(current);
      return order;
    },
    [email, persist],
  );

  const value = useMemo<AccountCtx>(() => {
    const acc = email ? accounts[email] : null;
    return {
      user: acc ? { name: acc.name, email: acc.email } : null,
      orders: acc?.orders ?? [],
      isOpen,
      openAccount: () => setIsOpen(true),
      closeAccount: () => setIsOpen(false),
      register,
      login,
      logout,
      placeOrder,
    };
  }, [email, accounts, isOpen, register, login, logout, placeOrder]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAccount() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAccount musí byť použitý vnútri <AccountProvider>");
  return ctx;
}
