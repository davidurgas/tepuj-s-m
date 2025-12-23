import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import before/after images
import beforeAfter1 from '@/assets/before-after-1.jpg';
import beforeAfter2 from '@/assets/before-after-2.jpg';
import beforeAfter3 from '@/assets/before-after-3.jpg';
import beforeAfter4 from '@/assets/before-after-4.jpg';

const images = [
  { src: beforeAfter1, alt: 'Sedačka pred a po tepovaní - odstránenie fľakov', label: 'Sedačka PRED/PO' },
  { src: beforeAfter2, alt: 'Koberec pred a po hĺbkovom čistení', label: 'Koberec PRED/PO' },
  { src: beforeAfter3, alt: 'Čistenie autosedačky tepovačom', label: 'Auto - proces' },
  { src: beforeAfter4, alt: 'Čistá sedačka po profesionálnom tepovaní', label: 'Výsledok' },
];

const BeforeAfterSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

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

        {/* Main Slider */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl shadow-card bg-card">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={index} className="min-w-full relative aspect-video">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-accent/90 text-sapphire-DEFAULT px-4 py-2 rounded-lg font-semibold text-sm">
                    {image.label}
                  </div>
                </div>
              ))}
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
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
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

        {/* Thumbnail grid */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 mt-8 max-w-2xl mx-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                index === currentIndex
                  ? 'ring-2 ring-accent ring-offset-2 ring-offset-background'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
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
