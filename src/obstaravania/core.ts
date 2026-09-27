// Jadro zberu zákaziek — zdieľa ho appka (prehliadač) aj denný skript
// `scripts/fetch-tenders.ts` (Node). Preto tu nie sú žiadne importy.
//
// Zdroj: TED (Tenders Electronic Daily) — oficiálne verejné API EÚ,
// bez registrácie: https://docs.ted.europa.eu/api/latest/search.html
// Hľadáme zákazky slovenských obstarávateľov podľa CPV kódov upratovania
// a čistenia textílií a podľa kľúčových slov (tepovanie, koberce, …).

export type Stage = "vyzva" | "predbezne" | "vysledok" | "oprava" | "ine";
export type Relevance = "tepovanie" | "cistenie" | "ine";

export interface Tender {
  id: string;
  source: "TED" | "manual";
  title: string;
  buyer: string;
  city?: string;
  description?: string;
  publishedAt: string; // YYYY-MM-DD
  deadline?: string; // ISO dátum alebo dátum+čas
  noticeType: string;
  stage: Stage;
  cpv: string[];
  value?: number;
  currency?: string;
  url: string;
  relevance: Relevance;
  matched: string[]; // prečo sme zákazku zaradili (kľúčové slová / CPV)
  firstSeenAt?: string; // kedy ju zber našiel prvýkrát
}

export interface SourceStatus {
  name: string;
  ok: boolean;
  count: number;
  error?: string;
}

export interface TenderFeed {
  generatedAt: string;
  sources: SourceStatus[];
  tenders: Tender[];
}

// ---------------------------------------------------------------------------
// Čo hľadáme

/** CPV kódy (bez kontrolnej číslice). `strong` = priamo tepovanie/textílie. */
export const CPV_CODES: { code: string; label: string; strong?: boolean }[] = [
  { code: "98312000", label: "Čistenie textílií", strong: true },
  { code: "98310000", label: "Pranie a chemické čistenie", strong: true },
  { code: "90900000", label: "Upratovacie a hygienické služby" },
  { code: "90910000", label: "Upratovacie služby" },
  { code: "90911000", label: "Upratovanie ubytovacích zariadení a budov" },
  { code: "90911100", label: "Upratovanie ubytovacích zariadení" },
  { code: "90911200", label: "Čistenie budov" },
  { code: "90919000", label: "Upratovanie kancelárií a škôl" },
  { code: "90919200", label: "Upratovanie kancelárií" },
  { code: "90919300", label: "Upratovanie škôl" },
  { code: "90917000", label: "Čistenie dopravných prostriedkov" },
];

/** Kľúčové slová — porovnávajú sa bez diakritiky a veľkosti písmen. */
export const STRONG_KEYWORDS = [
  "tepova", // tepovanie, tepovania, tepovať
  "koberc", // koberce, kobercov
  "calunen", // čalúnenie, čalúnený
  "sedac", // sedačky, sedacie súpravy
  "matrac",
  "textilnych podlah",
  "textilne podlahov",
  "podlahovych krytin",
  "cistenie textil",
  "strojne cistenie",
  "hlbkove cistenie",
  "zaclon", // záclony
  "zavesy", // závesy
  "zavesov",
  "carpet",
  "upholster",
];

export const WEAK_KEYWORDS = ["upratov", "cistenie", "cistiace", "hygienick", "cleaning"];

/** Fulltextové dotazy do TED (každý ide samostatne, chyba jedného nevadí). */
export const TED_FULLTEXT_TERMS = [
  "tepovanie",
  "tepovania",
  "koberce",
  "kobercov",
  "čalúnenia",
  "čalúnenie",
  "sedačiek",
];

export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function classify(text: string, cpv: string[]): { relevance: Relevance; matched: string[] } {
  const t = normalize(text);
  const matched: string[] = [];
  for (const k of STRONG_KEYWORDS) if (t.includes(k)) matched.push(k);
  const cpv8 = cpv.map((c) => c.slice(0, 8));
  const strongCpv = CPV_CODES.filter((c) => c.strong && cpv8.includes(c.code));
  const weakCpv = CPV_CODES.filter((c) => !c.strong && cpv8.includes(c.code));
  for (const c of [...strongCpv, ...weakCpv]) matched.push(`CPV ${c.code} ${c.label}`);

  if (matched.some((m) => !m.startsWith("CPV")) || strongCpv.length) {
    return { relevance: "tepovanie", matched };
  }
  if (weakCpv.length || WEAK_KEYWORDS.some((k) => t.includes(k))) {
    for (const k of WEAK_KEYWORDS) if (t.includes(k)) matched.push(k);
    return { relevance: "cistenie", matched };
  }
  return { relevance: "ine", matched };
}

