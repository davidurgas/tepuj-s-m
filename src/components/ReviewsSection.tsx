import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Jana M.',
    location: 'Ružinov',
    text: 'Bála som sa, že to bude zložité, ale obsluha stroja bola banálna. Za 35€ som si vytepovala gauč v obývačke aj koberce v detskej izbe. Firma by odo mňa chcela minimálne 120€. Určite si požičiam znova!',
    rating: 5,
  },
  {
    name: 'Peter K.',
    location: 'Petržalka',
    text: 'Perfektná služba. Stroj bol ako nový, silný ťah. Konečne som sa zbavil fľakov na sedačke po psovi, ktoré tam boli roky. Ten pocit čistoty stojí za tú trochu námahy. Odporúčam každému.',
    rating: 5,
  },
  {
    name: 'Martina L.',
    location: 'Nové Mesto',
    text: 'Super prístup, rýchle prebratie v rámci Bratislavy. Tepovala som prvýkrát a výsledok je ako od profesionálov, len podstatne lacnejšie. Skvelý pocit, keď vidíte tú špinavú vodu, čo ide von.',
    rating: 5,
  },
];

const ReviewsSection = () => {
  return (
    <section id="recenzie" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Čo hovoria{' '}
            <span className="text-accent">Bratislavčania</span>, ktorí to skúsili sami?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-border/50 relative"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-2 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Quote className="w-5 h-5 text-accent" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-foreground/90 leading-relaxed mb-6 text-base">
                "{review.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-bold text-sm">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 pt-12 border-t border-border/50 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-4xl font-bold text-accent">500+</p>
            <p className="text-muted-foreground text-sm mt-1">Spokojných zákazníkov</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-accent">4.9</p>
            <p className="text-muted-foreground text-sm mt-1">Priemerné hodnotenie</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-accent">100%</p>
            <p className="text-muted-foreground text-sm mt-1">By odporučili ďalej</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
