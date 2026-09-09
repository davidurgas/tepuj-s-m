# Droply — demo eshop

Moderný, interaktívny demo eshop pre značku **Droply** — ekologické šumivé
čistiace tablety rozpustné vo vode. Menej plastu, menej miesta, žiadne ťahanie
litrov z obchodu — rovnaká čistota.

> ⚠️ Ide o **demo**. Platobná brána nie je aktívna; tlačidlo „Prejsť k pokladni“
> len simuluje objednávku.

## Čo eshop obsahuje

- **Hero** so živým vizuálom rozpúšťajúcej sa tablety vo vode.
- **Scroll efekt „Ako to funguje“** — pri scrollovaní sa tableta postupne
  rozpúšťa (sticky sekcia riadená pozíciou scrollu).
- **Výhody** (ekológia, úspora miesta, žiadne nosenie litrov, úspora peňazí…).
- **Interaktívna kalkulačka úspor** — koľko plastu, hmotnosti a peňazí ušetríš.
- **Porovnanie** klasické fľaše vs. Droply tablety.
- **Produkty** s pridávaním do košíka, hodnoteniami a indikátorom skladu.
- **Cenník / balíčky** s odpočtom uvádzacej ponuky (psychológia predaja:
  kotvenie cien, vzácnosť, urgentnosť, „najobľúbenejšia voľba“).
- **Ekologický dopad** s animovanými počítadlami.
- **Recenzie**, **FAQ**, **newsletter** so zľavovým kódom.
- **Košík (drawer)** s progresom „doprava zdarma“.

## 🎟️ Vernostný program (ako Rewardly)

Digitálna vernostná karta pre zákazníkov — celé to beží v prehliadači (demo bez
servera, dáta v `localStorage`).

- **Zákazník:** `/vernost` — založí si kartu, dostane vlastný **QR kód a ID**
  (`TS-XXXX`), zbiera **pečiatky**, vidí postup k odmene, upozornenia a tlačidlá
  „Pridať do peňaženky" a „Ohodnotiť na Google".
- **Personál:** `/vernost/admin` — nájde zákazníka (ID / meno / kontakt),
  **pridá pečiatku**, alebo po dokončení služby klikne **„Tepovanie hotové →
  požiadať o recenziu"**.
- **Pečiatky a odmena:** po `stampsPerReward` pečiatkach vznikne odmena; všetko
  sa nastavuje v `src/lib/loyalty-config.ts` (názov firmy, počet pečiatok,
  odmena, GPS prevádzky, Google Place ID).
- **Upozornenia:** používa **Web Notifications API** (personál ich povolí
  tlačidlom). Zobrazia sa pri pečiatke, odmene aj žiadosti o recenziu.
- **Google recenzia podľa polohy:** po tepovaní appka cez **geolokáciu** overí,
  či je zákazník blízko prevádzky (`place.radiusMeters`) a ponúkne priamy odkaz
  na napísanie recenzie (`googleReviewUrl()`).
- **Karta do telefónu:** QR kód + skratka na plochu (PWA). Natívny Apple/Google
  Wallet pas vyžaduje serverovú časť — pozri poznámku v dialógu „Pridať do
  peňaženky".

> Čo treba na **ostrú verziu**: databáza namiesto `localStorage`, serverové API
> pre pečiatky, reálny **web push** (service worker + VAPID) na upozornenia aj
> keď je appka zavretá, a podpísané **.pkpass / Google Wallet** pasy.

## Prvky psychológie predaja

Social proof (recenzie, hodnotenia), kotvenie (prečiarknuté ceny), vzácnosť
(stav skladu, „posledné kusy“), urgentnosť (odpočet), reciprocita (darček/zľava),
znižovanie rizika (30 dní na vrátenie, doprava zdarma) a decoy pricing v balíčkoch.

## Technológie

Vite · React · TypeScript · Tailwind CSS · shadcn/ui · lucide-react

## Spustenie

```bash
bun install      # alebo: npm install
bun run dev      # vývojový server
bun run build    # produkčný build
bun run preview  # náhľad buildu
```

Hlavná stránka: `src/pages/Index.tsx`. Sekcie eshopu: `src/components/droply/`.
Obsah (produkty, balíčky, recenzie, FAQ): `src/lib/droply-data.ts`.

## 📱 Náhľad na mobile (cez Wi-Fi)

1. Na počítači (potrebuješ nainštalované **Node.js 18+** a **Git**) stiahni projekt:

   ```bash
   git clone -b claude/droply-cleaning-tablets-eshop-cd0mxu https://github.com/davidurgas/tepuj-s-m.git
   cd tepuj-s-m
   npm install
   npm run dev -- --host
   ```

2. Vite vypíše dve adresy, napr.:

   ```
   ➜  Local:   http://localhost:8080/
   ➜  Network: http://192.168.0.15:8080/     <-- túto otvor v mobile
   ```

3. Na telefóne (pripojenom na **rovnakú Wi-Fi**) otvor tú **Network** adresu.

> Poznámky: počítač aj telefón musia byť na tej istej sieti. Pri prvom spustení
> môže Windows/macOS firewall vyžiadať povolenie pre Node.js — povoľ ho.
> Reálne fotky a video sa načítavajú z internetu, takže telefón musí byť online.

## Poznámka k médiám

Fotografie produktov a video rozpúšťania sú pre demo generované (AI) a načítavajú
sa z externého CDN — odkazy sú v `src/lib/droply-data.ts`. V ostrej verzii ich
nahraď vlastnými fotkami/videom (ideálne uloženými v `public/`).

## Nasadenie online (voliteľné)

Repozitár obsahuje workflow `.github/workflows/deploy-pages.yml` pre GitHub Pages.
Spustí sa iba manuálne. Najprv v **Settings → Pages** nastav *Source: „GitHub
Actions"* (súkromný repo vyžaduje GitHub Pro), potom **Actions → Deploy Droply
demo → Run workflow**. Web bude na `https://davidurgas.github.io/tepuj-s-m/`.