export function stageOf(noticeType: string): Stage {
  const n = (noticeType || "").toLowerCase();
  if (n.startsWith("can") || n === "veat" || n.includes("award") || n.includes("result")) return "vysledok";
  if (n.startsWith("pin-cfc") || n.startsWith("cn") || n.startsWith("qu-sy") || n.includes("contract-notice"))
    return "vyzva";
  if (n.startsWith("pin")) return "predbezne";
  if (n.startsWith("corr") || n.includes("change")) return "oprava";
  return "ine";
}

export const STAGE_LABEL: Record<Stage, string> = {
  vyzva: "Výzva na ponuky",
  predbezne: "Predbežné oznámenie",
  vysledok: "Výsledok",
  oprava: "Oprava / zmena",
  ine: "Iné oznámenie",
};

export const RELEVANCE_LABEL: Record<Relevance, string> = {
  tepovanie: "Tepovanie",
  cistenie: "Upratovanie / čistenie",
  ine: "Ostatné",
};

// ---------------------------------------------------------------------------
// TED API

const TED_URL = "https://api.ted.europa.eu/v3/notices/search";

const CORE_FIELDS = [
  "publication-number",
  "publication-date",
  "notice-title",
  "buyer-name",
  "notice-type",
  "classification-cpv",
  "deadline-receipt-tender-date-lot",
  "links",
];
// Voliteľné polia — ak ich API odmietne (HTTP 400), dotaz zopakujeme bez nich.
const EXTRA_FIELDS = [
  "buyer-city",
  "deadline-receipt-tender-time-lot",
  "description-lot",
  "estimated-value-lot",
  "estimated-value-cur-lot",
];

type Json = unknown;

/** Vyberie text z viacjazyčného poľa TED (preferuje slovenčinu). */
export function pickText(v: Json): string {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.map(pickText).filter(Boolean)[0] ?? "";
  if (typeof v === "object") {
    const o = v as Record<string, Json>;
    for (const k of ["slk", "SLK", "sk", "SK", "ces", "CES", "eng", "ENG", "en", "EN"]) {
      if (o[k] != null) {
        const t = pickText(o[k]);
        if (t) return t;
      }
    }
    for (const val of Object.values(o)) {
      const t = pickText(val);
      if (t) return t;
    }
  }
  return "";
}

function pickList(v: Json): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v.flatMap(pickList);
  if (typeof v === "object") {
    const o = v as Record<string, Json>;
    const pref = o.slk ?? o.SLK ?? o.eng ?? o.ENG;
    return pickList(pref ?? Object.values(o)[0]);
  }
  return [String(v)];
}

function day(s: string): string {
  const m = /(\d{4})-?(\d{2})-?(\d{2})/.exec(s);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : "";
}

function earliestDeadline(dates: string[], times: string[]): string | undefined {
  const today = new Date().toISOString().slice(0, 10);
  const all = dates
    .map((d, i) => {
      const dd = day(d);
      if (!dd) return "";
      const tm = /(\d{2}):(\d{2})/.exec(times[i] ?? times[0] ?? "");
      return tm ? `${dd}T${tm[1]}:${tm[2]}` : dd;
    })
    .filter(Boolean)
    .sort();
  // najbližší budúci termín, inak posledný (už uplynulý)
  return all.find((d) => d.slice(0, 10) >= today) ?? all[all.length - 1];
}

export function parseTedNotice(n: Record<string, Json>): Tender | null {
  const pub = pickText(n["publication-number"]);
  if (!pub) return null;
  const title = pickText(n["notice-title"]) || `Oznámenie ${pub}`;
  const buyer = pickText(n["buyer-name"]);
  const description = pickText(n["description-lot"]) || undefined;
  const cpv = [...new Set(pickList(n["classification-cpv"]))];
  const noticeType = pickText(n["notice-type"]);
  const links = (n.links ?? {}) as Record<string, Record<string, string>>;
  const url =
    links?.html?.SLK ??
    links?.html?.slk ??
    links?.htmlDirect?.SLK ??
    `https://ted.europa.eu/sk/notice/-/detail/${encodeURIComponent(pub)}`;
  const valueRaw = pickList(n["estimated-value-lot"]).map(Number).filter((x) => !isNaN(x));
  const { relevance, matched } = classify(`${title} ${description ?? ""}`, cpv);

  return {
    id: `TED-${pub}`,
    source: "TED",
    title,
    buyer,
    city: pickText(n["buyer-city"]) || undefined,
    description: description && description.length > 600 ? description.slice(0, 600) + "…" : description,
    publishedAt: day(pickText(n["publication-date"])),
    deadline: earliestDeadline(pickList(n["deadline-receipt-tender-date-lot"]), pickList(n["deadline-receipt-tender-time-lot"])),
    noticeType,
    stage: stageOf(noticeType),
    cpv,
    value: valueRaw.length ? valueRaw.reduce((a, b) => a + b, 0) : undefined,
    currency: pickText(n["estimated-value-cur-lot"]) || undefined,
    url,
    relevance,
    matched,
  };
}

