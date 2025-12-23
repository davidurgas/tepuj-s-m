import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import before/after images
import beforeAfter1 from '@/assets/before-after-1.jpg';
import beforeAfter2 from '@/assets/before-after-2.jpg';
import beforeAfter3 from '@/assets/before-after-3.jpg';
import beforeAfter4 from '@/assets/before-after-4.jpg';
import beforeAfter5 from '@/assets/before-after-5.jpg';
import beforeAfter6 from '@/assets/before-after-6.jpg';
import beforeAfter7 from '@/assets/before-after-7.jpg';
import beforeAfter8 from '@/assets/before-after-8.jpg';
import beforeAfter9 from '@/assets/before-after-9.jpg';
import beforeAfter10 from '@/assets/before-after-10.jpg';

const pairs = [
  { 
    before: { src: beforeAfter1, alt: 'Sivá sedačka pred tepovaním - viditeľné škvrny' },
    after: { src: beforeAfter2, alt: 'Sivá sedačka po tepovaní - čistá' },
    label: 'Sivá sedačka'
  },
  { 
    before: { src: beforeAfter3, alt: 'Béžová sedačka pred tepovaním - škvrny na povrchu' },
    after: { src: beforeAfter4, alt: 'Béžová sedačka po tepovaní - bez škvŕn' },
    label: 'Béžová sedačka'
  },
  { 
    before: { src: beforeAfter5, alt: 'Biela sedačka pred tepovaním - zašpinená' },
    after: { src: beforeAfter6, alt: 'Biela sedačka po tepovaní - žiarivá' },
    label: 'Biela sedačka'
  },
  { 
    before: { src: beforeAfter7, alt: 'Kreslo pred tepovaním - viditeľné znečistenie' },
    after: { src: beforeAfter8, alt: 'Kreslo po tepovaní - čisté' },
    label: 'Moderné kreslo'
  },
  { 
    before: { src: beforeAfter9, alt: 'Matrac pred tepovaním - žlté škvrny' },
    after: { src: beforeAfter10, alt: 'Matrac po tepovaní - čistý biely' },
    label: 'Matrac'
  },
];

const BeforeAfterSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % pairs.length);
    setShowAfter(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + pairs.length) % pairs.length);
    setShowAfter(false);
  };

  const currentPair = pairs[currentIndex];

  return (
    <section id="pred-a-po" className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Pozrite sa, čo{' '}
            <span className="text-accent">dokážete sami.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Reálne výsledky od našich zákazníkov v Bratislave. Tieto fotky nie sú od profesionálov – 
            sú od ľudí ako vy.
          </p>
        </div>

        {/* Main Slider with Before/After Toggle */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl shadow-card bg-card">
            {/* Before/After Toggle */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex bg-sapphire-DEFAULT/90 rounded-full p-1 backdrop-blur-sm">
              <button
                onClick={() => setShowAfter(false)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  !showAfter 
                    ? 'bg-accent text-sapphire-DEFAULT' 
                    : 'text-primary-foreground hover:text-accent'
                }`}
              >
                PRED
              </button>
              <button
                onClick={() => setShowAfter(true)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  showAfter 
                    ? 'bg-accent text-sapphire-DEFAULT' 
                    : 'text-primary-foreground hover:text-accent'
                }`}
              >
                PO
              </button>
            </div>

            {/* Image Container */}
            <div className="relative aspect-video">
              <img
                src={showAfter ? currentPair.after.src : currentPair.before.src}
                alt={showAfter ? currentPair.after.alt : currentPair.before.alt}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <div className="absolute bottom-4 left-4 bg-accent/90 text-sapphire-DEFAULT px-4 py-2 rounded-lg font-semibold text-sm">
                {currentPair.label} - {showAfter ? 'PO' : 'PRED'}
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-sapphire-DEFAULT/80 text-primary-foreground flex items-center justify-center hover:bg-sapphire-DEFAULT transition-colors duration-300 backdrop-blur-sm"
              aria-label="Predchádzajúci obrázok"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-sapphire-DEFAULT/80 text-primary-foreground flex items-center justify-center hover:bg-sapphire-DEFAULT transition-colors duration-300 backdrop-blur-sm"
              aria-label="Ďalší obrázok"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {pairs.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setShowAfter(false);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-accent w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Prejsť na obrázok ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail grid - showing BEFORE images */}
        <div className="grid grid-cols-5 gap-2 md:gap-4 mt-8 max-w-3xl mx-auto">
          {pairs.map((pair, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setShowAfter(false);
              }}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                index === currentIndex
                  ? 'ring-2 ring-accent ring-offset-2 ring-offset-background'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={pair.before.src}
                alt={pair.before.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
