<?php get_header(); ?>

<!-- Hero Section -->
<section class="hero" id="hero">
    <div class="hero-background">
        <?php 
        $hero_image = tepovac_get_option('tepovac_hero_image');
        if ($hero_image): ?>
            <img src="<?php echo esc_url($hero_image); ?>" alt="Tepovací stroj">
        <?php else: ?>
            <img src="<?php echo get_template_directory_uri(); ?>/assets/images/hero-image.jpg" alt="Tepovací stroj">
        <?php endif; ?>
    </div>
    <div class="hero-overlay"></div>
    
    <div class="container hero-content">
        <div class="hero-badge animate-fade-up">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>Najobľúbenejší prenájom v Bratislave</span>
        </div>
        
        <h1 class="hero-title animate-fade-up animation-delay-100">
            Profesionálne <span class="highlight">tepovanie</span> vo vašich rukách
        </h1>
        
        <p class="hero-description animate-fade-up animation-delay-200">
            Prenajmite si profesionálny tepovací stroj a ušetrite až 70% oproti profesionálnym službám. Jednoducho, rýchlo a za zlomok ceny.
        </p>
        
        <div class="hero-buttons animate-fade-up animation-delay-300">
            <a href="#cennik" class="btn btn-primary">Rezervovať teraz</a>
            <a href="#postup" class="btn btn-outline">Ako to funguje?</a>
        </div>
        
        <div class="hero-stats animate-fade-up animation-delay-400">
            <div class="hero-stat">
                <div class="hero-stat-value">70%</div>
                <div class="hero-stat-label">Úspora nákladov</div>
            </div>
            <div class="hero-stat">
                <div class="hero-stat-value">500+</div>
                <div class="hero-stat-label">Spokojných zákazníkov</div>
            </div>
            <div class="hero-stat">
                <div class="hero-stat-value">4.9★</div>
                <div class="hero-stat-label">Hodnotenie</div>
            </div>
        </div>
    </div>
</section>

<!-- Benefits Section -->
<section class="section section-light" id="vyhody">
    <div class="container">
        <div class="section-header">
            <span class="section-badge">Výhody</span>
            <h2 class="section-title">Prečo si prenajať tepovač?</h2>
            <p class="section-description">Objavte výhody profesionálneho čistenia bez profesionálnych cien</p>
        </div>
        
        <div class="benefits-grid">
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>
                </div>
                <h3 class="benefit-title">Ušetríte až 70%</h3>
                <p class="benefit-description">Profesionálne tepovanie stojí 50-100€. U nás od 20€ vyčistíte celý byt sami.</p>
            </div>
            
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <h3 class="benefit-title">Čistíte kedy chcete</h3>
                <p class="benefit-description">Žiadne čakanie na termín. Prenájom si vyberiete podľa vášho rozvrhu.</p>
            </div>
            
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                </div>
                <h3 class="benefit-title">Profesionálny výsledok</h3>
                <p class="benefit-description">Rovnaké stroje ako používajú profesionáli. Rozdiel uvidíte okamžite.</p>
            </div>
            
            <div class="benefit-card">
                <div class="benefit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path></svg>
                </div>
                <h3 class="benefit-title">Podpora a poradenstvo</h3>
                <p class="benefit-description">Poradíme vám ako na to. Video návod a telefonická podpora v cene.</p>
            </div>
        </div>
    </div>
</section>

<!-- Process Section -->
<section class="section section-primary" id="postup">
    <div class="container">
        <div class="section-header">
            <span class="section-badge">Postup</span>
            <h2 class="section-title">Ako to funguje?</h2>
            <p class="section-description">Jednoduché 4 kroky k čistému domovu</p>
        </div>
        
        <div class="process-grid">
            <div class="process-step">
                <div class="process-number">1</div>
                <h3 class="process-title">Rezervujte online</h3>
                <p class="process-description">Vyberte si termín a dĺžku prenájmu cez náš rezervačný systém.</p>
            </div>
            
            <div class="process-step">
                <div class="process-number">2</div>
                <h3 class="process-title">Vyzdvihnite stroj</h3>
                <p class="process-description">Príďte si pre stroj na našu prevádzku alebo využite donášku.</p>
            </div>
            
            <div class="process-step">
                <div class="process-number">3</div>
                <h3 class="process-title">Čistite ako profík</h3>
                <p class="process-description">Použite stroj podľa návodu. Sme vám k dispozícii pre rady.</p>
            </div>
            
            <div class="process-step">
                <div class="process-number">4</div>
                <h3 class="process-title">Vráťte stroj</h3>
                <p class="process-description">Po skončení nám stroj vráťte a my vám vrátime zálohu.</p>
            </div>
        </div>
    </div>
