import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, Truck, Leaf } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "./cart-context";

const LINKS = [
  { href: "#ako", label: "Ako to funguje" },
  { href: "#vyhody", label: "Výhody" },
  { href: "#produkty", label: "Produkty" },
  { href: "#cennik", label: "Cenník" },
  { href: "#recenzie", label: "Recenzie" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Announcement bar — urgentnosť + doprava zdarma */}
      <div className="relative z-50 overflow-hidden bg-secondary text-secondary-foreground">
        <div className="container-tight flex items-center justify-center gap-2 py-2 text-center text-[13px] font-medium">
          <Truck className="h-4 w-4 text-accent" />
          <span>
            <strong className="text-accent">Doprava ZDARMA</strong> nad 25 € · uvádzacia zľava{" "}
            <strong className="text-accent">−35 %</strong> na prvú objednávku
          </span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-card" : "bg-transparent"
        }`}
      >
        <nav className="container-tight flex items-center justify-between py-3">
          <a href="#top" className="flex items-center" aria-label="Droply domov">
            <Logo size={38} light={!scrolled} />
          </a>

          <ul className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    scrolled ? "text-muted-foreground" : "text-white/85"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              className="relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-105"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Košík</span>
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-sunny text-[11px] font-bold text-sunny-foreground animate-pop-in">
                  {count}
                </span>
              )}
            </button>

            <button
              className={`grid h-10 w-10 place-items-center rounded-full md:hidden ${
                scrolled || mobileOpen ? "text-foreground" : "text-white"
              }`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobilné menu */}
        {mobileOpen && (
          <div className="glass border-t border-border md:hidden">
            <ul className="container-tight flex flex-col py-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-3 text-sm font-medium text-foreground"
                  >
                    <Leaf className="h-4 w-4 text-eco" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
