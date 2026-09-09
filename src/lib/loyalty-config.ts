/**
 * Konfigurácia vernostného programu (na jednom mieste).
 *
 * Toto je jediný súbor, ktorý treba upraviť, keď meníš firmu, odmenu alebo
 * Google recenzie. Všetko ostatné sa riadi odtiaľto.
 */

export type LoyaltyConfig = {
  /** Názov firmy / programu zobrazený na karte. */
  brand: string;
  /** Krátky podnadpis pod názvom. */
  tagline: string;
  /** Za čo sa dáva pečiatka (napr. „za každé tepovanie"). */
  stampReason: string;
  /** Koľko pečiatok treba na odmenu. */
  stampsPerReward: number;
  /** Popis odmeny (čo zákazník dostane po naplnení karty). */
  reward: string;

  /** Kontakt na firmu (zobrazí sa v pätičke karty). */
  contact: {
    phone: string;
    email: string;
    web: string;
  };

  /** Mestá, kde firma pôsobí (mobilná služba). */
  cities: string[];

  /**
   * Od koľkých hviezdičiek posielame zákazníka na Google.
   * Nižšie hodnotenie ide ako súkromná spätná väzba (chráni reputáciu).
   */
  reviewThreshold: number;

  /**
   * Odkaz na napísanie Google recenzie.
   * Najspoľahlivejšie: https://search.google.com/local/writereview?placeid=PLACE_ID
   * PLACE_ID zistíš cez „Place ID Finder" od Googlu.
   * Ako fallback funguje aj hľadanie podľa názvu na Google Maps.
   */
  googlePlaceId: string;
  googleReviewFallbackQuery: string;
};

export const loyaltyConfig: LoyaltyConfig = {
  brand: "Vytepujto.sk — Vernostný klub",
  tagline: "Za každé tepovanie pečiatka. Šieste tepovanie máte zadarmo.",
  stampReason: "za každé objednané tepovanie",
  stampsPerReward: 6,
  reward: "1× tepovanie sedačky alebo koberca ZADARMO",

  contact: {
    phone: "+421 908 243 022",
    email: "info@vytepujto.sk",
    web: "vytepujto.sk",
  },

  cities: [
    "Bratislava",
    "Banská Bystrica",
    "Zvolen",
    "Žiar nad Hronom",
    "Prievidza",
    "Poprad",
    "Nitra",
    "Žilina",
    "Trenčín",
  ],

  reviewThreshold: 4,

  // TODO: doplň reálne Google Place ID prevádzky (Place ID Finder od Googlu)
  googlePlaceId: "",
  googleReviewFallbackQuery: "Vytepujto.sk tepovanie",
};

/** Zostaví odkaz na napísanie Google recenzie. */
export function googleReviewUrl(cfg: LoyaltyConfig = loyaltyConfig): string {
  if (cfg.googlePlaceId) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(cfg.googlePlaceId)}`;
  }
  // Fallback: otvorí Google Maps s hľadaním firmy, kde vie zákazník kliknúť na „Napísať recenziu".
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cfg.googleReviewFallbackQuery)}`;
}