</section>

<!-- Gallery Section -->
<section class="section" id="galeria">
    <div class="container">
        <div class="section-header">
            <span class="section-badge">Galéria</span>
            <h2 class="section-title">Pred a po</h2>
            <p class="section-description">Pozrite si reálne výsledky našich zákazníkov</p>
        </div>
        
        <div class="gallery-grid">
            <?php for ($i = 1; $i <= 6; $i++): ?>
            <div class="gallery-item">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/before-after-<?php echo $i; ?>.jpg" 
                     alt="Pred a po <?php echo $i; ?>">
            </div>
            <?php endfor; ?>
        </div>
    </div>
</section>

<!-- Pricing Section -->
<section class="section section-light" id="cennik">
    <div class="container">
        <div class="section-header">
            <span class="section-badge">Cenník</span>
            <h2 class="section-title">Jednoduché a transparentné ceny</h2>
            <p class="section-description">Vyberte si variant, ktorý vám vyhovuje</p>
        </div>
        
        <div class="pricing-grid">
            <!-- 4 Hour Package -->
            <div class="pricing-card">
                <div class="pricing-duration">4 hodiny</div>
                <div class="pricing-price">20€</div>
                <ul class="pricing-features">
                    <li class="pricing-feature">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Profesionálny tepovací stroj</span>
                    </li>
                    <li class="pricing-feature">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Čistiace prostriedky v cene</span>
                    </li>
                    <li class="pricing-feature">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Video návod</span>
                    </li>
                    <li class="pricing-feature">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Telefonická podpora</span>
                    </li>
                </ul>
                <a href="#amelia-booking-container" class="btn btn-sapphire">Rezervovať</a>
            </div>
            
            <!-- 8 Hour Package -->
            <div class="pricing-card featured">
                <div class="pricing-badge">Najobľúbenejšie</div>
                <div class="pricing-duration">8 hodín</div>
                <div class="pricing-price">35€</div>
                <ul class="pricing-features">
                    <li class="pricing-feature">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Profesionálny tepovací stroj</span>
                    </li>
                    <li class="pricing-feature">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Čistiace prostriedky v cene</span>
                    </li>
                    <li class="pricing-feature">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Video návod</span>
                    </li>
                    <li class="pricing-feature">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Telefonická podpora</span>
                    </li>
                    <li class="pricing-feature">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Viac času na dôkladné čistenie</span>
                    </li>
                </ul>
                <a href="#amelia-booking-container" class="btn btn-primary">Rezervovať</a>
            </div>
        </div>
        
        <!-- Additional Info -->
        <div class="pricing-info">
            <h4 class="pricing-info-title">Dôležité informácie</h4>
            <ul class="pricing-info-list">
                <li class="pricing-info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                    <span><strong>Záloha:</strong> 200€ v hotovosti (vrátená pri odovzdaní stroja)</span>
                </li>
                <li class="pricing-info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                    <span><strong>Donáška:</strong> +10€ v rámci Bratislavy</span>
                </li>
                <li class="pricing-info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                    <span><strong>Miesto vyzdvihnutia:</strong> <?php echo esc_html(tepovac_get_option('tepovac_address', 'Námestie Hraničiarov 35, Bratislava - Petržalka')); ?></span>
                </li>
            </ul>
        </div>
        
        <!-- Amelia Booking Container -->
        <div id="amelia-booking-container">
            <!-- Tu vložte Amelia shortcode: [ameliabooking] alebo [ameliaevents] -->
            <?php echo do_shortcode('[ameliabooking]'); ?>
        </div>
    </div>
</section>

