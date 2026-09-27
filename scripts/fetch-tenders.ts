// Denný zber zákaziek → public/data/tenders.json
// Spúšťa ho GitHub Action (.github/workflows/fetch-tenders.yml), dá sa aj ručne:
//   node scripts/fetch-tenders.ts
// (Node 22.18+ spúšťa TypeScript priamo.)
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fetchTedTenders, mergeFeeds, type TenderFeed } from "../src/obstaravania/core.ts";

const OUT = new URL("../public/data/tenders.json", import.meta.url);

async function readPrev(): Promise<TenderFeed | null> {
  try {
    return JSON.parse(await readFile(OUT, "utf8")) as TenderFeed;
  } catch {
    return null;
  }
}

const prev = await readPrev();
const now = new Date().toISOString();
const ted = await fetchTedTenders({ log: (m) => console.log(m) });

if (!ted.status.ok) {
  // Zdroj je nedostupný — nechaj staré dáta, nech appka ukazuje aspoň tie.
  console.error(`Zber zlyhal: ${ted.status.error}. Ponechávam predošlé dáta.`);
  process.exit(prev ? 0 : 1);
}

const feed: TenderFeed = {
  generatedAt: now,
  sources: [ted.status],
  tenders: mergeFeeds(prev?.tenders ?? [], ted.tenders, now),
};

await mkdir(dirname(OUT.pathname), { recursive: true });
await writeFile(OUT, JSON.stringify(feed, null, 1) + "\n");
const counts = feed.tenders.reduce<Record<string, number>>((a, t) => ((a[t.relevance] = (a[t.relevance] ?? 0) + 1), a), {});
console.log(`Uložené: ${feed.tenders.length} zákaziek`, counts);
