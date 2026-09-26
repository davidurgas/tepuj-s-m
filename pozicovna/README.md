# Požičovňa tepovačov – administrácia

Webová appka do mobilu na požičiavanie tepovacích strojov. Beží na tvojom
serveri, v telefóne ju otvoríš v prehliadači (a uložíš si ju na plochu ako ikonu).

## Ako to funguje

**Odovzdanie stroja**

1. **Nové požičanie** → odfotíš občiansky zákazníka z **oboch strán**.
2. Appka priamo v telefóne prečíta údaje z OP (meno, priezvisko, dátum
   narodenia, číslo OP, platnosť, rodné číslo, adresu). Údaje zo strojového
   kódu na zadnej strane (`IDSVK…<<<`) overí kontrolnými číslicami.
3. Skontroluješ údaje, doplníš **email a telefón**, vyberieš stroj, cenu
   a dátum vrátenia.
4. Zákazníkovi dáš telefón – prečíta si zmluvu, zaškrtne súhlas
   a **podpíše sa prstom**.
5. Vyberieš **nájomné + zálohu 100 €** v hotovosti a ťukneš *Zákazník zaplatil*.
6. Zákazníkovi príde **email s PDF zmluvou** (s oboma podpismi) a
   **potvrdením o prijatí nájomného a zálohy**.

**Vrátenie stroja**

1. V zozname otvoríš požičanie → *Zákazník vracia stroj*.
2. Zaškrtneš *Stroj je kompletný, funkčný a nepoškodený* (alebo popíšeš
   problém a znížiš vrátenú zálohu).
3. Zákazník sa podpíše, že vracia stroj a prebral zálohu.
4. Zákazníkovi príde **email s preberacím protokolom** o vrátení stroja
   a zálohy.

Fotky OP, podpisy aj PDF dokumenty zostávajú uložené pri každom požičaní
(pre prípad sporu). Zoznam ukazuje, čo je požičané, čo je po termíne a čo
už je vrátené; dá sa v ňom hľadať podľa mena, telefónu či čísla zmluvy.

## Demo bez servera

`node scripts/build-demo.mjs` zostaví do `dist-demo/` verziu s ukážkovými
dátami, ktorá beží celá v prehliadači (nič sa neukladá ani neodosiela).

## Rýchlosť

- OCR sa načíta hneď pri otvorení sprievodcu, kým fotíš; čítanie OP potom
  trvá 1–3 sekundy a strojový kód aj text sa čítajú naraz.
- Fotky sa pred nahratím zmenšia, server posiela súbory komprimované
  a appka sa cez service worker otvára z cache (aj pri slabom signáli).

## Prvé spustenie

Potrebuješ **Node.js 22.13+**.

```bash
cd pozicovna
npm install
cp .env.example .env     # a vyplň heslo + SMTP (email)
npm start                # http://localhost:3000
```

Po prihlásení choď do **Nastavení** (ozubené koliesko):

- vyplň údaje firmy (tie sú v zmluve ako prenajímateľ),
- **raz sa podpíš** – tvoj podpis sa vkladá do každej zmluvy,
- pridaj svoje stroje (názov, výrobné číslo, príslušenstvo),
- skontroluj cenu, zálohu (predvolene 100 €) a poplatok za omeškanie,
- pošli si **testovací email**.

### Email

Emaily idú cez SMTP – stačí bežná firemná schránka (Websupport, Webglobe,
Gmail s „heslom aplikácie“ atď.). Údaje sa vypĺňajú v `.env`
(`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`).
S `MAIL_BCC` ti príde kópia každého emailu. Ak email neodíde (napr. preklep
v adrese), dokument sa aj tak uloží a v detaile ho odošleš znova.

## Nasadenie na internet

Appka potrebuje server s **trvalým diskom** (ukladá databázu a fotky do
priečinka `DATA_DIR`) a **HTTPS**. Možnosti:

- **VPS** (napr. Hetzner, Websupport VPS): `npm ci && npm start` za
  reverznou proxy (Caddy / nginx) s HTTPS, spúšťané cez `pm2` alebo systemd.
- **Docker** (Railway, Render, Fly.io …): priložený `Dockerfile`, pripoj
  trvalý disk (volume) na `/data` a nastav premenné prostredia z `.env.example`.

**Priečinok s dátami pravidelne zálohuj** – sú v ňom zmluvy aj kópie OP.

## Čítanie OP (OCR)

OCR beží priamo v telefóne (Tesseract.js). Fotky OP sa kvôli čítaniu
neposielajú žiadnej tretej strane – nahrajú sa iba na tvoj server.
Prvé čítanie po otvorení appky trvá dlhšie (sťahujú sa jazykové dáta ~15 MB),
potom je to pár sekúnd.

Tipy pre najlepší výsledok: OP polož na tmavú podložku, foť zhora, celý
v zábere, bez odleskov a ostro. Údaje vždy skontroluj – pri nečitateľnej
fotke ich appka označí a dajú sa doplniť ručne.

## Dôležité právne poznámky

- **Text zmluvy je vzor** – pred ostrým použitím si ho daj skontrolovať
  (napr. účtovníkovi / právnikovi). Nájdeš ho v `public/js/contract.js`,
  doplňujúce podmienky sa dajú pridať aj v Nastaveniach.
- **Kópia OP**: podľa § 78 ods. 6 zákona č. 18/2018 Z. z. môžeš kopírovať
  doklad len so súhlasom zákazníka – preto zákazník pred podpisom
  zaškrtáva súhlas a je aj v texte zmluvy. Dáta uchovávaj len nevyhnutne
  dlho; staré záznamy vymažeš v detaile požičania.
- **eKasa**: prijatie nájomného v hotovosti je tržba – potvrdenie v appke
  **nenahrádza** pokladničný doklad z eKasy, ak ho máš povinnosť vydávať.
  Vratná záloha (zábezpeka) tržbou nie je.

## Štruktúra

```
server/index.js    API, prihlásenie, ukladanie súborov
server/db.js       SQLite databáza (vstavaná v Node) a nastavenia
server/pdf.js      generovanie PDF zmluvy a preberacieho protokolu
server/mail.js     emaily zákazníkovi
public/js/app.js   mobilná appka (zoznam, sprievodca, vrátenie, nastavenia)
public/js/ocr.js   čítanie OP v prehliadači
public/js/mrz.js   parsovanie strojového kódu OP (+ testy v test/)
public/js/contract.js  text zmluvy a protokolu (appka aj PDF)
```

Testy: `npm test`
