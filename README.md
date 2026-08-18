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
