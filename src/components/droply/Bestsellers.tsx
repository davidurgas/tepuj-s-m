import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { bestsellers } from "@/lib/droply-data";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default function Bestsellers() {
  return (
    <section className="relative bg-muted/40 py-20 sm:py-24">
      <div className="container-tight">
        <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="kicker">Najobľúbenejšie</span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">
              Bestsellery, ktoré <span className="font-accent">milujú</span> domácnosti
            </h2>
          </div>
          <Link to="/produkty" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            Celá ponuka <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
