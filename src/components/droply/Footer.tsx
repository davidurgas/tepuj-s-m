import { Instagram, Facebook, Mail, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const COLS = [
  {
    title: "Nákup",
    links: [
      { label: "Produkty", to: "/produkty" },
      { label: "Balíčky", to: "/balicky" },
      { label: "Ako to funguje", to: "/ako-funguje" },
      { label: "Recenzie", to: "/recenzie" },
    ],
  },
  {
    title: "Droply",
    links: [
      { label: "Prečo Droply", to: "/" },
      { label: "Kalkulačka úspor", to: "/ako-funguje" },
      { label: "Časté otázky", to: "/balicky" },
      { label: "Podľa kategórie", to: "/produkty" },
    ],
  },
  {
    title: "Podpora",
    links: [
      { label: "Doprava a platba", to: "/balicky" },
      { label: "Vrátenie tovaru", to: "/balicky" },
      { label: "Obchodné podmienky", to: "#" },
      { label: "Ochrana súkromia", to: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-secondary text-secondary-foreground">
      <div className="container-tight py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo size={40} light />
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Šumivé čistiace tablety rozpustné vo vode. Menej plastu, menej miesta, menej nosenia. Rovnaká čistota.
            </p>
            <div className="mt-5 flex gap-3">
              {[Instagram, Facebook, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent hover:text-accent-foreground"
                  aria-label="Sociálna sieť"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white/80">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to.startsWith("/") ? (
                      <Link to={l.to} className="text-sm text-white/60 transition-colors hover:text-accent">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.to} className="text-sm text-white/60 transition-colors hover:text-accent">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} Droply. Všetky práva vyhradené.</span>
          <span className="inline-flex items-center gap-1.5">
            <Leaf className="h-4 w-4 text-eco" />
            Vyrobené s ohľadom na planétu · demo eshop
          </span>
        </div>
      </div>
    </footer>
  );
}
