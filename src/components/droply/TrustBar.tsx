import { Leaf, ShieldCheck, Recycle, FlaskConical, Truck, Heart, Sparkles } from "lucide-react";

const ITEMS = [
  { icon: Leaf, label: "Vyrobené v EU" },
  { icon: Recycle, label: "100 % recyklovateľné obaly" },
  { icon: FlaskConical, label: "Dermatologicky testované" },
  { icon: ShieldCheck, label: "Bez fosfátov a mikroplastov" },
  { icon: Truck, label: "Odoslanie do 24 h" },
  { icon: Heart, label: "10 000+ spokojných domácností" },
  { icon: Sparkles, label: "Rovnaká čistiaca sila" },
];

export default function TrustBar() {
  return (
    <div className="pause-on-hover relative overflow-hidden border-y border-border bg-card py-4">
      {/* okraje s jemným prechodom */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-card to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-card to-transparent" />

      <div className="flex w-max animate-marquee items-center">
        {[...ITEMS, ...ITEMS].map(({ icon: Icon, label }, i) => (
          <span key={i} className="flex shrink-0 items-center gap-2.5 px-8 text-sm font-medium text-muted-foreground">
            <Icon className="h-4 w-4 text-eco" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
