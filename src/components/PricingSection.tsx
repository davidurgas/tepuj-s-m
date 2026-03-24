import { useEffect, useRef } from 'react';
import { Check, Clock, Droplets, Shield, Truck } from 'lucide-react';

const features = [
  { icon: Droplets, text: 'Profesionálna chémia v cene' },
  { icon: Shield, text: 'Stroj typu Kärcher' },
];

const PricingSection = () => {
  return (
    <section id="cennik" className="py-20 md:py-28 bg-primary-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Žiadne skryté poplatky.{' '}
            <span className="text-accent">Férová cena</span> za čistý domov.
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Pricing Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* 4 Hour Option */}
            <div className="bg-card rounded-3xl shadow-card overflow-hidden">
              <div className="p-8 md:p-10 text-center">
                <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Clock className="w-4 h-4" />
                  Rýchle čistenie
                </div>

                <div className="mb-6">
                  <span className="text-5xl md:text-6xl font-bold text-foreground">20€</span>
                  <span className="text-xl text-muted-foreground font-medium"> / 4 hodiny</span>
                </div>

                <p className="text-muted-foreground mb-8">
                  Ideálne na rýchle vyčistenie sedačky alebo koberca.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-foreground">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-medium text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 8 Hour Option */}
            <div className="bg-card rounded-3xl shadow-card overflow-hidden ring-2 ring-accent relative">
              <div className="absolute top-0 left-0 right-0 bg-accent text-sapphire-DEFAULT text-center py-2 text-sm font-bold">
                Najobľúbenejšia voľba
              </div>
              <div className="p-8 md:p-10 text-center pt-14">
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Droplets className="w-4 h-4" />
                  Celý domov
                </div>

                <div className="mb-6">
                  <span className="text-5xl md:text-6xl font-bold text-foreground">35€</span>
                  <span className="text-xl text-muted-foreground font-medium"> / 8 hodín</span>
                </div>

                <p className="text-muted-foreground mb-8">
                  Dostatok času na vytepovanie celého bytu alebo auta.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-foreground">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-medium text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery option */}
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-primary-foreground font-semibold text-lg">
                  Dovezieme vám stroj až domov! <span className="text-accent">+10€</span>
                </p>
                <p className="text-primary-foreground/70 text-sm">
                  Dovoz a odvoz v rámci celej Bratislavy. Nemusíte nikam chodiť.
                </p>
              </div>
            </div>
          </div>

          {/* Deposit info */}
          <div className="flex items-center justify-center gap-2 text-primary-foreground/80 text-sm mb-12">
            <Check className="w-4 h-4 text-accent" />
            <span>Pri prevzatí sa skladá vratná záloha 200€ v hotovosti</span>
          </div>

          {/* TidyCal Booking */}
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card">
            <h3 className="text-2xl font-bold text-foreground text-center mb-6">
              Rezervujte si termín
            </h3>
            
            <div
              className="tidycal-embed"
              data-path="tepujsi/4hodiny-osobnyodber"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
