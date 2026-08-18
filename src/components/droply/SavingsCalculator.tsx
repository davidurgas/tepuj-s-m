import { useState } from "react";
import { Recycle, Weight, Wallet, Droplets } from "lucide-react";
import Reveal from "./Reveal";

// priemerné hodnoty pre výpočet dopadu
const PLASTIC_PER_BOTTLE_G = 90; // g plastu na jednu fľašu čističa
const WEIGHT_PER_BOTTLE_KG = 0.55; // kg (voda + obal), ktoré netreba niesť
const CLASSIC_PRICE = 2.6; // € za klasickú fľašu
const TABLET_PRICE = 0.9; // € za tabletu Droply

export default function SavingsCalculator() {
  const [perMonth, setPerMonth] = useState(4); // koľko fliaš čističa domácnosť spotrebuje mesačne

  const bottlesYear = perMonth * 12;
  const plasticKg = (bottlesYear * PLASTIC_PER_BOTTLE_G) / 1000;
  const weightKg = bottlesYear * WEIGHT_PER_BOTTLE_KG;
  const moneyEur = bottlesYear * (CLASSIC_PRICE - TABLET_PRICE);

  const stats = [
    {
      icon: Recycle,
      value: `${plasticKg.toLocaleString("sk-SK", { maximumFractionDigits: 1 })} kg`,
      label: "menej plastu ročne",
      tint: "text-eco",
    },
    {
      icon: Weight,
      value: `${weightKg.toLocaleString("sk-SK", { maximumFractionDigits: 0 })} kg`,
      label: "nemusíš niesť z obchodu",
      tint: "text-primary",
    },
    {
      icon: Wallet,
      value: `${moneyEur.toLocaleString("sk-SK", { maximumFractionDigits: 0 })} €`,
      label: "ušetríš za rok",
      tint: "text-sunny",
    },
    {
      icon: Droplets,
      value: `${bottlesYear}`,
      label: "fliaš navyše nekúpiš",
      tint: "text-accent",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="container-tight">
        <Reveal className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-accent/5 to-eco/5 p-8 shadow-card sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Kalkulačka dopadu</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
              Koľko ušetríš práve <span className="font-accent text-primary">ty?</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Potiahni posuvník podľa toho, koľko čističov tvoja domácnosť spotrebuje mesačne.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-xl">
            <div className="mb-3 flex items-end justify-between">
              <span className="text-sm font-medium text-muted-foreground">Spotreba čističov mesačne</span>
              <span className="font-display text-2xl font-extrabold text-primary">{perMonth} ks</span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              value={perMonth}
              onChange={(e) => setPerMonth(Number(e.target.value))}
              className="droply-range w-full"
              aria-label="Počet čističov mesačne"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>12+</span>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-card p-5 text-center shadow-card"
                >
                  <Icon className={`mx-auto h-7 w-7 ${s.tint}`} />
                  <div className="mt-3 font-display text-3xl font-extrabold tabular-nums">{s.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            * Orientačný výpočet na základe priemernej plastovej fľaše čističa (~90 g plastu, 0,5 l).
          </p>
        </Reveal>
      </div>
    </section>
  );
}
