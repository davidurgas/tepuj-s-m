import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Bell,
  BellRing,
  Gift,
  LogOut,
  Smartphone,
  Star,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useLoyalty } from "@/components/loyalty/loyalty-context";
import StampCard from "@/components/loyalty/StampCard";
import { loyaltyConfig, googleReviewUrl } from "@/lib/loyalty-config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/** Zobrazí výsledok akcie ako toast (úspech/chyba). */
function notify(r: { ok: boolean; message: string }) {
  if (r.ok) toast.success(r.message);
  else toast.error(r.message);
}

export default function LoyaltyPage() {
  const { current, join, loginById, logout, redeemReward, markNotificationsRead, clearPendingReview } = useLoyalty();
  const [params] = useSearchParams();
  const [tab, setTab] = useState<"join" | "login">("join");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [loginId, setLoginId] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  // Ak sa príde cez QR odkaz /vernost?id=TS-XXXX, rovno prihlás kartu.
  useEffect(() => {
    const id = params.get("id");
    if (id && !current) {
      const r = loginById(id);
      if (!r.ok) toast.error(r.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!current) {
    return (
      <section className="container-tight py-14">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold">{loyaltyConfig.brand}</h1>
            <p className="mt-2 text-muted-foreground">{loyaltyConfig.tagline}</p>
            <p className="mt-2 text-xs text-muted-foreground">Tepovanie: {loyaltyConfig.cities.join(" · ")}</p>
          </div>

          <div className="mb-4 flex rounded-full bg-muted p-1 text-sm font-semibold">
            <button
              className={`flex-1 rounded-full py-2 transition ${tab === "join" ? "bg-card shadow-card" : "text-muted-foreground"}`}
              onClick={() => setTab("join")}
            >
              Nová karta
            </button>
            <button
              className={`flex-1 rounded-full py-2 transition ${tab === "login" ? "bg-card shadow-card" : "text-muted-foreground"}`}
              onClick={() => setTab("login")}
            >
              Mám kartu
            </button>
          </div>

          {tab === "join" ? (
            <form
              className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-card"
              onSubmit={(e) => {
                e.preventDefault();
                notify(join(name, contact));
              }}
            >
              <div>
                <label className="mb-1 block text-sm font-medium">Meno</label>
                <input className="w-full rounded-lg border border-input bg-background px-3 py-2.5" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ján Novák" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">E-mail alebo telefón</label>
                <input className="w-full rounded-lg border border-input bg-background px-3 py-2.5" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="jan@email.sk / 0901 234 567" />
              </div>
              <button className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground transition hover:scale-[1.02]">
                Založiť vernostnú kartu
              </button>
              <p className="text-center text-xs text-muted-foreground">Karta sa uloží do tohto zariadenia. Do telefónu ju pridáte na ďalšom kroku.</p>
            </form>
          ) : (
            <form
              className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-card"
              onSubmit={(e) => {
                e.preventDefault();
                notify(loginById(loginId));
              }}
            >
              <div>
                <label className="mb-1 block text-sm font-medium">ID karty</label>
                <input className="w-full rounded-lg border border-input bg-background px-3 py-2.5 uppercase" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="TS-XXXX" />
              </div>
              <button className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground transition hover:scale-[1.02]">
                Otvoriť moju kartu
              </button>
            </form>
          )}
        </div>
      </section>
    );
  }

  // --- Prihlásený člen ---
  return (
    <MemberView
      onLogout={logout}
      onRedeem={() => {
        notify(redeemReward(current.id));
      }}
      openNotif={() => {
        setNotifOpen(true);
        markNotificationsRead(current.id);
      }}
      notifOpen={notifOpen}
      setNotifOpen={setNotifOpen}
      walletOpen={walletOpen}
      setWalletOpen={setWalletOpen}
      onDismissReview={() => clearPendingReview(current.id)}
    />
  );
}

/* Vlastný komponent kvôli prehľadnosti — číta aktuálneho člena z kontextu. */
function MemberView({
  onLogout,
  onRedeem,
  openNotif,
  notifOpen,
  setNotifOpen,
  walletOpen,
  setWalletOpen,
  onDismissReview,
}: {
  onLogout: () => void;
  onRedeem: () => void;
  openNotif: () => void;
  notifOpen: boolean;
  setNotifOpen: (v: boolean) => void;
  walletOpen: boolean;
  setWalletOpen: (v: boolean) => void;
  onDismissReview: () => void;
}) {
  const { current } = useLoyalty();
  const m = current!;
  const unread = m.notifications.filter((n) => !n.read).length;
  const availableRewards = m.rewardsEarned - m.rewardsRedeemed;

  // URL, ktorú zakóduje QR — po naskenovaní telefónom otvorí kartu.
  const cardUrl = useMemo(() => {
    const base = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}`;
    return `${base}/vernost?id=${m.id}`;
  }, [m.id]);

  return (
    <section className="container-tight max-w-2xl py-8">
      {/* Hlavička */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Vernostná karta</p>
          <h1 className="text-2xl font-extrabold">Ahoj, {m.name.split(" ")[0]}!</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openNotif} className="relative rounded-full border border-border bg-card p-2.5" aria-label="Upozornenia">
            {unread > 0 ? <BellRing className="h-5 w-5 text-primary" /> : <Bell className="h-5 w-5" />}
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-bold text-destructive-foreground">
                {unread}
              </span>
            )}
          </button>
          <button onClick={onLogout} className="rounded-full border border-border bg-card p-2.5" aria-label="Odhlásiť">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Žiadosť o Google recenziu (podľa polohy) */}
      {m.pendingReview && <ReviewPrompt memberId={m.id} onDone={onDismissReview} />}

      {/* Pečiatková karta */}
      <StampCard stamps={m.stamps} />

      {/* Odmeny */}
      {availableRewards > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border-2 border-eco bg-eco/10 p-4">
          <div className="flex items-center gap-3">
            <Gift className="h-7 w-7 text-eco" />
            <div>
              <p className="font-bold">Máte {availableRewards}× odmenu!</p>
              <p className="text-sm text-muted-foreground">{loyaltyConfig.reward}</p>
            </div>
          </div>
          <button onClick={onRedeem} className="rounded-full bg-eco px-4 py-2 text-sm font-semibold text-eco-foreground">
            Uplatniť
          </button>
        </div>
      )}

      {/* QR člena */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-5 text-center shadow-card">
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Ukážte tento QR na prevádzke — pridáme vám pečiatku
        </p>
        <div className="mx-auto inline-block rounded-xl bg-white p-3">
          <QRCodeSVG value={cardUrl} size={168} level="M" />
        </div>
        <p className="mt-3 font-mono text-lg font-bold tracking-widest">{m.id}</p>
      </div>

      {/* Pridať do telefónu / peňaženky */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button onClick={() => setWalletOpen(true)} className="flex items-center justify-center gap-2 rounded-full bg-secondary py-3 font-semibold text-secondary-foreground">
          <Wallet className="h-5 w-5" /> Pridať do peňaženky
        </button>
        <a href={googleReviewUrl()} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-3 font-semibold">
          <Star className="h-5 w-5 text-sunny" /> Ohodnotiť na Google
        </a>
      </div>

      {/* Štatistiky */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Stat label="Pečiatky spolu" value={m.totalStamps} />
        <Stat label="Získané odmeny" value={m.rewardsEarned} />
        <Stat label="Uplatnené" value={m.rewardsRedeemed} />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {loyaltyConfig.contact.web} · {loyaltyConfig.contact.phone} · {loyaltyConfig.contact.email}
      </p>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        Ste prevádzka? <Link to="/vernost/admin" className="font-semibold text-primary underline">Otvoriť panel pre personál →</Link>
      </p>

      {/* Dialóg upozornení */}
      <Dialog open={notifOpen} onOpenChange={setNotifOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upozornenia</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto">
            {m.notifications.length === 0 && <p className="text-sm text-muted-foreground">Zatiaľ žiadne upozornenia.</p>}
            {m.notifications.map((n) => (
              <div key={n.id} className="rounded-xl border border-border bg-muted/40 p-3">
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                {n.action === "review" && (
                  <a href={googleReviewUrl()} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    <Star className="h-4 w-4" /> Napísať recenziu
                  </a>
                )}
                <p className="mt-1 text-[11px] text-muted-foreground">{new Date(n.at).toLocaleString("sk-SK")}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialóg peňaženky */}
      <WalletDialog open={walletOpen} onOpenChange={setWalletOpen} cardUrl={cardUrl} />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

/**
 * Žiadosť o hodnotenie po tepovaní — „hviezdičková brána":
 * spokojní (≥ prah) idú na Google, nespokojní dajú súkromnú spätnú väzbu.
 */
function ReviewPrompt({ memberId, onDone }: { memberId: string; onDone: () => void }) {
  const { recordReview } = useLoyalty();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const happy = rating >= loyaltyConfig.reviewThreshold;

  if (done) {
    return (
      <div className="mb-4 rounded-2xl border-2 border-eco bg-eco/10 p-4 text-sm">
        Ďakujeme za spätnú väzbu! 🙏 Vážime si každý názor a pomáha nám zlepšovať sa.
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-2xl border-2 border-sunny bg-sunny/10 p-4">
      <div className="flex items-start gap-3">
        <Star className="mt-0.5 h-6 w-6 shrink-0 text-sunny" />
        <div className="flex-1">
          <p className="font-bold">Ako sme zvládli tepovanie?</p>
          <p className="text-sm text-muted-foreground">Ohodnoťte nás — zaberie to pár sekúnd.</p>

          {/* Hviezdy */}
          <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                aria-label={`${n} hviezdičiek`}
                className="p-0.5"
              >
                <Star className={`h-8 w-8 transition ${(hover || rating) >= n ? "fill-sunny text-sunny" : "text-muted-foreground/40"}`} />
              </button>
            ))}
          </div>

          {rating > 0 && happy && (
            <div className="mt-3">
              <p className="mb-2 text-sm text-muted-foreground">Super, ďakujeme! Podelíte sa aj na Google?</p>
              <a
                href={googleReviewUrl()}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  recordReview(memberId, rating);
                  onDone();
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-sunny px-4 py-2 text-sm font-semibold text-sunny-foreground"
              >
                <Star className="h-4 w-4" /> Ohodnotiť na Google
              </a>
            </div>
          )}

          {rating > 0 && !happy && (
            <div className="mt-3">
              <p className="mb-2 text-sm text-muted-foreground">Mrzí nás to. Čo môžeme zlepšiť? (napíšete len nám)</p>
              <textarea
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Vaša spätná väzba…"
              />
              <button
                onClick={() => {
                  recordReview(memberId, rating, comment);
                  setDone(true);
                }}
                className="mt-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"
              >
                Odoslať spätnú väzbu
              </button>
            </div>
          )}

          {rating === 0 && (
            <button onClick={onDone} className="mt-2 text-sm text-muted-foreground underline">Neskôr</button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Vysvetľujúci dialóg „Pridať do peňaženky" + PWA/skratka na plochu. */
function WalletDialog({ open, onOpenChange, cardUrl }: { open: boolean; onOpenChange: (v: boolean) => void; cardUrl: string }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5" /> Pridať kartu do telefónu</DialogTitle>
          <DialogDescription>Kartu máte vždy po ruke — tri možnosti:</DialogDescription>
        </DialogHeader>
        <ol className="space-y-3 text-sm">
          <li>
            <p className="font-semibold">1) Skratka na plochu (funguje hneď)</p>
            <p className="text-muted-foreground">V prehliadači telefónu otvorte túto kartu → menu → „Pridať na plochu". Karta sa otvorí ako appka.</p>
          </li>
          <li>
            <p className="font-semibold">2) Uložte si QR</p>
            <p className="text-muted-foreground">QR kód nižšie ukážete na prevádzke a je aj vaším prihlásením do karty.</p>
            <div className="mt-2 inline-block rounded-lg bg-white p-2">
              <QRCodeSVG value={cardUrl} size={120} level="M" />
            </div>
          </li>
          <li>
            <p className="font-semibold">3) Apple / Google Wallet</p>
            <p className="text-muted-foreground">
              Natívny „.pkpass" / Google Wallet pas vyžaduje serverovú časť (podpisový certifikát). V ostrej verzii sem
              pribudnú tlačidlá „Add to Apple Wallet" a „Save to Google Wallet".
            </p>
          </li>
        </ol>
      </DialogContent>
    </Dialog>
  );
}
