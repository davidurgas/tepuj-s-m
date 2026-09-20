<?php
/**
 * Template Name: Požičajtepovač – Landing
 * Description: One-page landing pre pozicajtepovac.sk (prenájom tepovačov v Bratislave).
 *              Ručne písaný HTML/CSS/JS. Rezervačný blok využíva plugin Amelia Booking.
 *
 * Nasadenie:
 *   1. Skopíruj priečinok `pozicajtepovac/` (s podpriečinkom assets/) do koreňa aktívnej témy,
 *      napr. wp-content/themes/tvoja-tema/pozicajtepovac/
 *   2. Tento súbor ulož do koreňa témy ako page-pozicajtepovac.php
 *   3. (Voliteľné) Vlož obsah functions-snippet.php do functions.php témy.
 *   4. Vo WP admin vytvor stránku a v „Atribúty stránky → Šablóna" zvoľ
 *      „Požičajtepovač – Landing". Nastav ju ako titulnú stránku (Nastavenia → Čítanie).
 *   5. V rezervačnom bloku uprav shortcode podľa svojich Amelia služieb (pozri README.md).
 *
 * @package Pozicajtepovac
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

// --- Cesta k assetom v rámci témy ---
$pt_uri = get_stylesheet_directory_uri() . '/pozicajtepovac/assets';

// --- Zaraď CSS/JS a preconnect pre fonty (beží na wp_head/wp_footer) ---
add_action( 'wp_enqueue_scripts', function () use ( $pt_uri ) {
	wp_enqueue_style(
		'pt-fonts',
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap',
		array(),
		null
	);
	wp_enqueue_style( 'pt-style', $pt_uri . '/css/style.css', array( 'pt-fonts' ), '1.0.0' );
	wp_enqueue_script( 'pt-script', $pt_uri . '/js/script.js', array(), '1.0.0', true );
} );

// --- JSON-LD (LocalBusiness + Product/Offer + FAQPage) do <head> ---
add_action( 'wp_head', function () {
	$home = home_url( '/' );
	?>
	<meta name="description" content="Prenájom profesionálneho tepovača v Bratislave. 24 hodín za 30 €, celý víkend za 50 € vrátane čistiacej chémie. Dovoz po Bratislave 10 €, osobný odber zadarmo. Rezervuj online." />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="sk_SK" />
	<meta property="og:title" content="Požičovňa tepovačov Bratislava | Prenájom od 30 €" />
	<meta property="og:description" content="Požičaj si profesionálny tepovač v Bratislave. 30 € / 24 h, 50 € / víkend, chémia v cene. Dovoz 10 € alebo osobný odber zadarmo." />
	<meta property="og:url" content="<?php echo esc_url( $home ); ?>" />
	<meta property="og:image" content="<?php echo esc_url( get_stylesheet_directory_uri() . '/pozicajtepovac/assets/img/og-image.jpg' ); ?>" />
	<script type="application/ld+json">
	{
	  "@context": "https://schema.org",
	  "@type": "LocalBusiness",
	  "name": "POŽIČAJTEPOVAČ.sk",
	  "description": "Požičovňa profesionálnych tepovačov v Bratislave.",
	  "url": "<?php echo esc_js( $home ); ?>",
	  "telephone": "+421900123456",
	  "priceRange": "30 € – 50 €",
	  "currenciesAccepted": "EUR",
	  "paymentAccepted": "Hotovosť, Platobná karta, Online platba",
	  "areaServed": { "@type": "City", "name": "Bratislava" },
	  "address": { "@type": "PostalAddress", "addressLocality": "Bratislava", "addressRegion": "Bratislavský kraj", "addressCountry": "SK" }
	}
	</script>
	<script type="application/ld+json">
	{
	  "@context": "https://schema.org",
	  "@type": "Product",
	  "name": "Prenájom profesionálneho tepovača v Bratislave",
	  "brand": { "@type": "Brand", "name": "POŽIČAJTEPOVAČ.sk" },
	  "areaServed": "Bratislava",
	  "offers": [
	    { "@type": "Offer", "name": "Prenájom tepovača na 24 hodín", "price": "30", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
	    { "@type": "Offer", "name": "Víkendový prenájom tepovača", "price": "50", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" }
	  ]
	}
	</script>
	<script type="application/ld+json">
	{
	  "@context": "https://schema.org",
	  "@type": "FAQPage",
	  "mainEntity": [
	    { "@type": "Question", "name": "Ako funguje vratná kaucia 100 €?", "acceptedAnswer": { "@type": "Answer", "text": "Pri prevzatí tepovača skladáte vratnú zálohu 100 € v hotovosti alebo autorizáciou na karte. Po vrátení funkčného a vyčisteného stroja vám ju vrátime okamžite a v plnej výške." } },
	    { "@type": "Question", "name": "Ako dlho schne sedačka po vytepovaní?", "acceptedAnswer": { "@type": "Answer", "text": "Bežná sedačka schne približne 4 až 8 hodín podľa materiálu a vetrania." } },
	    { "@type": "Question", "name": "Čo ak som ešte nikdy netepoval?", "acceptedAnswer": { "@type": "Answer", "text": "Pri odovzdaní stroja vás počas 2-minútového predvedenia naučíme všetko potrebné. Tepovanie zvládne každý." } },
	    { "@type": "Question", "name": "Ako funguje dovoz za 10 €?", "acceptedAnswer": { "@type": "Answer", "text": "Za paušálnych 10 € tepovač privezieme kamkoľvek v Bratislave a po skončení prenájmu ho vyzdvihneme. Osobný odber je zadarmo." } }
	  ]
	}
	</script>
	<?php
} );

get_header();
?>

<a class="skip-link" href="#hero">Preskočiť na obsah</a>

<header class="site-header" id="site-header">
	<div class="container header__inner">
		<a href="#hero" class="brand" aria-label="POŽIČAJTEPOVAČ.sk – domov">
			<span class="brand__logo" aria-hidden="true">
				<img src="<?php echo esc_url( $pt_uri . '/img/favicon.svg' ); ?>" width="32" height="32" alt="" />
			</span>
			<span class="brand__name">POŽIČAJTEPOVAČ<span class="brand__tld">.sk</span></span>
		</a>
		<div class="header__meta">
			<span class="header__location">📍 Bratislava</span>
			<a href="tel:+421900123456" class="header__phone">📞 0900 123 456</a>
			<a href="#rezervacia" class="btn btn--cta btn--sm header__cta">Rezervovať online</a>
		</div>
		<button class="nav-toggle" id="nav-toggle" aria-label="Otvoriť menu" aria-expanded="false" aria-controls="mobile-nav">
			<span></span><span></span><span></span>
		</button>
	</div>
	<nav class="mobile-nav" id="mobile-nav" aria-label="Mobilná navigácia">
		<a href="#ako-to-funguje">Ako to funguje</a>
		<a href="#cennik">Cenník</a>
		<a href="#lokalita">Lokalita</a>
		<a href="#faq">Časté otázky</a>
		<a href="tel:+421900123456" class="mobile-nav__phone">📞 0900 123 456</a>
		<a href="#rezervacia" class="btn btn--cta">Rezervovať online</a>
	</nav>
</header>

<main>
	<!-- HERO -->
	<section class="hero" id="hero">
		<div class="container hero__inner">
			<div class="hero__content">
				<p class="hero__eyebrow">📍 Rozvoz po celej Bratislave</p>
				<h1 class="hero__title">Požičaj si profesionálny tepovač v Bratislave</h1>
				<p class="hero__subtitle">Vyčisti si sedačku, auto či koberec sám za zlomok ceny tepovacej firmy. Profesionálny stroj až k tvojim dverám.</p>
				<ul class="hero__benefits">
					<li><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg> Chémia v cene</li>
					<li><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg> Inštruktáž za 2 minúty</li>
					<li><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg> Dovoz za 10 € alebo osobný odber zadarmo</li>
				</ul>
				<div class="hero__actions">
					<a href="#rezervacia" class="btn btn--cta btn--lg">Rezervovať online →</a>
					<a href="#cennik" class="btn btn--ghost btn--lg">Pozri cenník</a>
				</div>
				<p class="hero__trust">Od <strong>30 € / deň</strong> · Kaucia 100 € vrátená ihneď · Bez skrytých poplatkov</p>
			</div>
			<div class="hero__visual" aria-hidden="true">
				<svg viewBox="0 0 420 420" class="hero__illustration" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustrácia profesionálneho tepovača">
					<defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2C6FE0"/><stop offset="1" stop-color="#0F52BA"/></linearGradient></defs>
					<circle cx="210" cy="210" r="200" fill="#EAF1FE"/>
					<circle cx="210" cy="210" r="150" fill="#DCE9FD"/>
					<rect x="140" y="150" width="140" height="150" rx="22" fill="url(#g1)"/>
					<rect x="160" y="176" width="100" height="60" rx="12" fill="#fff" opacity="0.92"/>
					<circle cx="210" cy="206" r="20" fill="#FF5A36"/><circle cx="210" cy="206" r="9" fill="#fff"/>
					<rect x="168" y="256" width="84" height="14" rx="7" fill="#0B3E8C"/>
					<path d="M280 200c60 0 70 40 70 90" stroke="#0B3E8C" stroke-width="12" fill="none" stroke-linecap="round"/>
					<rect x="336" y="286" width="26" height="60" rx="10" fill="#FF5A36"/>
					<circle cx="110" cy="120" r="10" fill="#2C6FE0"/><circle cx="330" cy="120" r="7" fill="#FF5A36"/><circle cx="96" cy="300" r="8" fill="#2C6FE0"/>
				</svg>
				<div class="hero__badge">
					<span class="hero__badge-num">4.9</span>
					<span class="hero__badge-stars">★★★★★</span>
					<span class="hero__badge-label">spokojní zákazníci</span>
				</div>
			</div>
		</div>
	</section>

	<!-- FACT SHEET -->
	<section class="factsheet" aria-label="Rýchle fakty">
		<div class="container">
			<ul class="factsheet__grid">
				<li class="fact"><span class="fact__value">30 €</span><span class="fact__label">Prenájom na 24 hodín</span></li>
				<li class="fact fact--accent"><span class="fact__value">50 €</span><span class="fact__label">Celý víkend (piatok–pondelok)</span></li>
				<li class="fact"><span class="fact__value">10 €</span><span class="fact__label">Dovoz aj odvoz po Bratislave</span></li>
				<li class="fact"><span class="fact__value">100 €</span><span class="fact__label">Vratná kaucia (ihneď späť)</span></li>
			</ul>
		</div>
	</section>

	<!-- HOW IT WORKS -->
	<section class="section" id="ako-to-funguje">
		<div class="container">
			<header class="section__head">
				<p class="section__eyebrow">Jednoducho a rýchlo</p>
				<h2 class="section__title">Ako to funguje v 3 krokoch</h2>
				<p class="section__lead">Od rezervácie po čistú sedačku ťa delia len tri kroky.</p>
			</header>
			<ol class="steps">
				<li class="step"><span class="step__num">1</span><h3 class="step__title">Zvoľ si termín a odber</h3><p>Online si vyber deň a spôsob odberu – dovoz po Bratislave za 10 € alebo osobný odber zadarmo.</p></li>
				<li class="step"><span class="step__num">2</span><h3 class="step__title">Prevezmi stroj</h3><p>Pri prevzatí zložíš vratnú zálohu 100 € a absolvuješ 2-minútové predvedenie – ukážeme ti všetko potrebné.</p></li>
				<li class="step"><span class="step__num">3</span><h3 class="step__title">Vytepuj a vráť stroj</h3><p>Vytepuj svoj interiér a po odovzdaní funkčného stroja dostaneš zálohu 100 € ihneď späť.</p></li>
			</ol>
		</div>
	</section>

	<!-- PRICING -->
	<section class="section section--alt" id="cennik">
		<div class="container">
			<header class="section__head">
				<p class="section__eyebrow">Transparentné ceny</p>
				<h2 class="section__title">Vyber si balík prenájmu</h2>
				<p class="section__lead">Žiadne skryté poplatky. Čistiaca chémia je vždy v cene.</p>
			</header>
			<div class="pricing">
				<article class="plan">
					<header class="plan__head">
						<h3 class="plan__name">24 hodín</h3>
						<p class="plan__price"><span class="plan__amount">30 €</span><span class="plan__period">/ deň</span></p>
						<p class="plan__desc">Ideálne na jednu-dve miestnosti alebo pár sedačiek.</p>
					</header>
					<ul class="plan__features">
						<li>Profesionálny tepovač na 24 hodín</li>
						<li>Čistiaca chémia na 2–3 sedačky v cene</li>
						<li>Hubica na čalúnenie v cene</li>
						<li>2-minútové zaškolenie pri prevzatí</li>
						<li>Dovoz po BA 10 € / osobný odber zadarmo</li>
					</ul>
					<a href="#rezervacia" class="btn btn--outline btn--block">Rezervovať 24 h</a>
				</article>
				<article class="plan plan--featured">
					<span class="plan__badge">Najobľúbenejšie</span>
					<header class="plan__head">
						<h3 class="plan__name">Celý víkend</h3>
						<p class="plan__price"><span class="plan__amount">50 €</span><span class="plan__period">/ víkend</span></p>
						<p class="plan__desc">Od piatku poobedia do pondelka rána – najviac času na upratovanie.</p>
					</header>
					<ul class="plan__features">
						<li>Prenájom piatok poobede – pondelok ráno</li>
						<li><strong>Dvojitá dávka</strong> čistiacej chémie v cene</li>
						<li>Hubica na čalúnenie v cene</li>
						<li>2-minútové zaškolenie pri prevzatí</li>
						<li>Dovoz po BA 10 € / osobný odber zadarmo</li>
					</ul>
					<a href="#rezervacia" class="btn btn--cta btn--block">Rezervovať víkend</a>
				</article>
			</div>
			<p class="pricing__note">Ku každému prenájmu sa skladá vratná <strong>kaucia 100 €</strong> (hotovosť alebo autorizácia na karte), ktorú vraciame okamžite po vrátení funkčného a vyčisteného stroja.</p>
		</div>
	</section>

	<!-- RESERVATION (AMELIA) -->
	<section class="section section--booking" id="rezervacia">
		<div class="container">
			<header class="section__head">
				<p class="section__eyebrow">Online rezervácia</p>
				<h2 class="section__title">Rezervuj si tepovač</h2>
				<p class="section__lead">Vyber si termín, spôsob odberu a spôsob platby. Potvrdenie ti príde na e-mail.</p>
			</header>
			<div class="booking-box">
				<?php
				/**
				 * === AMELIA BOOKING ===
				 * Uprav shortcode podľa svojich služieb (ID v Amelia → Services).
				 * Príklady:
				 *   [ameliabooking]                                        // celý katalóg
				 *   [ameliabooking category=1]                             // kategória "Prenájom tepovačov"
				 *   [ameliastepbooking service=1]                         // priamo služba 24 h
				 * Podrobnosti v README.md.
				 */
				if ( shortcode_exists( 'ameliabooking' ) ) {
					echo do_shortcode( '[ameliabooking]' );
				} else {
					?>
					<div class="booking-box__placeholder" id="amelia-placeholder">
						<svg class="ico ico--lg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
						<h3>Rezervačný kalendár</h3>
						<p>Aktivuj plugin <strong>Amelia Booking</strong> a nahraď shortcode v šablóne. Dovtedy sa zobrazuje tento náhradný blok.</p>
						<a href="tel:+421900123456" class="btn btn--cta btn--lg">Rezervovať telefonicky: 0900 123 456</a>
						<p class="booking-box__hint">⚠️ Pri prevzatí stroja sa skladá vratná kaucia <strong>100 €</strong>.</p>
					</div>
					<?php
				}
				?>
			</div>
		</div>
	</section>

	<!-- LOCALITY -->
	<section class="section" id="lokalita">
		<div class="container">
			<header class="section__head">
				<p class="section__eyebrow">Kde pôsobíme</p>
				<h2 class="section__title">Rozvoz po celej Bratislave</h2>
				<p class="section__lead">Tepovač privezieme do všetkých mestských častí Bratislavy za paušálnych 10 €.</p>
			</header>
			<ul class="districts">
				<li>Staré Mesto</li><li>Ružinov</li><li>Petržalka</li><li>Nové Mesto</li>
				<li>Karlova Ves</li><li>Dúbravka</li><li>Rača</li><li>Vrakuňa</li>
				<li>Podunajské Biskupice</li><li>Devínska Nová Ves</li><li>Lamač</li><li>Vajnory</li>
			</ul>
			<p class="districts__note">Osobný odber v Bratislave je vždy <strong>zadarmo</strong>.</p>
		</div>
	</section>

	<!-- FAQ -->
	<section class="section section--alt" id="faq">
		<div class="container container--narrow">
			<header class="section__head">
				<p class="section__eyebrow">Máš otázky?</p>
				<h2 class="section__title">Často kladené otázky</h2>
			</header>
			<div class="faq" id="faq-list">
				<div class="faq__item">
					<button class="faq__q" aria-expanded="false" aria-controls="faq-a1" id="faq-q1"><span>Ako funguje vratná kaucia 100 €?</span><svg class="faq__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
					<div class="faq__a" id="faq-a1" role="region" aria-labelledby="faq-q1" hidden><p>Pri prevzatí tepovača skladáte vratnú zálohu 100 € v hotovosti alebo autorizáciou na platobnej karte. Slúži len ako záruka za stroj. Po vrátení funkčného a vyčisteného tepovača vám ju vrátime <strong>okamžite a v plnej výške</strong>.</p></div>
				</div>
				<div class="faq__item">
					<button class="faq__q" aria-expanded="false" aria-controls="faq-a2" id="faq-q2"><span>Ako dlho schne sedačka po vytepovaní?</span><svg class="faq__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
					<div class="faq__a" id="faq-a2" role="region" aria-labelledby="faq-q2" hidden><p>Bežná sedačka schne približne <strong>4 až 8 hodín</strong> podľa materiálu a vetrania. Ak necháte v miestnosti prúdiť vzduch alebo mierne prikúrite, uschne rýchlejšie.</p></div>
				</div>
				<div class="faq__item">
					<button class="faq__q" aria-expanded="false" aria-controls="faq-a3" id="faq-q3"><span>Čo ak som ešte nikdy netepoval?</span><svg class="faq__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
					<div class="faq__a" id="faq-a3" role="region" aria-labelledby="faq-q3" hidden><p>Nič sa nedeje. Pri odovzdaní stroja vás počas <strong>2-minútového predvedenia</strong> naučíme všetko potrebné. Tepovanie zvládne naozaj každý.</p></div>
				</div>
				<div class="faq__item">
					<button class="faq__q" aria-expanded="false" aria-controls="faq-a4" id="faq-q4"><span>Ako funguje dovoz za 10 €?</span><svg class="faq__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
					<div class="faq__a" id="faq-a4" role="region" aria-labelledby="faq-q4" hidden><p>Za paušálnych <strong>10 €</strong> vám tepovač privezieme kamkoľvek v rámci Bratislavy a po skončení prenájmu ho zase vyzdvihneme. Ak si stroj vyzdvihnete osobne, doprava je úplne <strong>zadarmo</strong>.</p></div>
				</div>
			</div>
		</div>
	</section>

	<!-- FINAL CTA -->
	<section class="cta-band">
		<div class="container cta-band__inner">
			<h2 class="cta-band__title">Pripravený vyčistiť si domov?</h2>
			<p class="cta-band__text">Rezervuj si tepovač už dnes – od 30 € na celý deň, chémia v cene.</p>
			<a href="#rezervacia" class="btn btn--cta btn--lg">Rezervovať online →</a>
		</div>
	</section>
