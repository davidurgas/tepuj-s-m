import { Check, Sparkles } from "lucide-react";
import { loyaltyConfig } from "@/lib/loyalty-config";

/** Vizuálna „papierová" pečiatková karta s okienkami na pečiatky. */
export default function StampCard({ stamps }: { stamps: number }) {
  const total = loyaltyConfig.stampsPerReward;
  const cells = Array.from({ length: total }, (_, i) => i);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-[hsl(214_80%_8%)] p-5 text-secondary-foreground shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-accent">Vernostná karta</p>
          <p className="text-lg font-extrabold leading-tight">{loyaltyConfig.brand}</p>
        </div>
        <Sparkles className="h-6 w-6 text-accent" />
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
        {cells.map((i) => {
          const filled = i < stamps;
          const isReward = i === total - 1;
          return (
            <div
              key={i}
              className={`relative flex aspect-square items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                filled
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-white/25 bg-white/5 text-white/40"
              }`}
              aria-label={filled ? `Pečiatka ${i + 1} získaná` : `Prázdne okienko ${i + 1}`}
            >
              {filled ? <Check className="h-5 w-5" /> : isReward ? "🎁" : i + 1}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-sm text-white/80">
        {stamps >= total
          ? "Karta je plná — odmena čaká! 🎉"
          : `Ešte ${total - stamps} do odmeny: `}
        {stamps < total && <span className="font-semibold text-accent">{loyaltyConfig.reward}</span>}
      </p>
    </div>
  );
}
