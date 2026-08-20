import { MessageCircle, Clock, Star, ShieldCheck } from "lucide-react";
import { SUPPORT_IMAGE, SUPPORT_NAME } from "@/lib/droply-data";
import Reveal from "./Reveal";

export default function SupportSection() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="container-tight">
        <Reveal className="grid items-center gap-10 overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card sm:p-10 md:grid-cols-[auto_1fr]">
          {/* fotka podpory */}
          <div className="relative mx-auto">
            <div className="absolute inset-2 rounded-3xl bg-water-gradient opacity-40 blur-2xl" />
            <img
              src={SUPPORT_IMAGE}
              alt={`${SUPPORT_NAME} – zákaznícka podpora Droply`}
              className="relative h-52 w-52 rounded-3xl object-cover shadow-hover sm:h-60 sm:w-60"
            />
            <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold shadow-card">
              <span className="h-2 w-2 rounded-full bg-eco" /> Online teraz
            </span>
          </div>

          {/* text */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Sme tu pre teba</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Poradí ti <span className="font-accent">{SUPPORT_NAME}</span> a náš tím
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Nevieš vybrať tablety alebo máš otázku k objednávke? Napíš nám — sme tu každý deň a radi pomôžeme.
              Žiadne roboty, odpovedajú skutoční ľudia.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" /> Odpovieme zvyčajne do 5 minút
              </span>
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Star className="h-4 w-4 fill-sunny text-sunny" /> 4,9/5 spokojnosť s podporou
              </span>
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-eco" /> 7 dní v týždni
              </span>
            </div>

            <button
              onClick={() => window.dispatchEvent(new Event("droply-open-chat"))}
              className="btn-sheen mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.03]"
            >
              <MessageCircle className="h-5 w-5" />
              Napíš nám
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
