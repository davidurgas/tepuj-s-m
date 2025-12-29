# Tepovac Rental - WordPress Šablóna

Profesionálna WordPress šablóna pre prenájom tepovacích strojov.

## Inštalácia

1. **Stiahnite šablónu** - Stiahnite celý priečinok `wordpress-theme`
2. **Premenujte priečinok** na `tepovac-rental`
3. **Nahrajte do WordPress** - Nahrajte priečinok do `/wp-content/themes/`
4. **Aktivujte šablónu** - V administrácii: Vzhľad → Šablóny → Tepovac Rental → Aktivovať

## Potrebné obrázky

Do priečinka `assets/images/` nahrajte:
- `logo.png` - Logo vašej firmy
- `hero-image.jpg` - Hlavný obrázok v hero sekcii
- `before-after-1.jpg` až `before-after-6.jpg` - Obrázky pred/po

## Nastavenia v Customizeri

V administrácii prejdite na **Vzhľad → Prispôsobiť**:

### Kontaktné údaje
- Telefónne číslo
- Email
- Adresa
- WhatsApp číslo (bez +)

### Hero sekcia
- Obrázok na pozadí (voliteľne - ak nenastavíte, použije sa `hero-image.jpg`)

### Logo
- V sekcii "Identita webu" môžete nahrať vlastné logo

## Amelia Booking Integrácia

Šablóna obsahuje pripravený kontajner pre Amelia plugin. V súbore `index.php` nájdete:

```php
<div id="amelia-booking-container">
    <?php echo do_shortcode('[ameliabooking]'); ?>
</div>
```

Môžete zmeniť shortcode podľa potreby:
- `[ameliabooking]` - Základný rezervačný formulár
- `[ameliaevents]` - Zoznam eventov
- `[ameliacatalog]` - Katalóg služieb

## Štruktúra súborov

```
tepovac-rental/
├── style.css          # Hlavné štýly + informácie o téme
├── functions.php      # Funkcie témy a nastavenia
├── header.php         # Hlavička s navigáciou
├── footer.php         # Pätička s kontaktmi
├── index.php          # Hlavná stránka so všetkými sekciami
├── assets/
│   ├── js/
│   │   └── main.js    # JavaScript pre interaktivitu
│   └── images/        # Obrázky (musíte nahrať vlastné)
│       ├── logo.png
│       ├── hero-image.jpg
│       └── before-after-*.jpg
└── README.md          # Tento súbor
```

## Farby

Šablóna používa nasledujúcu farebnú paletu:
- **Sapphire (hlavná):** #0A2342
- **Cyan (akcentová):** #00D2E6
- **Charcoal (text):** #2E2E2E

## Podpora

Pre otázky a podporu kontaktujte autora šablóny.

## Licencia

GNU General Public License v2 or later
