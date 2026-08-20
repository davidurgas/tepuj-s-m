export type CategoryId = "univerzal" | "kuchyna" | "sklo" | "kupelna" | "podlahy" | "pranie";
export type IconKey = "universal" | "kitchen" | "glass" | "bathroom" | "floor" | "laundry";

export type Category = {
  id: CategoryId;
  name: string;
  tagline: string;
  image: string;
  icon: IconKey;
};

export type Product = {
  id: string;
  categoryId: CategoryId;
  /** vôňa / funkcia varianty */
  scent: string;
  tagline: string;
  image: string;
  price: number;
  /** pôvodná (prečiarknutá) cena — kotvenie / anchoring */
  compareAt: number;
  /** koľko fliaš nahradí jedno balenie (10 tabliet) */
  replacesBottles: number;
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

/** Hero video – logo vytlačené zvislo na plastovej fľaši, tableta sa reálne rozpúšťa (Higgsfield CDN). */
export const DISSOLVE_VIDEO = `${CDN}/hf_20260820_070808_45fe2482-84a9-4e7b-95de-214219449ae3.mp4`;

/** Video na bielom pozadí – pre sekciu „Ako funguje" (vytlačené logo, splýva s bielym pozadím). */
export const DISSOLVE_VIDEO_WHITE = `${CDN}/hf_20260820_070820_cd0ed9cc-a420-4521-b119-e268fde6801c.mp4`;

/** Široká hero fotka (rozprašovacia fľaša + tablety). */
export const HERO_IMAGE = `${CDN}/hf_20260818_160205_4fea7fac-bc32-4ae7-a3f0-97435a2b522d.png`;

/** Fotka zákazníckej podpory + meno. */
export const SUPPORT_IMAGE = `${CDN}/hf_20260820_084036_d9d27321-67f7-482b-9edd-920e57efc9ce.png`;
export const SUPPORT_NAME = "Klára";

/** Reklamné bannery pre hero slider (16:9, produkt vpravo, miesto na text vľavo). */
export const BANNER_SALE = `${CDN}/hf_20260819_154949_f35dade2-7d66-435e-afa4-6c6bd15d9953.png`;
export const BANNER_BEST = `${CDN}/hf_20260819_155148_2b1f96c0-f338-43b0-af6e-c423c587cfb5.png`;
export const BANNER_ECO = `${CDN}/hf_20260819_154949_0332d10c-aad3-48d9-8629-4bd103515797.png`;

export const categories: Category[] = [
  { id: "univerzal", name: "Univerzál", tagline: "Jedna tableta na (takmer) všetko v domácnosti", image: IMG.universal, icon: "universal" },
  { id: "kuchyna", name: "Kuchyňa", tagline: "Odmasťovače a čističe do kuchyne", image: IMG.kitchen, icon: "kitchen" },
  { id: "sklo", name: "Okná & sklo", tagline: "Bez šmúh a bez rozprašovania litrov chémie", image: IMG.glass, icon: "glass" },
  { id: "kupelna", name: "Kúpeľňa", tagline: "Vodný kameň a usadeniny nemajú šancu", image: IMG.bathroom, icon: "bathroom" },
  { id: "podlahy", name: "Podlahy", tagline: "Rýchloschnúce na laminát, dlažbu aj drevo", image: IMG.floor, icon: "floor" },
  { id: "pranie", name: "Pranie", tagline: "Koncentrované pracie tablety priamo do bubna", image: IMG.laundry, icon: "laundry" },
];

const IMG_BY_CAT: Record<CategoryId, string> = {
  univerzal: IMG.universal,
  kuchyna: IMG.kitchen,
  sklo: IMG.glass,
  kupelna: IMG.bathroom,
  podlahy: IMG.floor,
  pranie: IMG.laundry,
};

type Variant = Omit<Product, "image" | "categoryId" | "tagline"> & { tagline?: string };

/** Skratka na vytvorenie variantov kategórie (zdieľajú fotku kategórie). */
function cat(categoryId: CategoryId, tagline: string, variants: Variant[]): Product[] {
  return variants.map((v) => ({ ...v, categoryId, image: IMG_BY_CAT[categoryId], tagline: v.tagline ?? tagline }));
}

export const products: Product[] = [
  ...cat("univerzal", "Jedna tableta na (takmer) všetko v domácnosti", [
    { id: "univerzal-bavlna", scent: "Sviežа bavlna", price: 4.9, compareAt: 7.9, replacesBottles: 5, rating: 4.9, reviews: 1243, stock: 38, badge: "Bestseller", bestseller: true },
    { id: "univerzal-aloe", scent: "Aloe vera", price: 4.9, compareAt: 7.9, replacesBottles: 5, rating: 4.8, reviews: 521, stock: 47 },
    { id: "univerzal-citrus", scent: "Citrus", price: 4.9, compareAt: 7.9, replacesBottles: 5, rating: 4.8, reviews: 388, stock: 33 },
  ]),
  ...cat("kuchyna", "Odmasťovač, ktorý si poradí aj s pripáleným tukom", [
    { id: "kuchyna-citrus", scent: "Citrus & limetka", price: 4.9, compareAt: 7.9, replacesBottles: 5, rating: 4.8, reviews: 862, stock: 24, badge: "Bestseller", bestseller: true },
    { id: "kuchyna-grep", scent: "Grapefruit", price: 4.9, compareAt: 7.9, replacesBottles: 5, rating: 4.7, reviews: 274, stock: 40 },
    { id: "kuchyna-bez", scent: "Bez parfumu · extra silný", price: 5.2, compareAt: 8.5, replacesBottles: 5, rating: 4.8, reviews: 199, stock: 18, badge: "Silný odmasťovač" },
  ]),
  ...cat("sklo", "Bez šmúh a bez rozprašovania litrov chémie", [
    { id: "sklo-bez", scent: "Bez parfumu · bez šmúh", price: 4.5, compareAt: 6.9, replacesBottles: 6, rating: 4.9, reviews: 517, stock: 51, badge: "Bez šmúh", bestseller: true },
    { id: "sklo-sviezost", scent: "Sviežosť", price: 4.5, compareAt: 6.9, replacesBottles: 6, rating: 4.7, reviews: 233, stock: 44 },
  ]),
  ...cat("kupelna", "Vodný kameň a mydlové usadeniny nemajú šancu", [
    { id: "kupelna-more", scent: "Morský vánok", price: 4.9, compareAt: 7.9, replacesBottles: 5, rating: 4.8, reviews: 634, stock: 12, badge: "Posledné kusy" },
    { id: "kupelna-eukalyptus", scent: "Eukalyptus", price: 4.9, compareAt: 7.9, replacesBottles: 5, rating: 4.8, reviews: 341, stock: 36 },
    { id: "kupelna-levandula", scent: "Levanduľa", price: 4.9, compareAt: 7.9, replacesBottles: 5, rating: 4.9, reviews: 288, stock: 29 },
  ]),
  ...cat("podlahy", "Rýchloschnúca formula pre laminát, dlažbu aj drevo", [
    { id: "podlahy-eukalyptus", scent: "Eukalyptus", price: 4.9, compareAt: 7.9, replacesBottles: 6, rating: 4.7, reviews: 389, stock: 44 },
    { id: "podlahy-citrus", scent: "Citrus", price: 4.9, compareAt: 7.9, replacesBottles: 6, rating: 4.7, reviews: 176, stock: 52 },
  ]),
  ...cat("pranie", "Koncentrované tablety – rozpustia sa priamo v bubne", [
    { id: "pranie-levandula", scent: "Levanduľa", price: 5.9, compareAt: 9.9, replacesBottles: 4, rating: 4.9, reviews: 726, stock: 29, badge: "Novinka", bestseller: true },
    { id: "pranie-bavlna", scent: "Sviežа bavlna", price: 5.9, compareAt: 9.9, replacesBottles: 4, rating: 4.8, reviews: 302, stock: 41 },
    { id: "pranie-detsky", scent: "Detský · bez parfumu", price: 6.2, compareAt: 10.5, replacesBottles: 4, rating: 4.9, reviews: 158, stock: 22 },
  ]),
];

export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;
export const productsByCategory = (id: CategoryId) => products.filter((p) => p.categoryId === id);
export const bestsellers = products.filter((p) => p.bestseller);
export const productFullName = (p: Product) => `Droply ${getCategory(p.categoryId).name} · ${p.scent}`;

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
