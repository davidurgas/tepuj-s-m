import { CalendarCheck, MapPin, Sparkles, Truck } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: CalendarCheck,
    title: 'Rezervujte si stroj online.',
    description: 'Vyberte si dátum a čas v našom kalendári nižšie. Zaberie to minútu.',
  },
  {
    number: '02',
    icon: MapPin,
    title: 'Vyzdvihnite si ho alebo vám ho dovezieme.',
    description: 'Stroj si môžete vyzdvihnúť na adrese Námestie Hraničiarov 35, Petržalka, alebo vám ho dovezieme za +10€.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Tepujte a vráťte.',
    description: 'Užite si čistenie. Potom nám stroj jednoducho vrátite alebo ho od vás vyzdvihneme.',
  },
];

const ProcessSection = () => {
  return (
    <section id="ako-to-funguje" className="py-20 md:py-28 bg-primary-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Jednoduchá cesta k{' '}
            <span className="text-accent">čistému domovu</span> v Bratislave.
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-[80%] h-0.5 bg-accent/20" />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative text-center group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step number */}
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-accent/10 border-2 border-accent/30 flex items-center justify-center group-hover:bg-accent/20 group-hover:border-accent transition-all duration-300">
                    <step.icon className="w-9 h-9 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sapphire-DEFAULT font-bold text-sm shadow-glow">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-primary-foreground mb-3">
                  {step.title}
                </h3>
                
                <p className="text-primary-foreground/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
