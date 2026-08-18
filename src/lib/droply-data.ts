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
const IMG = {
  universal: "https://d8j0ntlcm91z4.cloudfront.net/user_3AhuqzP4VjgsdpfdOEJfJ1mDnzs/hf_20260818_143706_22b02a59-1cfc-4f21-aa0d-cecb079a7a77.png",
  kitchen: "https://d8j0ntlcm91z4.cloudfront.net/user_3AhuqzP4VjgsdpfdOEJfJ1mDnzs/hf_20260818_143706_cf1312c7-3596-46f5-b46b-818697cb959d.png",
  glass: "https://d8j0ntlcm91z4.cloudfront.net/user_3AhuqzP4VjgsdpfdOEJfJ1mDnzs/hf_20260818_143706_fb8b2be0-31c1-4aa2-942f-5750f29efc08.png",
  bathroom: "https://d8j0ntlcm91z4.cloudfront.net/user_3AhuqzP4VjgsdpfdOEJfJ1mDnzs/hf_20260818_143706_17bfd58a-4100-4645-ade9-3a197cb7680b.png",
};

/** Reálne video makro-rozpúšťania tablety vo vode (Higgsfield CDN) — pozadie hero. */
export const DISSOLVE_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3AhuqzP4VjgsdpfdOEJfJ1mDnzs/hf_20260818_143642_a867c5f7-434f-4cbe-b730-b5242c685121.mp4";

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
