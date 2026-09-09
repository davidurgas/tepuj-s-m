import { useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Bell, Plus, Search, Sparkles, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { useLoyalty } from "@/components/loyalty/loyalty-context";
import StampCard from "@/components/loyalty/StampCard";
import { loyaltyConfig } from "@/lib/loyalty-config";

/** Zobrazí výsledok akcie ako toast (úspech/chyba). */
function notify(r: { ok: boolean; message: string }) {
  if (r.ok) toast.success(r.message);
  else toast.error(r.message);
}

/**
 * Panel pre personál. V ostrej verzii by tu bola aj kamera na skenovanie QR
 * (napr. cez knižnicu html5-qrcode); teraz sa ID zadáva/hľadá manuálne.
 */
export default function LoyaltyAdminPage() {
  const { members, addStamp, requestReview } = useLoyalty();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const list = Object.values(members).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const filtered = query.trim()
    ? list.filter(
        (m) =>
          m.id.toLowerCase().includes(query.toLowerCase()) ||
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.contact.toLowerCase().includes(query.toLowerCase()),
      )
    : list;

  const sel = selected ? members[selected] : null;

  const enableNotifications = async () => {
    if (typeof Notification === "undefined") {
      toast.error("Tento prehliadač nepodporuje upozornenia.");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      toast.success("Upozornenia povolené.");
      new Notification("Upozornenia sú zapnuté ✅", { body: "Zákazníkom sa budú zobrazovať pečiatky a odmeny.", icon: "/favicon.svg" });
    } else {
      toast.error("Upozornenia neboli povolené.");
    }
  };

  return (
    <section className="container-tight max-w-3xl py-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Panel pre personál</p>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold"><Users className="h-6 w-6" /> Vernostný klub</h1>
        </div>
        <button onClick={enableNotifications} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold">
          <Bell className="h-4 w-4" /> Povoliť upozornenia
        </button>
      </div>

      {/* Vyhľadávanie */}
      <div className="mb-4 flex items-center gap-2 rounded-full border border-input bg-background px-4 py-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          className="w-full bg-transparent outline-none"
          placeholder="Hľadať podľa ID (TS-XXXX), mena alebo kontaktu…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Detail vybraného člena */}
      {sel && (
        <div className="mb-5 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{sel.name}</p>
              <p className="text-sm text-muted-foreground">{sel.id} · {sel.contact}</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">{sel.stamps}/{loyaltyConfig.stampsPerReward} pečiatok</p>
              <p className="text-muted-foreground">Odmeny: {sel.rewardsEarned - sel.rewardsRedeemed} k dispozícii</p>
            </div>
          </div>
          <StampCard stamps={sel.stamps} />
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              onClick={() => notify(addStamp(sel.id))}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-primary-foreground transition hover:scale-[1.02]"
            >
              <Plus className="h-5 w-5" /> Pridať pečiatku
            </button>
            <button
              onClick={() => notify(requestReview(sel.id))}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sunny py-3 font-semibold text-sunny-foreground transition hover:scale-[1.02]"
            >
              <Star className="h-5 w-5" /> Tepovanie hotové → požiadať o recenziu
            </button>
          </div>
        </div>
      )}

      {/* Zoznam členov */}
      <p className="mb-2 text-sm font-semibold text-muted-foreground">Členovia ({filtered.length})</p>
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Zatiaľ žiadni členovia. Zákazník sa registruje na stránke{" "}
            <Link to="/vernost" className="font-semibold text-primary underline">/vernost</Link>.
          </p>
        )}
        {filtered.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelected(m.id)}
            className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
              selected === m.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/50"
            }`}
          >
            <div>
              <p className="font-semibold">{m.name} <span className="font-mono text-xs text-muted-foreground">{m.id}</span></p>
              <p className="text-sm text-muted-foreground">{m.contact}</p>
            </div>
            <div className="flex items-center gap-2">
              {m.rewardsEarned - m.rewardsRedeemed > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-eco/15 px-2 py-1 text-xs font-semibold text-eco">
                  <Sparkles className="h-3 w-3" /> odmena
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-semibold">
                <BadgeCheck className="h-3 w-3" /> {m.stamps}/{loyaltyConfig.stampsPerReward}
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/vernost" className="font-semibold text-primary underline">← Späť na zákaznícku kartu</Link>
      </p>
    </section>
  );
}
