export type Product = {
  id: string;
  name: string;
  tagline: string;
  /** kľúč ikony/farby v UI */
  theme: "kitchen" | "glass" | "bathroom" | "floor" | "universal" | "laundry";
  /** reálna fotografia produktu */
  image: string;
  /** poloha orezania fotky v štvorcovej karte */
  imagePosition?: string;
  price: number;
  /** pôvodná (prečiarknutá) cena — kotvenie / anchoring */
  compareAt: number;
  /** koľko fliaš nahradí jedno balenie (10 tabliet) */
  replacesBottles: number;
  scent: string;
  rating: number;
  reviews: number;
  /** simulovaná dostupnosť pre efekt vzácnosti */
  stock: number;
  badge?: string;
  bestseller?: boolean;
};

/** Reálne fotografie (Higgsfield CDN) — pre demo. V ostrej verzii nahradiť vlastnými. */
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3AhuqzP4VjgsdpfdOEJfJ1mDnzs";
const IMG = {
  universal: `${CDN}/hf_20260818_160205_83d992e0-bb23-4d57-8f4e-903f5efc0a0a.png`,
  kitchen: `${CDN}/hf_20260818_160205_4f8b438c-15dd-4e45-ac12-ae8d30d24aee.png`,
  glass: `${CDN}/hf_20260818_160206_b18f01e1-f024-4468-82c5-fd6ccd9f1849.png`,
  bathroom: `${CDN}/hf_20260818_160205_dd7bdbc6-250a-45ab-b153-c01d3ba7ad40.png`,
  floor: `${CDN}/hf_20260818_160206_4a8c5061-2834-46fe-be0d-0d8949234143.png`,
  laundry: `${CDN}/hf_20260818_160205_52111eb2-a24d-430c-aaa1-6d72f40e9c54.png`,
};

/** Reálne makro-video rozpúšťania tablety v čistiacej fľaši (Higgsfield CDN) — pozadie hero. */
export const DISSOLVE_VIDEO = `${CDN}/hf_20260818_160039_316f6083-5036-4f14-ae27-df8f17bd4a85.mp4`;

export const products: Product[] = [
  {
    id: "universal",
    name: "Univerzál",
    tagline: "Jedna tableta na (takmer) všetko v domácnosti",
    theme: "universal",
    image: IMG.universal,
    imagePosition: "center",
    price: 4.9,
    compareAt: 7.9,
    replacesBottles: 5,
    scent: "Sviežа bavlna",
    rating: 4.9,
    reviews: 1243,
    stock: 38,
    badge: "Bestseller",
    bestseller: true,
  },
  {
    id: "kitchen",
    name: "Kuchyňa",
    tagline: "Odmasťovač, ktorý si poradí aj s pripáleným tukom",
    theme: "kitchen",
    image: IMG.kitchen,
    price: 4.9,
    compareAt: 7.9,
    replacesBottles: 5,
    scent: "Citrus & limetka",
    rating: 4.8,
    reviews: 862,
    stock: 24,
    badge: "Silný odmasťovač",
  },
  {
    id: "glass",
    name: "Okná & Sklo",
    tagline: "Bez šmúh a bez rozprašovania litrov chémie",
    theme: "glass",
    image: IMG.glass,
    price: 4.5,
    compareAt: 6.9,
    replacesBottles: 6,
    scent: "Bez parfumu",
    rating: 4.9,
    reviews: 517,
    stock: 51,
    badge: "Bez šmúh",
  },
  {
    id: "bathroom",
    name: "Kúpeľňa",
    tagline: "Vodný kameň a mydlové usadeniny nemajú šancu",
    theme: "bathroom",
    image: IMG.bathroom,
    price: 4.9,
    compareAt: 7.9,
    replacesBottles: 5,
    scent: "Morský vánok",
    rating: 4.8,
    reviews: 634,
    stock: 12,
    badge: "Posledné kusy",
  },
  {
    id: "floor",
    name: "Podlahy",
    tagline: "Rýchloschnúca formula pre laminát, dlažbu aj drevo",
    theme: "floor",
    image: IMG.floor,
    price: 4.9,
    compareAt: 7.9,
    replacesBottles: 6,
    scent: "Eukalyptus",
    rating: 4.7,
    reviews: 389,
    stock: 44,
  },
  {
    id: "laundry",
    name: "Prací gél",
    tagline: "Koncentrované tablety – rozpustia sa priamo v bubne",
    theme: "laundry",
    image: IMG.laundry,
    price: 5.9,
    compareAt: 9.9,
    replacesBottles: 4,
    scent: "Levanduľa",
    rating: 4.9,
    reviews: 726,
    stock: 29,
    badge: "Novinka",
  },
];

export type Bundle = {
  id: string;
  name: string;
  subtitle: string;
  tablets: number;
  price: number;
  compareAt: number;
  perTablet: number;
  highlight?: boolean;
  ribbon?: string;
  perks: string[];
};

