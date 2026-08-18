import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/droply-data";
import Reveal from "./Reveal";

export default function Faq() {
  return (
    <section id="faq" className="relative py-20 sm:py-24">
      <div className="container-tight max-w-3xl">
        <Reveal className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Časté otázky</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            Ešte váhaš? <span className="font-accent text-primary">Máme odpovede.</span>
          </h2>
        </Reveal>

        <Reveal className="mt-10">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-border bg-card px-5 shadow-card"
              >
                <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
