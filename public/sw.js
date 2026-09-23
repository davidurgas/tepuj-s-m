// Service worker pre appku Rep.
// Stratégia „network-first": keď je telefón online, vždy načíta aktuálnu
// verziu (a odloží ju do cache pre offline). Takto sa appka po vydaní
// aktualizuje sama a nedrží starú verziu v cache.
const CACHE = "rep-cache-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(req);
        // ulož kópiu do cache (pre offline)
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        // offline → skús cache
        const cached = await caches.match(req);
        if (cached) return cached;
        if (req.mode === "navigate") {
          const start = await caches.match(new URL("index.html", self.registration.scope).href);
          if (start) return start;
        }
        throw new Error("offline a bez cache");
      }
    })(),
  );
});
