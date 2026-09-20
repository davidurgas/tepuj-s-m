# POŽIČAJTEPOVAČ.sk — one-page landing

Ručne písaná (HTML5 / CSS3 / Vanilla JS) landing page pre bratislavskú službu
**prenájmu tepovačov**. Pripravená ako **vlastná WordPress page template** s
rezervačným blokom pre plugin **Amelia Booking**.

Bez ťažkých buildrov (žiadny Elementor), bez frameworkov — čistý statický kód,
mobile-first, optimalizovaný pre PageSpeed a pre AI/GEO vyhľadávače.

---

## 📁 Štruktúra

```
pozicajtepovac/
├── index.html                  # Statická verzia (otvor priamo v prehliadači / testovací náhľad)
├── assets/
│   ├── css/style.css           # Kompletné štýly (design tokens, mobile-first, Grid/Flexbox)
│   ├── js/script.js            # Sticky header, mobilné menu, FAQ accordion, smooth scroll
│   └── img/
│       ├── favicon.svg         # Logo / favicon (prepracovaný emblém s gradientom)
│       ├── og-image.svg        # Zdroj OpenGraph obrázka (editovateľný)
│       └── og-image.jpg        # Vyrenderovaný OG obrázok 1200×630 (pre sociálne siete)
│                               # (fotky Puzzi 8/1 sem doplníš sám – pozri sekciu Fotky nižšie)
├── wordpress/
│   ├── page-pozicajtepovac.php # WordPress page template (rovnaký obsah ako index.html)
│   └── functions-snippet.php   # Voliteľné optimalizácie do functions.php
└── README.md
```

> `index.html` a `page-pozicajtepovac.php` obsahujú **identický markup**.
> `index.html` slúži na rýchly náhľad/testovanie, `.php` je pre ostré WordPress nasadenie.

---

## 🎨 Dizajn (design tokens)

Všetko je riadené CSS premennými v `assets/css/style.css` (`:root`):

| Účel | Premenná | Hodnota |
|------|----------|---------|
| Primárna (kobaltová modrá) | `--c-primary` | `#0F52BA` |
| CTA (koralová/oranžová) | `--c-cta` | `#FF5A36` |
| Podklad (sivomodrá) | `--c-bg` | `#F8FAFC` |
| Text (bridlicová) | `--c-ink` | `#0F172A` |
| Sekundárny text | `--c-muted` | `#475569` |
| Rádius kariet | `--r-card` | `16px` |
| Rádius tlačidiel | `--r-btn` | `12px` |

Písmo: **Plus Jakarta Sans** (nadpisy) + **Inter** (text) z Google Fonts
(`display=swap`). Zmenu farieb/fontu urobíš na jednom mieste v `:root`.

---

## ⚡ Výkon & optimalizácia

- **Mobile-first CSS** — základné štýly pre mobil, `@media (min-width: …)` pre väčšie obrazovky.
- **Ovládanie jednou rukou** — sticky spodná CTA lišta na mobile, veľké dotykové ciele (44px+).
- **Ikony a logo sú inline SVG** (ostré na retine, nulové HTTP requesty). Logo je
  prepracovaný emblém s gradientom (hubica tepovača + kvapka), zdroj v `assets/img/favicon.svg`.
