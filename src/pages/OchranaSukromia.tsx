import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const OchranaSukromia = () => {
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
            Zásady ochrany osobných údajov
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
              1. Úvod
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ochrana vašich osobných údajov je pre nás prioritou. Tieto zásady vysvetľujú, aké údaje zbierame, ako ich používame a aké máte práva v súvislosti s ochranou vašich osobných údajov v zmysle nariadenia GDPR (General Data Protection Regulation).
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Prevádzkovateľ:</strong> Tepujsi.sk – služba prenájmu profesionálnych tepovacích strojov v Bratislave
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Kontaktný email:</strong> info@tepujsi.sk
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              2. Aké údaje zbierame
            </h2>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">2.1. Údaje poskytnuté priamo vami:</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Meno a priezvisko</li>
              <li>Telefónne číslo</li>
              <li>Emailová adresa</li>
              <li>Adresa bydliska alebo miesto dodania (pri dovoze stroja)</li>
              <li>Číslo občianskeho preukazu (pre účely zálohy)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">2.2. Údaje zbierané automaticky:</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>IP adresa</li>
              <li>Typ prehliadača a zariadenia</li>
              <li>Čas a dátum návštevy</li>
              <li>Navštívené stránky</li>
              <li>Cookies (viď sekcia 6)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              3. Účel spracovania údajov
            </h2>
            <p className="text-muted-foreground leading-relaxed">Vaše osobné údaje spracúvame na nasledujúce účely:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Poskytovanie služieb:</strong> Spracovanie rezervácií, komunikácia ohľadom prenájmu, dodanie a prevzatie stroja</li>
              <li><strong className="text-foreground">Zákonné povinnosti:</strong> Vedenie účtovníctva, daňové povinnosti</li>
              <li><strong className="text-foreground">Oprávnené záujmy:</strong> Ochrana majetku, vymáhanie pohľadávok, zlepšovanie služieb</li>
              <li><strong className="text-foreground">Marketing:</strong> Zasielanie noviniek a ponúk (len so súhlasom)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              4. Právny základ spracovania
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Plnenie zmluvy</strong> (čl. 6 ods. 1 písm. b) GDPR) – pre poskytnutie služby prenájmu</li>
              <li><strong className="text-foreground">Zákonná povinnosť</strong> (čl. 6 ods. 1 písm. c) GDPR) – účtovné a daňové účely</li>
              <li><strong className="text-foreground">Oprávnený záujem</strong> (čl. 6 ods. 1 písm. f) GDPR) – ochrana majetku a zlepšovanie služieb</li>
              <li><strong className="text-foreground">Súhlas</strong> (čl. 6 ods. 1 písm. a) GDPR) – marketingová komunikácia</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              5. Doba uchovávania údajov
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Údaje o rezerváciách:</strong> 3 roky od poslednej rezervácie</li>
              <li><strong className="text-foreground">Účtovné doklady:</strong> 10 rokov (zákonná požiadavka)</li>
              <li><strong className="text-foreground">Marketingové súhlasy:</strong> do odvolania súhlasu</li>
              <li><strong className="text-foreground">Cookies:</strong> podľa typu (viď sekcia 6)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              6. Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Naša webová stránka používa cookies na zlepšenie používateľského zážitku.
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">6.1. Typy cookies:</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Nevyhnutné cookies:</strong> Potrebné pre fungovanie stránky (relácia, prihlásenie)</li>
              <li><strong className="text-foreground">Analytické cookies:</strong> Pomáhajú nám pochopiť, ako návštevníci používajú stránku</li>
              <li><strong className="text-foreground">Marketingové cookies:</strong> Používané na zobrazovanie relevantnej reklamy</li>
            </ul>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">6.2. Správa cookies:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Cookies môžete spravovať v nastaveniach vášho prehliadača. Blokovanie niektorých cookies môže ovplyvniť funkčnosť stránky.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              7. Zdieľanie údajov s tretími stranami
            </h2>
            <p className="text-muted-foreground leading-relaxed">Vaše údaje môžeme zdieľať s:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Poskytovatelia služieb:</strong> Rezervačný systém (TidyCal), hosting</li>
              <li><strong className="text-foreground">Štátne orgány:</strong> Na základe zákonnej požiadavky</li>
              <li><strong className="text-foreground">Účtovné a právne služby:</strong> Pre plnenie zákonných povinností</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">
              So všetkými tretími stranami máme uzatvorené zmluvy o spracovaní osobných údajov.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              8. Vaše práva
            </h2>
            <p className="text-muted-foreground leading-relaxed">V súvislosti s ochranou osobných údajov máte nasledujúce práva:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Právo na prístup:</strong> Máte právo vedieť, aké údaje o vás spracúvame</li>
              <li><strong className="text-foreground">Právo na opravu:</strong> Môžete požiadať o opravu nesprávnych údajov</li>
              <li><strong className="text-foreground">Právo na vymazanie:</strong> Môžete požiadať o vymazanie údajov (s výnimkami)</li>
              <li><strong className="text-foreground">Právo na obmedzenie spracovania:</strong> Môžete obmedziť spracovanie vašich údajov</li>
              <li><strong className="text-foreground">Právo na prenosnosť:</strong> Môžete požiadať o export vašich údajov</li>
              <li><strong className="text-foreground">Právo namietať:</strong> Môžete namietať proti spracovaniu na základe oprávneného záujmu</li>
              <li><strong className="text-foreground">Právo odvolať súhlas:</strong> Kedykoľvek môžete odvolať udelený súhlas</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Pre uplatnenie práv nás kontaktujte na <strong className="text-foreground">info@tepujsi.sk</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              9. Bezpečnosť údajov
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Prijímame primerané technické a organizačné opatrenia na ochranu vašich osobných údajov:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Šifrovanie prenosu dát (SSL/TLS)</li>
              <li>Pravidelné zálohovanie dát</li>
              <li>Obmedzený prístup k údajom len pre oprávnené osoby</li>
              <li>Pravidelné bezpečnostné audity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              10. Sťažnosti
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ak sa domnievate, že spracovanie vašich osobných údajov porušuje nariadenie GDPR, máte právo podať sťažnosť na dozorný orgán:
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Úrad na ochranu osobných údajov Slovenskej republiky</strong><br />
              Hraničná 12, 820 07 Bratislava<br />
              Web: <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">dataprotection.gov.sk</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-4">
              11. Zmeny zásad
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Tieto zásady môžeme príležitostne aktualizovať. O významných zmenách vás budeme informovať prostredníctvom emailu alebo oznámenia na webovej stránke.
            </p>
          </section>

          {/* Contact box */}
          <div className="bg-muted/50 rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-bold text-foreground mb-4">Kontakt pre otázky ohľadom ochrany osobných údajov</h3>
            <p className="text-muted-foreground">Email: info@tepujsi.sk</p>
            <p className="text-muted-foreground">Adresa: Námestie Hraničiarov 35, Bratislava – Petržalka</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OchranaSukromia;
