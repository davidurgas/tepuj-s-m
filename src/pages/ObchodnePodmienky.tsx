import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ObchodnePodmienky = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary-gradient py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Späť na hlavnú stránku
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground">
            Obchodné podmienky
          </h1>
          <p className="text-primary-foreground/60 mt-4">
            Posledná aktualizácia: 24.03.2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              1. Úvodné ustanovenia
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Tieto obchodné podmienky (ďalej len „OP") upravujú vzťahy medzi prenajímateľom a nájomcom pri prenájme tepovacích strojov a súvisiacich služieb.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Prenajímateľ:</strong> Prevádzkovateľ služby Tepujsi.sk – prenájom profesionálnych tepovacích strojov v Bratislave.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Nájomca:</strong> Fyzická alebo právnická osoba, ktorá si prenajíma tepovací stroj.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              2. Predmet prenájmu
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Predmetom prenájmu sú profesionálne tepovacie stroje typu Kärcher vrátane príslušenstva a čistiacich prostriedkov podľa aktuálnej ponuky prenajímateľa.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Tepovací stroj s kompletným príslušenstvom</li>
              <li>Čistiaci prostriedok (profesionálna chémia v cene)</li>
              <li>Návod na použitie a bezpečnostné pokyny</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              3. Cenník a podmienky prenájmu
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              3.1. Prenájom na 4 hodiny: <strong className="text-foreground">20 €</strong> (vrátane profesionálnej chémie)
            </p>
            <p className="text-muted-foreground leading-relaxed">
              3.2. Prenájom na 8 hodín: <strong className="text-foreground">35 €</strong> (vrátane profesionálnej chémie)
            </p>
            <p className="text-muted-foreground leading-relaxed">
              3.3. Dovoz a odvoz stroja v rámci Bratislavy: <strong className="text-foreground">+10 €</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              3.4. Pri prevzatí stroja sa skladá vratná záloha vo výške <strong className="text-foreground">200 €</strong> v hotovosti, ktorá bude vrátená pri vrátení nepoškodeného stroja.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              4. Rezervácia a platba
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              4.1. Rezerváciu je možné vykonať online prostredníctvom rezervačného systému na stránke Tepujsi.sk, telefonicky alebo cez WhatsApp.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              4.2. Rezervácia je záväzná po jej potvrdení prenajímateľom.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              4.3. Platba sa uskutočňuje pri prevzatí stroja, a to v hotovosti alebo platobnou kartou.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              5. Prevzatie a vrátenie stroja
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              5.1. Osobný odber a vrátenie stroja na adrese: <strong className="text-foreground">Námestie Hraničiarov 35, Bratislava – Petržalka</strong>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              5.2. Alternatívne je možný dovoz a odvoz v rámci Bratislavy za príplatok 10 €.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              5.3. Pri prevzatí nájomca obdrží inštruktáž k obsluhe stroja.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              5.4. Stroj musí byť vrátený v čistom stave, vyprázdnený a funkčný.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              5.5. V prípade oneskoreného vrátenia bude účtovaný poplatok 10 € za každú začatú hodinu omeškania.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              6. Povinnosti nájomcu
            </h2>
            <p className="text-muted-foreground leading-relaxed">Nájomca je povinný:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Používať stroj výhradne na určený účel (čistenie kobercov, čalúnenia, matracov, automobilov)</li>
              <li>Dodržiavať návod na použitie a bezpečnostné pokyny</li>
              <li>Nepoužívať iné čistiace prostriedky ako tie, ktoré dodal prenajímateľ</li>
              <li>Chrániť stroj pred poškodením, stratou alebo krádežou</li>
              <li>Nepožičiavať stroj tretím osobám</li>
              <li>Ihneď oznámiť akúkoľvek poruchu alebo poškodenie</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              7. Zodpovednosť za škodu
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              7.1. Nájomca zodpovedá za škody spôsobené na stroji počas doby prenájmu.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              7.2. V prípade poškodenia stroja je nájomca povinný uhradiť náklady na opravu.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              7.3. V prípade straty alebo zničenia stroja je nájomca povinný uhradiť jeho plnú hodnotu.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              7.4. Prenajímateľ nezodpovedá za škody spôsobené nesprávnym použitím stroja nájomcom.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              8. Stornovanie rezervácie
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              8.1. Bezplatné stornovanie je možné najneskôr 24 hodín pred začiatkom prenájmu.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              8.2. Pri stornovaní menej ako 24 hodín pred začiatkom prenájmu môže byť účtovaný storno poplatok vo výške 50 % z ceny prenájmu.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              8.3. Pri nedostavení sa bez predchádzajúceho stornovania bude účtovaný storno poplatok vo výške 100 % z ceny prenájmu.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              9. Reklamácie
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              9.1. Reklamácie je možné uplatniť ihneď pri prevzatí stroja alebo počas prenájmu.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              9.2. V prípade oprávnenej reklamácie má nájomca nárok na výmenu stroja alebo vrátenie pomernej časti nájomného.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              9.3. Reklamácie sa podávajú telefonicky alebo emailom na info@tepujsi.sk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              10. Záverečné ustanovenia
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              10.1. Tieto obchodné podmienky nadobúdajú účinnosť dňom ich zverejnenia na stránke Tepujsi.sk.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              10.2. Prenajímateľ si vyhradzuje právo na zmenu týchto OP bez predchádzajúceho upozornenia.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              10.3. Vzťahy neupravené týmito OP sa riadia príslušnými ustanoveniami Občianskeho zákonníka Slovenskej republiky.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              10.4. Prípadné spory budú riešené prednostne dohodou, inak príslušným súdom Slovenskej republiky.
            </p>
          </section>

          {/* Contact box */}
          <div className="bg-muted/50 rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-bold text-foreground mb-4">Kontakt</h3>
            <p className="text-muted-foreground">Email: info@tepujsi.sk</p>
            <p className="text-muted-foreground">Adresa: Námestie Hraničiarov 35, Bratislava – Petržalka</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObchodnePodmienky;
