import { Check, Clock, Droplets, Shield } from 'lucide-react';

const features = [
  { icon: Clock, text: '12 hodín prenájmu' },
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

        <div className="max-w-4xl mx-auto">
          {/* Pricing Card */}
          <div className="bg-card rounded-3xl shadow-card overflow-hidden mb-12">
            <div className="p-8 md:p-12 text-center">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Droplets className="w-4 h-4" />
                Najobľúbenejšia voľba
              </div>

              <div className="mb-6">
                <span className="text-6xl md:text-7xl font-bold text-foreground">35€</span>
                <span className="text-2xl text-muted-foreground font-medium"> / 12 hodín</span>
              </div>

              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Kompletný prenájom profesionálneho tepovača. V cene je aj základná dávka profesionálnej chémie!
              </p>

              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-foreground">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-accent" />
                    </div>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-8">
                <Check className="w-4 h-4 text-accent" />
                <span>Pri prevzatí sa skladá vratná záloha 200€ v hotovosti</span>
              </div>
            </div>
          </div>

          {/* AMELIA Booking Container */}
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card">
            <h3 className="text-2xl font-bold text-foreground text-center mb-6">
              Vyberte si termín
            </h3>
            
            <div
              id="amelia-booking-container"
              className="min-h-[400px] bg-muted/30 rounded-xl flex items-center justify-center border-2 border-dashed border-border"
            >
              {/* AMELIA BOOKING SHORTCODE: [ameliaevents] */}
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-muted-foreground">
                  Rezervačný systém AMELIA sa načíta tu.
                </p>
                <p className="text-sm text-muted-foreground/70 mt-2">
                  [ameliaevents]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
