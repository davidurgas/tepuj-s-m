<?php
/**
 * Template Name: Ochrana súkromia
 */
get_header();
?>

<main class="legal-page">
    <div class="legal-container">
        <h1>Zásady ochrany osobných údajov</h1>
        <p class="legal-updated">Posledná aktualizácia: <?php echo date('d.m.Y'); ?></p>

        <section class="legal-section">
            <h2>1. Úvod</h2>
            <p>Ochrana vašich osobných údajov je pre nás prioritou. Tieto zásady vysvetľujú, aké údaje zbierame, ako ich používame a aké máte práva v súvislosti s ochranou vašich osobných údajov.</p>
            <p>Prevádzkovateľ osobných údajov: Prevádzkovateľ služby prenájmu tepovacích strojov</p>
            <p>Kontaktný email: <?php echo esc_html(tepovac_get_option('tepovac_email', 'info@tepovac.sk')); ?></p>
        </section>

        <section class="legal-section">
            <h2>2. Aké údaje zbierame</h2>
            <p>Pri používaní našich služieb môžeme zbierať nasledujúce osobné údaje:</p>
            
            <h3>2.1. Údaje poskytnuté priamo vami:</h3>
            <ul>
                <li>Meno a priezvisko</li>
                <li>Telefónne číslo</li>
                <li>Emailová adresa</li>
                <li>Adresa bydliska alebo miesto dodania</li>
                <li>Číslo občianskeho preukazu (pre účely zálohy)</li>
            </ul>

            <h3>2.2. Údaje zbierané automaticky:</h3>
            <ul>
                <li>IP adresa</li>
                <li>Typ prehliadača a zariadenia</li>
                <li>Čas a dátum návštevy</li>
                <li>Navštívené stránky</li>
                <li>Cookies (viď sekcia 6)</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>3. Účel spracovania údajov</h2>
            <p>Vaše osobné údaje spracúvame na nasledujúce účely:</p>
            <ul>
                <li><strong>Poskytovanie služieb:</strong> Spracovanie rezervácií, komunikácia ohľadom prenájmu, dodanie a prevzatie stroja</li>
                <li><strong>Zákonné povinnosti:</strong> Vedenie účtovníctva, daňové povinnosti</li>
                <li><strong>Oprávnené záujmy:</strong> Ochrana majetku, vymáhanie pohľadávok, zlepšovanie služieb</li>
                <li><strong>Marketing:</strong> Zasielanie noviniek a ponúk (len so súhlasom)</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>4. Právny základ spracovania</h2>
            <p>Vaše osobné údaje spracúvame na základe:</p>
            <ul>
                <li><strong>Plnenie zmluvy</strong> (čl. 6 ods. 1 písm. b) GDPR) – pre poskytnutie služby prenájmu</li>
                <li><strong>Zákonná povinnosť</strong> (čl. 6 ods. 1 písm. c) GDPR) – účtovné a daňové účely</li>
                <li><strong>Oprávnený záujem</strong> (čl. 6 ods. 1 písm. f) GDPR) – ochrana majetku a zlepšovanie služieb</li>
                <li><strong>Súhlas</strong> (čl. 6 ods. 1 písm. a) GDPR) – marketingová komunikácia</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>5. Doba uchovávania údajov</h2>
            <p>Osobné údaje uchovávame len po dobu nevyhnutnú na splnenie účelu:</p>
            <ul>
                <li><strong>Údaje o rezerváciách:</strong> 3 roky od poslednej rezervácie</li>
                <li><strong>Účtovné doklady:</strong> 10 rokov (zákonná požiadavka)</li>
                <li><strong>Marketingové súhlasy:</strong> do odvolania súhlasu</li>
                <li><strong>Cookies:</strong> podľa typu (viď sekcia 6)</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>6. Cookies</h2>
            <p>Naša webová stránka používa cookies na zlepšenie používateľského zážitku.</p>
            
            <h3>6.1. Typy cookies:</h3>
            <ul>
                <li><strong>Nevyhnutné cookies:</strong> Potrebné pre fungovanie stránky (relácia, prihlásenie)</li>
                <li><strong>Analytické cookies:</strong> Pomáhajú nám pochopiť, ako návštevníci používajú stránku</li>
                <li><strong>Marketingové cookies:</strong> Používané na zobrazovanie relevantnej reklamy</li>
            </ul>

            <h3>6.2. Správa cookies:</h3>
            <p>Cookies môžete spravovať v nastaveniach vášho prehliadača. Blokovanie niektorých cookies môže ovplyvniť funkčnosť stránky.</p>
        </section>

        <section class="legal-section">
            <h2>7. Zdieľanie údajov s tretími stranami</h2>
            <p>Vaše údaje môžeme zdieľať s:</p>
            <ul>
                <li><strong>Poskytovatelia služieb:</strong> Rezervačný systém, platobná brána, hosting</li>
                <li><strong>Štátne orgány:</strong> Na základe zákonnej požiadavky</li>
                <li><strong>Účtovné a právne služby:</strong> Pre plnenie zákonných povinností</li>
            </ul>
            <p>So všetkými tretími stranami máme uzatvorené zmluvy o spracovaní osobných údajov.</p>
        </section>

        <section class="legal-section">
            <h2>8. Vaše práva</h2>
            <p>V súvislosti s ochranou osobných údajov máte nasledujúce práva:</p>
            <ul>
                <li><strong>Právo na prístup:</strong> Máte právo vedieť, aké údaje o vás spracúvame</li>
                <li><strong>Právo na opravu:</strong> Môžete požiadať o opravu nesprávnych údajov</li>
                <li><strong>Právo na vymazanie:</strong> Môžete požiadať o vymazanie údajov (s výnimkami)</li>
                <li><strong>Právo na obmedzenie spracovania:</strong> Môžete obmedziť spracovanie vašich údajov</li>
                <li><strong>Právo na prenosnosť:</strong> Môžete požiadať o export vašich údajov</li>
                <li><strong>Právo namietať:</strong> Môžete namietať proti spracovaniu na základe oprávneného záujmu</li>
                <li><strong>Právo odvolať súhlas:</strong> Kedykoľvek môžete odvolať udelený súhlas</li>
            </ul>
            <p>Pre uplatnenie práv nás kontaktujte na <?php echo esc_html(tepovac_get_option('tepovac_email', 'info@tepovac.sk')); ?>.</p>
        </section>

        <section class="legal-section">
            <h2>9. Bezpečnosť údajov</h2>
            <p>Prijímame primerané technické a organizačné opatrenia na ochranu vašich osobných údajov:</p>
            <ul>
                <li>Šifrovanie prenosu dát (SSL/TLS)</li>
                <li>Pravidelné zálohovanie dát</li>
                <li>Obmedzený prístup k údajom len pre oprávnené osoby</li>
                <li>Pravidelné bezpečnostné audity</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>10. Sťažnosti</h2>
            <p>Ak sa domnievate, že spracovanie vašich osobných údajov porušuje nariadenie GDPR, máte právo podať sťažnosť na dozorný orgán:</p>
            <p><strong>Úrad na ochranu osobných údajov Slovenskej republiky</strong><br>
            Hraničná 12, 820 07 Bratislava<br>
            Web: <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener">dataprotection.gov.sk</a></p>
        </section>

        <section class="legal-section">
            <h2>11. Zmeny zásad</h2>
            <p>Tieto zásady môžeme príležitostne aktualizovať. O významných zmenách vás budeme informovať prostredníctvom emailu alebo oznámenia na webovej stránke.</p>
        </section>

        <div class="legal-contact">
            <h3>Kontakt pre otázky ohľadom ochrany osobných údajov</h3>
            <p>Email: <?php echo esc_html(tepovac_get_option('tepovac_email', 'info@tepovac.sk')); ?></p>
            <p>Telefón: <?php echo esc_html(tepovac_get_option('tepovac_phone', '+421 903 123 456')); ?></p>
            <p>Adresa: <?php echo esc_html(tepovac_get_option('tepovac_address', 'Námestie Hraničiarov 35, Bratislava - Petržalka')); ?></p>
        </div>
    </div>
</main>

<?php get_footer(); ?>
