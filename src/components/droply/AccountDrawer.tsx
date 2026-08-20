import { useState } from "react";
import { X, User, LogOut, Package, Mail, Lock, UserPlus, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "./account-context";

export default function AccountDrawer() {
  const { user, orders, isOpen, closeAccount, register, login, logout } = useAccount();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res =
      mode === "register" ? register(form.name, form.email, form.password) : login(form.email, form.password);
    res.ok ? toast.success(res.message) : toast.error(res.message);
    if (res.ok) setForm({ name: "", email: "", password: "" });
  };

  const eur = (n: number) => `${n.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €`;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-secondary/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeAccount}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-background shadow-hover transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Môj účet"
      >
        <header className="flex items-center justify-between border-b border-border p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <User className="h-5 w-5 text-primary" />
            {user ? "Môj účet" : mode === "login" ? "Prihlásenie" : "Vytvoriť účet"}
          </h2>
          <button onClick={closeAccount} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Zavrieť">
            <X className="h-5 w-5" />
          </button>
        </header>

        {user ? (
          /* ---- PRIHLÁSENÝ ---- */
          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-water-gradient font-bold text-white">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{user.name}</p>
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <h3 className="mb-3 mt-6 flex items-center gap-2 font-display text-base font-bold">
              <Package className="h-4 w-4 text-primary" /> Moje objednávky
            </h3>

            {orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Zatiaľ nemáš žiadne objednávky. Vlož niečo do košíka a dokonči objednávku.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold">#{o.id}</span>
                      <span className="rounded-full bg-sunny/15 px-2.5 py-0.5 text-xs font-semibold text-sunny">
                        {o.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{o.date}</p>
                    <ul className="mt-3 space-y-1 text-sm">
                      {o.items.map((it, i) => (
                        <li key={i} className="flex justify-between text-muted-foreground">
                          <span className="truncate">
                            {it.name} <span className="text-muted-foreground/70">×{it.qty}</span>
                          </span>
                          <span className="tabular-nums">{eur(it.price * it.qty)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex justify-between border-t border-border pt-2 text-sm font-semibold">
                      <span>Spolu</span>
                      <span className="tabular-nums">{eur(o.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                logout();
                toast.success("Odhlásený.");
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="h-4 w-4" /> Odhlásiť sa
            </button>
          </div>
        ) : (
          /* ---- NEPRIHLÁSENÝ ---- */
          <div className="flex-1 overflow-y-auto p-5">
            <form onSubmit={submit} className="space-y-3">
              {mode === "register" && (
                <Field icon={<User className="h-4 w-4" />} placeholder="Meno" value={form.name} onChange={set("name")} />
              )}
              <Field icon={<Mail className="h-4 w-4" />} placeholder="E-mail" type="email" value={form.email} onChange={set("email")} />
              <Field icon={<Lock className="h-4 w-4" />} placeholder="Heslo" type="password" value={form.password} onChange={set("password")} />

              <button
                type="submit"
                className="btn-sheen flex w-full items-center justify-center gap-2 rounded-full bg-water-gradient py-3.5 font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
              >
                {mode === "register" ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                {mode === "register" ? "Vytvoriť účet" : "Prihlásiť sa"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {mode === "register" ? "Už máš účet?" : "Nemáš účet?"}{" "}
              <button
                onClick={() => setMode(mode === "register" ? "login" : "register")}
                className="font-semibold text-primary hover:underline"
              >
                {mode === "register" ? "Prihlás sa" : "Zaregistruj sa"}
              </button>
            </p>

            <p className="mt-6 rounded-xl bg-muted/50 p-3 text-center text-xs text-muted-foreground">
              Ide o demo — účet a objednávky sa ukladajú len v tvojom prehliadači.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

function Field({
  icon,
  ...props
}: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3.5 focus-within:border-primary">
      <span className="text-muted-foreground">{icon}</span>
      <input {...props} required className="w-full bg-transparent py-3 text-sm outline-none" />
    </label>
  );
}
