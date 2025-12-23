import { Wallet, Clock, Award } from 'lucide-react';

const benefits = [
  {
    icon: Wallet,
    title: 'Ušetríte až 70% nákladov.',
    description: 'Profesionálne firmy si pýtajú za vytepovanie sedačky aj 100€. U nás máte stroj na celý deň za zlomok ceny a vytepujete celý byt.',
  },
  {
    icon: Clock,
    title: 'Tepujete kedykoľvek vám to vyhovuje.',
    description: 'Nemusíte sa prispôsobovať termínom firiem. Požičajte si stroj na 12 hodín a čistite vtedy, keď máte čas a chuť.',
  },
  {
    icon: Award,
    title: 'Profesionálny výsledok pod vašou kontrolou.',
    description: 'Požičiavame len výkonné, profesionálne stroje (typu Kärcher), ktoré používajú aj upratovacie služby. Výsledok bude dokonalý, pretože si dáte záležať na každom detaile.',
  },
];

const BenefitsSection = () => {
  return (
    <section id="vyhody" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Prečo si tepovať sám, keď môžete{' '}
            <span className="text-accent">zavolať firmu?</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Pretože s našim profesionálnym strojom dosiahnete rovnaký výsledok za zlomok ceny.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                <benefit.icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                {benefit.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
