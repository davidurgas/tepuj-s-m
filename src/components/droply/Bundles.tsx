import { Check, Crown, Zap } from "lucide-react";
import { bundles, type Bundle } from "@/lib/droply-data";
import { useCart } from "./cart-context";
import Countdown from "./Countdown";
import Reveal from "./Reveal";

function BundleCard({ bundle }: { bundle: Bundle }) {
  const { add } = useCart();
  const highlight = bundle.highlight;

  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-7 transition-all duration-300 ${
        highlight
          ? "border-accent/50 bg-card shadow-hover md:-translate-y-3 md:scale-[1.03]"
          : "border-border bg-card shadow-card hover:-translate-y-1"
      }`}
    >
      {bundle.ribbon && (
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-bold shadow ${
            highlight ? "bg-water-gradient text-white" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {bundle.ribbon}
        </span>
      )}

      <div className="flex items-center gap-2">
        {highlight ? <Crown className="h-5 w-5 text-sunny" /> : <Zap className="h-5 w-5 text-accent" />}
        <h3 className="font-display text-xl font-extrabold">{bundle.name}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{bundle.subtitle}</p>

      <div className="mt-5 flex items-end gap-2">
        <span className="font-display text-4xl font-extrabold">
          {bundle.price.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
        </span>
        <span className="mb-1 text-base text-muted-foreground line-through">
          {bundle.compareAt.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €
        </span>
      </div>
      <div className="mt-1 text-sm text-muted-foreground">
        {bundle.tablets} tabliet ·{" "}
        <strong className="text-eco">
          {bundle.perTablet.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} € / tableta
        </strong>
      </div>

      <ul className="mt-6 space-y-3 text-sm">
        {bundle.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-eco" />
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => add({ id: `bundle-${bundle.id}`, name: `Balíček ${bundle.name}`, price: bundle.price, meta: `${bundle.tablets} tabliet` })}
        className={`btn-sheen mt-7 w-full rounded-full px-6 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.03] ${
          highlight
            ? "bg-water-gradient text-white shadow-glow"
            : "border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground"
        }`}
      >
        Vybrať balíček
      </button>
    </div>
  );
}

export default function Bundles() {
  return (
    <section id="cennik" className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-tight">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">05 · Cenník</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            Vyber si balíček a <span className="font-accent text-primary">začni šetriť</span>
          </h2>

          {/* urgentnosť */}
          <div className="mt-6 inline-flex flex-col items-center gap-3 rounded-2xl border border-sunny/30 bg-sunny/10 px-6 py-4 sm:flex-row">
            <span className="text-sm font-semibold text-foreground">
              Uvádzacia ponuka končí o:
            </span>
            <Countdown />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {bundles.map((b, i) => (
            <Reveal key={b.id} delay={i * 90}>
              <BundleCard bundle={b} />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Každý balíček obsahuje dávkovaciu fľašu s doživotnou zárukou. Tablety si vyberieš pri objednávke.
        </p>
      </div>
    </section>
  );
}