- **Fotky = miesta pre vlastné fotky (placeholdery).** Web NEobsahuje žiadne generické ani
  AI fotky. Hero aj galéria („Tepovač v akcii") sú prázdne, dizajnovo ladené sloty s popisom.
  **Vlož vlastné reálne fotky vášho Kärcher Puzzi 8/1 a výsledkov:**
  - Ulož fotky do `assets/img/` ako **WebP** (napr. `puzzi.webp`, `sedacka.webp`…).
  - V `index.html` / `page-pozicajtepovac.php` nahraď blok `<div class="photo-slot …">…</div>`
    tagom `<img src="assets/img/puzzi.webp" alt="…" loading="lazy" width="…" height="…">`
    (v HTML pri každom slote je príklad v komentári).
  - Fotky maj `loading="lazy"` + `width`/`height` (proti CLS); hero fotku daj `fetchpriority="high"`.
- **OG obrázok** (`og-image.jpg`) sa nenačítava návštevníkom (číta ho len scraper sociálnej siete).
- **JS `defer`** — skript sa načíta neblokujúco.
- **Preconnect/preload** pre Google Fonts.

Cieľ **PageSpeed 90+ na mobile** je pri tejto štruktúre reálne dosiahnuteľný;
po nasadení odporúčam zapnúť caching plugin (napr. WP Super Cache / LiteSpeed)
a CDN pre statické assety.

---

## 🔍 SEO / GEO (AI vyhľadávače)

- **Sémantické HTML5** — `H1` iba raz (hero), logická hierarchia `H2`/`H3`, `header`/`main`/`section`/`footer`/`nav`.
- **Faktická extrahovateľnosť** — všetky ceny (30 €, 50 €, 10 €, 100 €), lokalita (Bratislava)
  aj mestské časti sú **v statickom HTML texte**, nie v obrázkoch → čitateľné pre ChatGPT Search,
  Perplexity aj Google AI Overviews.
- **JSON-LD Schema** v `<head>`:
  - `LocalBusiness` (Bratislava, EUR, cenové rozpätie 30–50 €, telefón, otváracie hodiny),
  - `Product` + dve `Offer` (24 h = 30 €, víkend = 50 €),
  - `FAQPage` (4 otázky/odpovede — kaucia, schnutie, skúsenosti, dovoz).
- **Meta** — `title`, `meta description`, `canonical`, kompletné **OpenGraph** + Twitter cards,
  cielené na frázy *požičovňa tepovačov Bratislava*, *prenájom tepovača Bratislava*.

> V PHP šablóne sa JSON-LD a meta vypisujú cez `wp_head` hook. Ak používaš SEO plugin
> (Yoast / RankMath / SEOPress), nechaj **jeden** zdroj JSON-LD, aby sa schémy neduplikovali —
> buď plugin, alebo šablónu.

---

## 🚀 Nasadenie na WordPress

1. **Skopíruj priečinok** `pozicajtepovac/` (vrátane `assets/`) do koreňa aktívnej témy:
   `wp-content/themes/<tvoja-tema>/pozicajtepovac/`
   *(Odporúčam child-tému, aby update rodičovskej témy nič neprepísal.)*
2. **Skopíruj šablónu** `wordpress/page-pozicajtepovac.php` do koreňa témy ako
   `page-pozicajtepovac.php`.
3. *(Voliteľné)* Obsah `wordpress/functions-snippet.php` vlož do `functions.php` témy.
4. V administrácii: **Stránky → Pridať novú**, v pravom paneli
   **Atribúty stránky → Šablóna** zvoľ **„Požičajtepovač – Landing"**, publikuj.
5. **Nastavenia → Čítanie → Zobrazuje sa na titulnej stránke → Statická stránka**
   → vyber vytvorenú stránku.
6. Skontroluj, že sa načítavajú štýly (cesta k `assets/` je odvodená z
   `get_stylesheet_directory_uri()`).

---

## 📅 Konfigurácia pluginu Amelia Booking

Šablóna má vyhradenú sekciu `#rezervacia`. Ak je plugin aktívny, automaticky
vypíše `[ameliabooking]`; inak zobrazí náhradný blok s telefónnym CTA.

### 1. Služby (Amelia → Services)
Vytvor kategóriu napr. **„Prenájom tepovačov"** a v nej dve služby:

| Služba | Názov | Cena | Trvanie |
|--------|-------|------|---------|
| A | Prenájom na 24 hodín | **30 €** | 1 deň |
| B | Víkendový prenájom | **50 €** | pia–pon |

### 2. Doplnková služba – spôsob odberu (Amelia → Extras alebo Custom Fields)
Pridaj k obom službám **Extras** (alebo Custom Field typu výber):

| Možnosť | Cena |
|---------|------|
| Dovoz a odvoz po celej Bratislave | **+10 €** |
| Osobný odber v Bratislave | **+0 €** |

### 3. Platobné metódy (Amelia → Settings → Payments)
- **Platba kartou online** — zapni **Stripe** (vlož API kľúče).
- **Platba pri prevzatí** — zapni **On-site payment**.

### 4. Notifikačné e-maily (Amelia → Notifications)
Do šablóny **„Booking Approved / Confirmation"** vlož výrazné upozornenie, napr.:

> ⚠️ **DÔLEŽITÉ:** Pri prevzatí tepovača sa skladá **vratná kaucia 100 €**
> (v hotovosti alebo autorizáciou na platobnej karte). Kauciu vraciame okamžite
> po vrátení funkčného a vyčisteného stroja.

### 5. Vlož správny shortcode do šablóny
V `page-pozicajtepovac.php` (sekcia `#rezervacia`) uprav shortcode podľa svojich ID:

```php
echo do_shortcode( '[ameliabooking]' );                 // celý katalóg
// echo do_shortcode( '[ameliabooking category=1]' );    // len kategória tepovačov
// echo do_shortcode( '[ameliastepbooking service=1]' ); // priamo služba 24 h (step-by-step)
```
Reálne ID kategórie/služby nájdeš v Amelia → Services (v URL alebo v zozname).

---

## 🧪 Lokálny náhľad

Otvor `index.html` priamo v prehliadači, alebo spusti mini server:

```bash
cd pozicajtepovac
python3 -m http.server 8080
# → http://localhost:8080
```

Testované interakcie: sticky header, hamburger menu (mobil), FAQ accordion
(jedna otvorená naraz, ARIA `aria-expanded`), smooth scroll s offsetom na sticky header.