</main>

<footer class="site-footer">
	<div class="container footer__grid">
		<div class="footer__col">
			<a href="#hero" class="brand brand--footer"><span class="brand__name">POŽIČAJTEPOVAČ<span class="brand__tld">.sk</span></span></a>
			<p class="footer__about">Požičovňa profesionálnych tepovačov v Bratislave. Rýchlo, výhodne a bez starostí.</p>
			<p class="footer__contact"><a href="tel:+421900123456">📞 0900 123 456</a></p>
			<p class="footer__contact"><a href="mailto:info@pozicajtepovac.sk">✉️ info@pozicajtepovac.sk</a></p>
		</div>
		<div class="footer__col">
			<h3 class="footer__heading">Ceny</h3>
			<ul class="footer__list"><li>24 hodín — 30 €</li><li>Celý víkend — 50 €</li><li>Dovoz po Bratislave — 10 €</li><li>Osobný odber — zadarmo</li><li>Vratná kaucia — 100 €</li></ul>
		</div>
		<div class="footer__col">
			<h3 class="footer__heading">Navigácia</h3>
			<ul class="footer__list footer__list--links"><li><a href="#ako-to-funguje">Ako to funguje</a></li><li><a href="#cennik">Cenník</a></li><li><a href="#lokalita">Lokalita</a></li><li><a href="#faq">Časté otázky</a></li><li><a href="#rezervacia">Rezervácia</a></li></ul>
		</div>
	</div>
	<div class="container footer__bottom">
		<p>© <span id="year"><?php echo esc_html( date( 'Y' ) ); ?></span> POŽIČAJTEPOVAČ.sk — Všetky práva vyhradené.</p>
		<p class="footer__legal"><a href="<?php echo esc_url( home_url( '/obchodne-podmienky/' ) ); ?>">Obchodné podmienky</a> · <a href="<?php echo esc_url( home_url( '/ochrana-sukromia/' ) ); ?>">Ochrana súkromia</a></p>
	</div>
</footer>

<div class="mobile-cta">
	<a href="tel:+421900123456" class="mobile-cta__call">📞 Zavolať</a>
	<a href="#rezervacia" class="btn btn--cta mobile-cta__book">Rezervovať online</a>
</div>

<?php get_footer(); ?>