export const bundles: Bundle[] = [
  {
    id: "starter",
    name: "Skúšobný",
    subtitle: "Na vyskúšanie, či si Droply zamilujete",
    tablets: 10,
    price: 9.9,
    compareAt: 14.9,
    perTablet: 0.99,
    perks: ["10 tabliet podľa výberu", "1 dávkovacia fľaša ZDARMA", "Doručenie do 2 dní"],
  },
  {
    id: "home",
    name: "Domácnosť",
    subtitle: "Najčastejšia voľba slovenských domácností",
    tablets: 30,
    price: 24.9,
    compareAt: 44.9,
    perTablet: 0.83,
    highlight: true,
    ribbon: "Najobľúbenejšie · najlepšia cena",
    perks: [
      "30 tabliet – ľubovoľná kombinácia",
      "2 dávkovacie fľaše ZDARMA",
      "Doprava ZDARMA",
      "Eko sprievodca domácnosťou (PDF)",
    ],
  },
  {
    id: "family",
    name: "Rodinný",
    subtitle: "Maximálna úspora pre veľkú domácnosť",
    tablets: 60,
    price: 44.9,
    compareAt: 89.9,
    perTablet: 0.75,
    ribbon: "Najväčšia úspora",
    perks: [
      "60 tabliet – ľubovoľná kombinácia",
      "3 dávkovacie fľaše ZDARMA",
      "Doprava ZDARMA",
      "Prednostná zákaznícka podpora",
    ],
  },
];

export type Review = {
  name: string;
  city: string;
  rating: number;
  text: string;
  verified: boolean;
};

export const reviews: Review[] = [
  {
    name: "Lucia H.",
    city: "Bratislava",
    rating: 5,
    text: "Konečne nemusím tahať ťažké fľaše z obchodu. Objednám balíček tabliet, hodím do vody a mám plný rozprašovač. Voňavé a naozaj čistí!",
    verified: true,
  },
  {
    name: "Martin K.",
    city: "Košice",
    rating: 5,
    text: "Kúpil som pre celú rodinu. Deti to baví sledovať, ako tableta šumí vo vode, a my šetríme plast aj peniaze. Odporúčam každému.",
    verified: true,
  },
  {
    name: "Zuzana P.",
    city: "Žilina",
    rating: 5,
    text: "Pod drezom som mala 6 fliaš rôznych čističov. Teraz mám jednu krabičku tabliet a dve fľaše. Neuveriteľné, koľko miesta to ušetrí.",
    verified: true,
  },
  {
    name: "Peter D.",
    city: "Nitra",
    rating: 4,
    text: "Na okná paráda, žiadne šmuhy. Trvalo mi chvíľu zvyknúť si na dávkovanie, ale výsledok je lepší než klasické spreje.",
    verified: true,
  },
  {
    name: "Andrea M.",
    city: "Trnava",
    rating: 5,
    text: "Ekológia bola hlavný dôvod, prečo som skúsila. Ostala som pre vôňu a cenu. Už si klasické čističe nekúpim.",
    verified: true,
  },
  {
    name: "Tomáš V.",
    city: "Prešov",
    rating: 5,
    text: "Doručenie rýchle, balenie pekné a hlavne to funguje. Kuchynský odmasťovač zvládol aj gril po lete.",
    verified: true,
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Ako Droply tablety fungujú?",
    a: "Do dávkovacej fľaše nalejete vodu z vodovodu, vhodíte jednu šumivú tabletu a počkáte, kým sa rozpustí (cca 2 minúty). Vznikne plnohodnotný čistiaci prostriedok, ktorý čistí rovnako účinne ako klasické spreje z obchodu.",
  },
  {
    q: "Naozaj sú ekologickejšie?",
    a: "Áno. Jedna tableta nahradí celú plastovú fľašu čističa. Neprevážate vodu (klasické čističe sú z ~95 % voda), znižujete emisie z dopravy a plastový obal opakovane používate. Ročne tak jedna domácnosť ušetrí desiatky plastových fliaš.",
  },
  {
    q: "Sú bezpečné pre deti a domáce zvieratá?",
    a: "Formulácie sú dermatologicky testované a vyrábané v EU podľa prísnych noriem. Tablety skladujte mimo dosahu detí, rovnako ako akýkoľvek čistiaci prostriedok. Po rozpustení a použití podľa návodu sú plochy bezpečné.",
  },
  {
    q: "Koľko vydrží jedno balenie?",
    a: "Jedna tableta = jedna plná fľaša čističa (500 ml). Balenie 10 tabliet teda nahradí 5–6 klasických fliaš. Priemernej domácnosti vydrží balíček Domácnosť (30 tabliet) približne 3–4 mesiace.",
  },
  {
    q: "Čo ak mi to nebude vyhovovať?",
    a: "Máte 30 dní na vrátenie. Ak nebudete spokojní z akéhokoľvek dôvodu, vrátime vám peniaze – bez otázok. Riziko je na nás.",
  },
  {
    q: "Ako prebieha doručenie?",
    a: "Objednávky odosielame do 24 hodín a doručenie na Slovensku trvá 1–2 pracovné dni. Pri objednávke nad 25 € máte dopravu úplne zdarma.",
  },
];
