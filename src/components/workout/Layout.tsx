// Aplikačný obal: horná lišta + dolná navigácia (mobile-first).
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { BarChart3, Dumbbell, Home, ListChecks } from "lucide-react";
import { useStore } from "@/lib/workout/store";

const NAV = [
  { to: "/", label: "Prehľad", icon: Home, end: true },
  { to: "/plany", label: "Plány", icon: ListChecks, end: false },
  { to: "/trening", label: "Tréning", icon: Dumbbell, end: false },
  { to: "/progres", label: "Progres", icon: BarChart3, end: false },
];

export default function Layout() {
  const { data } = useStore();
  const location = useLocation();
  const hasActive = !!data.active;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-lg">
        <div className="flex items-center justify-between px-5 py-3.5">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              <Dumbbell className="h-4.5 w-4.5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              Rep<span className="text-primary">.</span>
            </span>
          </NavLink>
          {hasActive && location.pathname !== "/trening" && (
            <NavLink
              to="/trening"
              className="flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-bold text-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Prebieha tréning
            </NavLink>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 pb-28 pt-5 sm:px-5">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-stretch justify-around px-2 py-1.5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.6 : 2} />
                  {label}
                  {to === "/trening" && hasActive && (
                    <span className="absolute right-4 top-1.5 h-2 w-2 rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
