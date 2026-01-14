<?php
/**
 * Template Name: Obchodné podmienky
 */
get_header();
?>

<main class="legal-page">
    <div class="legal-container">
        <h1>Obchodné podmienky</h1>
        <p class="legal-updated">Posledná aktualizácia: <?php echo date('d.m.Y'); ?></p>

        <section class="legal-section">
            <h2>1. Úvodné ustanovenia</h2>
            <p>Tieto obchodné podmienky (ďalej len „OP") upravujú vzťahy medzi prenajímateľom a nájomcom pri prenájme tepovacích strojov a súvisiacich služieb.</p>
            <p>Prenajímateľ: Prevádzkovateľ služby prenájmu tepovacích strojov (ďalej len „prenajímateľ")</p>
            <p>Nájomca: Fyzická alebo právnická osoba, ktorá si prenajíma tepovací stroj (ďalej len „nájomca")</p>
        </section>

        <section class="legal-section">
            <h2>2. Predmet prenájmu</h2>
            <p>Predmetom prenájmu sú profesionálne tepovacie stroje vrátane príslušenstva a čistiacich prostriedkov podľa aktuálnej ponuky prenajímateľa.</p>
            <ul>
                <li>Tepovací stroj s kompletným príslušenstvom</li>
                <li>Čistiaci prostriedok (podľa zvoleného balíka)</li>
                <li>Návod na použitie a bezpečnostné pokyny</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>3. Rezervácia a platba</h2>
            <p>3.1. Rezerváciu je možné vykonať online prostredníctvom rezervačného systému, telefonicky alebo osobne.</p>
            <p>3.2. Rezervácia je záväzná po jej potvrdení prenajímateľom.</p>
            <p>3.3. Platba sa uskutočňuje pri prevzatí stroja, a to v hotovosti alebo platobnou kartou.</p>
            <p>3.4. Prenajímateľ si vyhradzuje právo požadovať zálohu vo výške 50€, ktorá bude vrátená pri vrátení nepoškodeného stroja.</p>
        </section>

        <section class="legal-section">
            <h2>4. Prevzatie a vrátenie stroja</h2>
            <p>4.1. Stroj sa preberá a vracia na adrese: <?php echo esc_html(tepovac_get_option('tepovac_address', 'Námestie Hraničiarov 35, Bratislava - Petržalka')); ?></p>
            <p>4.2. Pri prevzatí nájomca podpíše preberací protokol a obdrží inštruktáž k obsluhe stroja.</p>
            <p>4.3. Stroj musí byť vrátený v čistom stave, vyprázdnený a funkčný.</p>
            <p>4.4. V prípade oneskoreného vrátenia bude účtovaný poplatok 10€ za každú začatú hodinu omeškania.</p>
        </section>

        <section class="legal-section">
            <h2>5. Povinnosti nájomcu</h2>
            <p>Nájomca je povinný:</p>
            <ul>
                <li>Používať stroj výhradne na určený účel (čistenie kobercov, čalúnenia, matracov)</li>
                <li>Dodržiavať návod na použitie a bezpečnostné pokyny</li>
                <li>Nepoužívať iné čistiace prostriedky ako tie, ktoré dodal prenajímateľ</li>
                <li>Chrániť stroj pred poškodením, stratou alebo krádežou</li>
                <li>Nepožičiavať stroj tretím osobám</li>
                <li>Ihneď oznámiť akúkoľvek poruchu alebo poškodenie</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>6. Zodpovednosť za škodu</h2>
            <p>6.1. Nájomca zodpovedá za škody spôsobené na stroji počas doby prenájmu.</p>
            <p>6.2. V prípade poškodenia stroja je nájomca povinný uhradiť náklady na opravu.</p>
            <p>6.3. V prípade straty alebo zničenia stroja je nájomca povinný uhradiť jeho plnú hodnotu.</p>
            <p>6.4. Prenajímateľ nezodpovedá za škody spôsobené nesprávnym použitím stroja.</p>
        </section>

        <section class="legal-section">
            <h2>7. Stornovanie rezervácie</h2>
            <p>7.1. Bezplatné stornovanie je možné najneskôr 24 hodín pred začiatkom prenájmu.</p>
            <p>7.2. Pri stornovaní menej ako 24 hodín pred začiatkom prenájmu môže byť účtovaný storno poplatok vo výške 50% z ceny prenájmu.</p>
            <p>7.3. Pri nedostavení sa bez predchádzajúceho stornovania môže byť účtovaný storno poplatok vo výške 100% z ceny prenájmu.</p>
        </section>

        <section class="legal-section">
            <h2>8. Reklamácie</h2>
            <p>8.1. Reklamácie je možné uplatniť ihneď pri prevzatí stroja alebo počas prenájmu.</p>
            <p>8.2. V prípade oprávnenej reklamácie má nájomca nárok na výmenu stroja alebo vrátenie pomernej časti nájomného.</p>
            <p>8.3. Reklamácie sa podávajú telefonicky na číslo <?php echo esc_html(tepovac_get_option('tepovac_phone', '+421 903 123 456')); ?> alebo emailom na <?php echo esc_html(tepovac_get_option('tepovac_email', 'info@tepovac.sk')); ?>.</p>
        </section>

        <section class="legal-section">
            <h2>9. Záverečné ustanovenia</h2>
            <p>9.1. Tieto obchodné podmienky nadobúdajú účinnosť dňom ich zverejnenia.</p>
            <p>9.2. Prenajímateľ si vyhradzuje právo na zmenu týchto OP.</p>
            <p>9.3. Vzťahy neupravené týmito OP sa riadia príslušnými ustanoveniami Občianskeho zákonníka.</p>
            <p>9.4. Prípadné spory budú riešené prednostne dohodou, inak príslušným súdom SR.</p>
        </section>

        <div class="legal-contact">
            <h3>Kontakt</h3>
            <p>Email: <?php echo esc_html(tepovac_get_option('tepovac_email', 'info@tepovac.sk')); ?></p>
            <p>Telefón: <?php echo esc_html(tepovac_get_option('tepovac_phone', '+421 903 123 456')); ?></p>
        </div>
    </div>
</main>

<?php get_footer(); ?>
