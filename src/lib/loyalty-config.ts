/**
 * Konfigurácia vernostného programu (na jednom mieste).
 *
 * Toto je jediný súbor, ktorý treba upraviť, keď meníš firmu, prevádzku,
 * odmenu alebo Google recenzie. Všetko ostatné sa riadi odtiaľto.
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

  /** Prevádzka — pre kontrolu polohy pri žiadosti o Google recenziu. */
  place: {
    name: string;
    /** GPS súradnice prevádzky (alebo miesta služby). */
    lat: number;
    lng: number;
    /** Do akej vzdialenosti (v metroch) považujeme zákazníka za „na mieste". */
    radiusMeters: number;
  };

  /**
   * Odkaz na napísanie Google recenzie.
   * Najspoľahlivejšie: https://search.google.com/local/writereview?placeid=PLACE_ID
   * PLACE_ID zistíš cez „Place ID Finder" od Googlu.
   * Ako fallback funguje aj hľadanie podľa názvu.
   */
  googlePlaceId: string;
  googleReviewFallbackQuery: string;
};

export const loyaltyConfig: LoyaltyConfig = {
  brand: "Tepuj s.m. — Vernostný klub",
  tagline: "Za každé tepovanie pečiatka. Šieste tepovanie máte zadarmo.",
  stampReason: "za každé objednané tepovanie",
  stampsPerReward: 6,
  reward: "1× tepovanie sedačky alebo koberca ZADARMO",

  place: {
    name: "Tepuj s.m.",
    // TODO: nahraď reálnymi súradnicami prevádzky
    lat: 48.1486,
    lng: 17.1077,
    radiusMeters: 300,
  },

  // TODO: doplň reálne Google Place ID prevádzky
  googlePlaceId: "",
  googleReviewFallbackQuery: "Tepuj s.m.",
};

/** Zostaví odkaz na napísanie Google recenzie. */
export function googleReviewUrl(cfg: LoyaltyConfig = loyaltyConfig): string {
  if (cfg.googlePlaceId) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(cfg.googlePlaceId)}`;
  }
  // Fallback: otvorí Google Maps s hľadaním prevádzky, kde vie zákazník kliknúť na „Napísať recenziu".
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cfg.googleReviewFallbackQuery)}`;
}

/** Vzdialenosť dvoch GPS bodov v metroch (haversine). */
export function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}
