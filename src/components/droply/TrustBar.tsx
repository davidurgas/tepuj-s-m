import { Leaf, ShieldCheck, Recycle, FlaskConical, Truck, Heart } from "lucide-react";

const ITEMS = [
  { icon: Leaf, label: "Vyrobené v EU" },
  { icon: Recycle, label: "100 % recyklovateľné obaly" },
  { icon: FlaskConical, label: "Dermatologicky testované" },
  { icon: ShieldCheck, label: "Bez fosfátov a mikroplastov" },
  { icon: Truck, label: "Odoslanie do 24 h" },
  { icon: Heart, label: "10 000+ spokojných domácností" },
];

export default function TrustBar() {
  return (
    <div className="border-y border-border bg-muted/50">
      <div className="container-tight flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5">
        {ITEMS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Icon className="h-4 w-4 text-eco" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
