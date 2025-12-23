import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lightbulb } from 'lucide-react';

const faqs = [
  {
    question: 'Zvládnem to, aj keď som nikdy netepoval?',
    answer: 'Absolútne. Naše stroje sú navrhnuté tak, aby ich ovládanie bolo intuitívne. Pri preberaní vám všetko vysvetlíme za 5 minút. Je to jednoduchšie ako obsluha bežného vysávača.',
    isProTip: false,
  },
  {
    question: 'Ako dosiahnem najlepší výsledok a rýchle schnutie?',
    answer: 'Kľúčom nie je veľa vody, ale silné odsávanie. Najprv naneste roztok s vodou, nechajte chvíľu pôsobiť. Potom už len odsávajte (bez striekania vody) viackrát po sebe, pomalými ťahmi, kým z látky nejde takmer žiadna vlhkosť. Takto bude sedačka suchá už za pár hodín.',
    isProTip: true,
  },
  {
    question: 'Je chémia bezpečná pre deti a zvieratá?',
    answer: 'Áno, používame len certifikovanú, profesionálnu chémiu, ktorá je po vyschnutí nezávadná.',
    isProTip: false,
  },
  {
    question: 'Čo všetko môžem tepovať?',
    answer: 'Tepovačom vyčistíte takmer všetko: sedačky, matrace, koberce, autosedadlá, stoličky a ďalšie textílie. Nie je vhodný len na koženú sedačku alebo veľmi jemné látky.',
    isProTip: false,
  },
  {
    question: 'Ako dlho schne sedačka po tepovaní?',
    answer: 'Pri správnej technike (viackrát odsávať pomalými ťahmi) je sedačka zväčša suchá do 3-6 hodín. V teplých letných mesiacoch aj skôr. Odporúčame tepovať ráno, nech máte celý deň na schnutie.',
    isProTip: false,
  },
  {
    question: 'Čo ak stroj poškodím?',
    answer: 'Na to slúži vratná záloha 200€. Pri bežnom používaní sa nemusíte ničoho báť. Stroje sú robustné a profesionálne. Zálohu vám vrátime pri odovzdaní nepoškodeného stroja.',
    isProTip: false,
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Expertné tipy pre{' '}
            <span className="text-accent">najlepší výsledok</span> tepovania.
          </h2>
          <p className="text-muted-foreground text-lg">
            Najčastejšie otázky od zákazníkov, ktorí tepujú prvýkrát.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border/50 px-6 shadow-sm data-[state=open]:shadow-card transition-shadow duration-300"
              >
                <AccordionTrigger className="text-left py-5 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    {faq.isProTip && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-accent" />
                      </div>
                    )}
                    <span className="text-base md:text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                      {faq.isProTip && <span className="text-accent mr-2">PRO TIP:</span>}
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground leading-relaxed text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
