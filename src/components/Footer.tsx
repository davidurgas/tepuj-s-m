import { Phone, Mail, MapPin } from 'lucide-react';
import logo from '@/assets/logo.png';

const navLinks = [
  { href: '#vyhody', label: 'Výhody' },
  { href: '#ako-to-funguje', label: 'Ako to funguje' },
  { href: '#pred-a-po', label: 'Pred a Po' },
  { href: '#cennik', label: 'Cenník' },
  { href: '#recenzie', label: 'Recenzie' },
  { href: '#faq', label: 'FAQ' },
];

const Footer = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo and description */}
          <div>
            <img src={logo} alt="Tepujsi.sk logo" className="h-12 mb-4" />
            <p className="text-secondary-foreground/70 leading-relaxed">
              Najlepšia požičovňa tepovačov v Bratislave. Profesionálne stroje typu Kärcher 
              za férovú cenu. Tepujte sami a ušetrite.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-lg mb-4">Navigácia</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-secondary-foreground/70 hover:text-accent transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Kontakt</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+421900000000"
                  className="flex items-center gap-3 text-secondary-foreground/70 hover:text-accent transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <span>+421 900 000 000</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@tepujsi.sk"
                  className="flex items-center gap-3 text-secondary-foreground/70 hover:text-accent transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <span>info@tepujsi.sk</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-secondary-foreground/70">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <span>Odberné miesto: Bratislava</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-foreground/50 text-sm text-center md:text-left">
            © 2024 Tepujsi.sk - Najlepšia požičovňa tepovačov v Bratislave. Všetky práva vyhradené.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-secondary-foreground/50 hover:text-accent text-sm transition-colors duration-300"
            >
              Obchodné podmienky
            </a>
            <a
              href="#"
              className="text-secondary-foreground/50 hover:text-accent text-sm transition-colors duration-300"
            >
              Ochrana súkromia
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