export function buildTedQueries(sinceDays: number): string[] {
  const since = new Date(Date.now() - sinceDays * 86400000).toISOString().slice(0, 10).replace(/-/g, "");
  const base = `buyer-country IN (SVK) AND publication-date>=${since}`;
  const cpv = CPV_CODES.map((c) => c.code).join(" ");
  return [
    `${base} AND classification-cpv IN (${cpv}) SORT BY publication-date DESC`,
    ...TED_FULLTEXT_TERMS.map((t) => `${base} AND FT~("${t}") SORT BY publication-date DESC`),
  ];
}

export interface FetchOptions {
  sinceDays?: number;
  maxPages?: number;
  fetchImpl?: typeof fetch;
  log?: (msg: string) => void;
}

async function tedPage(
  f: typeof fetch,
  query: string,
  fields: string[],
  page: number,
): Promise<{ status: number; notices: Record<string, Json>[]; total: number; error?: string }> {
  const res = await f(TED_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      query,
      fields,
      limit: 100,
      page,
      scope: "ALL",
      paginationMode: "PAGE_NUMBER",
      onlyLatestVersions: true,
    }),
  });
  if (!res.ok) {
    return { status: res.status, notices: [], total: 0, error: (await res.text()).slice(0, 300) };
  }
  const body = (await res.json()) as { notices?: Record<string, Json>[]; totalNoticeCount?: number };
  return { status: res.status, notices: body.notices ?? [], total: body.totalNoticeCount ?? 0 };
}

/** Stiahne zákazky z TED. Chyby jednotlivých dotazov zapíše do stavu zdroja. */
export async function fetchTedTenders(opts: FetchOptions = {}): Promise<{ tenders: Tender[]; status: SourceStatus }> {
  const f = opts.fetchImpl ?? fetch;
  const log = opts.log ?? (() => {});
  const maxPages = opts.maxPages ?? 5;
  let fields = [...CORE_FIELDS, ...EXTRA_FIELDS];
  const byId = new Map<string, Tender>();
  const errors: string[] = [];
  let okQueries = 0;

  for (const query of buildTedQueries(opts.sinceDays ?? 365)) {
    try {
      for (let page = 1; page <= maxPages; page++) {
        let r = await tedPage(f, query, fields, page);
        if (r.status === 400 && fields.length > CORE_FIELDS.length) {
          log(`TED odmietol voliteľné polia, skúšam len základné (${r.error})`);
          fields = [...CORE_FIELDS];
          r = await tedPage(f, query, fields, page);
        }
        if (r.error) throw new Error(`HTTP ${r.status}: ${r.error}`);
        const ft = /FT~\("([^"]+)"\)/.exec(query)?.[1];
        for (const raw of r.notices) {
          const t = byId.get(`TED-${pickText(raw["publication-number"])}`) ?? parseTedNotice(raw);
          if (!t) continue;
          // fulltext našiel slovo niekde v celom oznámení (aj v prílohách / popise)
          if (ft && t.relevance !== "tepovanie") {
            t.relevance = "tepovanie";
            t.matched.unshift(`text: ${ft}`);
          }
          byId.set(t.id, t);
        }
        log(`„${query.slice(0, 90)}…" strana ${page}: ${r.notices.length} / ${r.total}`);
        if (r.notices.length < 100 || page * 100 >= r.total) break;
      }
      okQueries++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log(`Chyba dotazu: ${msg}`);
      errors.push(msg);
    }
  }

  const tenders = [...byId.values()];
  return {
    tenders,
    status: {
      name: "TED (EÚ)",
      ok: okQueries > 0,
      count: tenders.length,
      error: errors.length ? errors[0] : undefined,
    },
  };
}

/** Zlúči nové dáta so starými: zachová „prvýkrát videné" a staršie záznamy. */
export function mergeFeeds(prev: Tender[], next: Tender[], nowIso: string, keepDays = 400): Tender[] {
  const prevById = new Map(prev.map((t) => [t.id, t]));
  const out = new Map<string, Tender>();
  for (const t of prev) out.set(t.id, t);
  for (const t of next) {
    out.set(t.id, { ...t, firstSeenAt: prevById.get(t.id)?.firstSeenAt ?? nowIso });
  }
  const cutoff = new Date(Date.now() - keepDays * 86400000).toISOString().slice(0, 10);
  return [...out.values()]
    .filter((t) => (t.deadline ?? t.publishedAt) >= cutoff)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
