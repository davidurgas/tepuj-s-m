import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';

const navLinks = [
  { href: '#ako-to-funguje', label: 'Ako požičať stroj' },
  { href: '#pred-a-po', label: 'Výsledky' },
  { href: '#cennik', label: 'Cenník' },
  { href: '#recenzie', label: 'Recenzie' },
  { href: '#faq', label: 'FAQ' },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-sapphire-DEFAULT/98 backdrop-blur-md shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="Tepujsi.sk logo" className="h-10 md:h-12" />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="transition-colors duration-300 text-sm font-medium text-primary-foreground/90 hover:text-accent"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#cennik"
            onClick={(e) => handleNavClick(e, '#cennik')}
            className="bg-accent text-sapphire-DEFAULT px-6 py-2.5 rounded-lg font-semibold hover:bg-cyan-glow transition-all duration-300 shadow-accent hover:shadow-accent-hover transform hover:-translate-y-0.5"
          >
            Rezervovať
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-primary-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-sapphire-DEFAULT/98 backdrop-blur-md transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0'
        }`}
      >
        <div className="container mx-auto px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-primary-foreground/80 hover:text-accent transition-colors duration-300 text-base font-medium py-2"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#cennik"
            onClick={(e) => handleNavClick(e, '#cennik')}
            className="bg-accent text-sapphire-DEFAULT px-6 py-3 rounded-lg font-semibold hover:bg-cyan-glow transition-all duration-300 text-center mt-2"
          >
            Rezervovať stroj
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