<!-- Reviews Section -->
<section class="section section-primary" id="recenzie">
    <div class="container">
        <div class="section-header">
            <span class="section-badge">Recenzie</span>
            <h2 class="section-title">Čo hovoria naši zákazníci</h2>
            <p class="section-description">Prečítajte si skúsenosti spokojných zákazníkov</p>
        </div>
        
        <div class="reviews-grid">
            <div class="review-card">
                <div class="review-stars">
                    <?php for ($i = 0; $i < 5; $i++): ?>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <?php endfor; ?>
                </div>
                <p class="review-text">"Výborná služba! Stroj fungoval perfektne a výsledky boli úžasné. Sedačka vyzerá ako nová. Určite využijem znova."</p>
                <div class="review-author">
                    <div class="review-avatar">MK</div>
                    <div>
                        <div class="review-name">Mária K.</div>
                        <div class="review-location">Bratislava</div>
                    </div>
                </div>
            </div>
            
            <div class="review-card">
                <div class="review-stars">
                    <?php for ($i = 0; $i < 5; $i++): ?>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <?php endfor; ?>
                </div>
                <p class="review-text">"Ušetril som viac ako 60€ oproti profesionálnej službe. Návod bol jednoduchý a podpora veľmi ochotná."</p>
                <div class="review-author">
                    <div class="review-avatar">PN</div>
                    <div>
                        <div class="review-name">Peter N.</div>
                        <div class="review-location">Petržalka</div>
                    </div>
                </div>
            </div>
            
            <div class="review-card">
                <div class="review-stars">
                    <?php for ($i = 0; $i < 5; $i++): ?>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <?php endfor; ?>
                </div>
                <p class="review-text">"Vyčistil som celý koberec v obývačke za 4 hodiny. Stroj je veľmi jednoduchý na ovládanie, aj keď som to robil prvýkrát."</p>
                <div class="review-author">
                    <div class="review-avatar">JH</div>
                    <div>
                        <div class="review-name">Ján H.</div>
                        <div class="review-location">Ružinov</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- FAQ Section -->
<section class="section section-light" id="faq">
    <div class="container">
        <div class="section-header">
            <span class="section-badge">FAQ</span>
            <h2 class="section-title">Často kladené otázky</h2>
            <p class="section-description">Odpovede na najčastejšie otázky</p>
        </div>
        
        <div class="faq-list">
            <div class="faq-item">
                <button class="faq-question">
                    Aký typ tepovača prenajímate?
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div class="faq-answer">
                    <p>Prenajímame profesionálne extrakčné čističe typu Kärcher, ktoré používajú aj profesionálne čistiace firmy. Stroje sú pravidelne servisované a dezinfikované.</p>
                </div>
            </div>
            
            <div class="faq-item">
                <button class="faq-question">
                    Čo všetko je zahrnuté v cene?
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div class="faq-answer">
                    <p>V cene je zahrnutý tepovací stroj, dostatočné množstvo profesionálneho čistiaceho prostriedku, video návod a telefonická podpora počas celého prenájmu.</p>
                </div>
            </div>
            
            <div class="faq-item">
                <button class="faq-question">
                    Ako dlho trvá vyčistenie?
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div class="faq-answer">
                    <p>Záleží od veľkosti a znečistenia. Bežná sedačka trvá cca 30-60 minút. Na 4-izbový byt s kobercami počítajte 3-4 hodiny. Pre väčšie priestory odporúčame 8-hodinový prenájom.</p>
                </div>
            </div>
            
            <div class="faq-item">
                <button class="faq-question">
                    Potrebujem nejaké skúsenosti?
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div class="faq-answer">
                    <p>Nie, stroj je veľmi jednoduchý na ovládanie. Pri odovzdaní vám všetko vysvetlíme a poskytneme video návod. V prípade otázok sme vám k dispozícii telefonicky.</p>
                </div>
            </div>
            
            <div class="faq-item">
                <button class="faq-question">
                    Aká je záloha a prečo ju vyžadujete?
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div class="faq-answer">
                    <p>Záloha je 200€ v hotovosti. Slúži ako poistka pre prípad poškodenia stroja. Pri vrátení nepoškodeného stroja vám celú zálohu okamžite vrátime.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
