# Rep — tréningový denník

Jednoduchá appka na silový tréning. Vytvoríš si **tréningový plán** s cvikmi
a opakovaniami, počas tréningu už len **zapisuješ váhy na sériách** a sleduješ
**progres vo váhach**. Všetko beží v prehliadači (aj na mobile) a dáta sa
ukladajú priamo v zariadení — netreba účet ani internet.

## Čo appka vie

- **Plány** – vytvor si zostavy cvikov (napr. Push / Pull / Nohy), pri každom
  cviku nastavíš počet sérií a cieľové opakovania. Cviky sa dajú presúvať,
  mazať a plány duplikovať.
- **Tréning** – vyberieš plán a už len klopeš váhy a opakovania po sériách.
  Ťuknutím na ✓ označíš sériu ako hotovú.
- **Oddychový časovač** – po označení série sa automaticky spustí odpočet
  medzi sériami (60/90/120/180 s), s tlačidlami ±15 s, pauzou, pípnutím
  a vibráciou na mobile.
- **„Minule si dal…"** – pri každom cviku vidíš svoj posledný výkon ako
  referenciu, aby si vedel, kam pridať.
- **Živé štatistiky počas tréningu** – objem (váha × opakovania), počet sérií
  a opakovaní sa počítajú priebežne.
- **Progres** – grafy pre každý cvik v čase: **odhad maximálky (1RM)**,
  najťažšia séria a objem, plus percentuálny trend.
- **Osobné rekordy** – najlepší odhadovaný 1RM pre každý cvik.
- **História tréningov** s rozkliknutím detailu jednotlivých sérií.
- **Prehľad** – rýchly štart, séria dní (streak), tréningy za týždeň,
  celkový nadvihnutý objem.
- **Záloha / obnova** dát do JSON súboru.
- **Svetlý aj tmavý režim** podľa nastavenia systému.

## Odhad maximálky (1RM)

Používa sa Epleyho vzorec: `1RM ≈ váha × (1 + opakovania / 30)`. Je to
odhad — reálna jednorázová maximálka sa môže líšiť, ale na sledovanie
progresu je spoľahlivý.

## Kde sa ukladajú dáta

Lokálne v prehliadači (`localStorage`) daného zariadenia. Neposielajú sa nikam.
Ak chceš dáta preniesť inam alebo zálohovať, použi **Progres → Nastavenia →
Zálohovať** (stiahne JSON) a na druhom zariadení **Obnoviť**.

## Technológie

Vite · React · TypeScript · Tailwind CSS · shadcn/ui · Recharts · lucide-react

## Spustenie

```bash
bun install      # alebo: npm install
bun run dev      # vývojový server
bun run build    # produkčný build
bun run preview  # náhľad buildu
```

Hlavné súbory:

- `src/App.tsx` – routovanie
- `src/pages/workout/` – obrazovky (Prehľad, Plány, Editor plánu, Tréning, Progres)
- `src/components/workout/` – layout, oddychový časovač
- `src/lib/workout/` – dátový model, výpočty (1RM, objem, rekordy), ukladanie

## 📱 Náhľad na mobile (cez Wi-Fi)

1. Na počítači (potrebuješ **Node.js 18+** a **Git**) stiahni projekt:

   ```bash
   git clone -b claude/workout-app-training-plan-2s5zf7 https://github.com/davidurgas/tepuj-s-m.git
   cd tepuj-s-m
   npm install
   npm run dev -- --host
   ```

2. Vite vypíše dve adresy, napr.:

   ```
   ➜  Local:   http://localhost:8080/
   ➜  Network: http://192.168.0.15:8080/     <-- túto otvor v mobile
   ```

3. Na telefóne (na **rovnakej Wi-Fi**) otvor tú **Network** adresu. Appku si
   môžeš cez „Pridať na plochu" uložiť ako ikonu a spúšťať na celú obrazovku.
