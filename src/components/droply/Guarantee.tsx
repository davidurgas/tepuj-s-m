import { ShieldCheck, Truck, Undo2, Headphones } from "lucide-react";
import Reveal from "./Reveal";

const ITEMS = [
  { icon: Undo2, title: "30 dní na vrátenie", text: "Nespokojnosť? Vrátime ti peniaze bez otázok." },
  { icon: Truck, title: "Doprava zdarma", text: "Pri objednávke nad 25 € neplatíš za dopravu." },
  { icon: ShieldCheck, title: "Kvalita z EU", text: "Formulácie testované a vyrábané v Európskej únii." },
  { icon: Headphones, title: "Podpora 7/7", text: "Ozveme sa ti do pár hodín, každý deň v týždni." },
];

export default function Guarantee() {
  return (
    <section className="relative py-8">
      <div className="container-tight">
        <Reveal className="grid gap-5 rounded-3xl border border-border bg-card p-8 shadow-card sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.title} className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-eco/10 text-eco">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold">{it.title}</h3>
                  <p className="text-sm text-muted-foreground">{it.text}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
