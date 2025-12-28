import heroImage from '@/assets/hero-image.jpg';

const HeroSection = () => {
  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector('#cennik');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Profesionálne tepovanie sedačky v Bratislave"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sapphire-DEFAULT via-sapphire-DEFAULT/90 to-sapphire-DEFAULT/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-sapphire-DEFAULT via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-24 pb-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up">
            Profesionálne tepovanie{' '}
            <span className="text-accent">vo vašich rukách.</span>
          </h1>
          
          <h2 className="text-lg md:text-xl lg:text-2xl text-primary-foreground/80 mb-8 leading-relaxed animate-fade-up animation-delay-200 font-light">
            Požičajte si profi tepovací stroj v Bratislave. Vyčistite sedačku či koberec sami, 
            ušetrite stovky eur a užívajte si svieži domov ešte dnes.
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
            <a
              href="#cennik"
              onClick={handleCTAClick}
              className="inline-flex items-center justify-center bg-accent text-sapphire-DEFAULT px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-glow transition-all duration-300 shadow-glow hover:shadow-accent-hover transform hover:-translate-y-1 animate-pulse-glow"
            >
              Rezervovať stroj na dnes
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            
            <a
              href="#ako-to-funguje"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#ako-to-funguje')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center border-2 border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:border-accent hover:text-accent transition-all duration-300"
            >
              Ako to funguje?
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-6 mt-12 animate-fade-up animation-delay-400">
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Profesionálny stroj typu Kärcher</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Chémia v cene</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Dovoz v rámci Bratislavy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-accent rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
