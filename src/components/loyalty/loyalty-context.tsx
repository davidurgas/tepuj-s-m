import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { loyaltyConfig } from "@/lib/loyalty-config";

/**
 * Vernostný program — dátová vrstva.
 *
 * Rovnako ako zvyšok tohto dema beží celé v prehliadači (localStorage), takže
 * to funguje bez servera. V ostrej verzii sa `members` presunú do databázy
 * a akcie (pridaj pečiatku, odošli notifikáciu) pôjdu cez API + reálny push.
 */

export type LoyaltyEvent = {
  id: string;
  type: "join" | "stamp" | "reward" | "redeem" | "review";
  label: string;
  at: string; // ISO
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  at: string; // ISO
  read: boolean;
  /** Voliteľná akcia — napr. otvorenie Google recenzie. */
  action?: "review" | null;
};

export type Member = {
  id: string; // krátky čitateľný kód, napr. TS-8F3K
  name: string;
  contact: string; // e-mail alebo telefón
  stamps: number; // aktuálne pečiatky na rozrobenej karte (0..stampsPerReward)
  totalStamps: number; // za celý čas
  rewardsEarned: number;
  rewardsRedeemed: number;
  createdAt: string;
  history: LoyaltyEvent[];
  notifications: AppNotification[];
  /** Príznak, že po poslednej službe čaká na ohodnotenie na Google. */
  pendingReview: boolean;
};

type Result = { ok: boolean; message: string; member?: Member };

type LoyaltyCtx = {
  members: Record<string, Member>;
  current: Member | null;
  /** Prihlásený člen sa pamätá medzi návštevami. */
  join: (name: string, contact: string) => Result;
  loginById: (id: string) => Result;
  logout: () => void;
  /** Staff: pridá pečiatku členovi (podľa ID). Vráti aj info, či vznikla odmena. */
  addStamp: (id: string) => Result;
  /** Staff: dokončené tepovanie → pošle žiadosť o Google recenziu. */
  requestReview: (id: string) => Result;
  /** Zákazník uplatní naplnenú odmenu. */
  redeemReward: (id: string) => Result;
  markNotificationsRead: (id: string) => void;
  clearPendingReview: (id: string) => void;
};

const MEMBERS_KEY = "loyalty-members";
const SESSION_KEY = "loyalty-session";

function loadMembers(): Record<string, Member> {
  try {
    return JSON.parse(localStorage.getItem(MEMBERS_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveMembers(m: Record<string, Member>) {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(m));
}

function makeId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `TS-${s}`;
}

/** Odošle aj naozajstnú systémovú notifikáciu, ak to prehliadač dovolí. */
function fireBrowserNotification(title: string, body: string) {
  try {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.svg" });
    }
  } catch {
    /* ignore — napr. iOS Safari bez povolenia */
  }
}

const Ctx = createContext<LoyaltyCtx | null>(null);

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Record<string, Member>>({});
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    setMembers(loadMembers());
    setCurrentId(localStorage.getItem(SESSION_KEY));
  }, []);

  const persist = useCallback((next: Record<string, Member>) => {
    setMembers(next);
    saveMembers(next);
  }, []);

  const pushNotification = useCallback(
    (
      store: Record<string, Member>,
      id: string,
      n: Omit<AppNotification, "id" | "at" | "read">,
    ) => {
      const m = store[id];
      if (!m) return;
      m.notifications = [
        { ...n, id: `N${Date.now()}${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), read: false },
        ...m.notifications,
      ];
      fireBrowserNotification(n.title, n.body);
    },
    [],
  );

  const join = useCallback(
    (name: string, contact: string): Result => {
      if (!name.trim()) return { ok: false, message: "Zadajte meno." };
      if (!contact.trim()) return { ok: false, message: "Zadajte e-mail alebo telefón." };
      const store = loadMembers();
      let id = makeId();
      while (store[id]) id = makeId();
      const now = new Date().toISOString();
      const member: Member = {
        id,
        name: name.trim(),
        contact: contact.trim(),
        stamps: 0,
        totalStamps: 0,
        rewardsEarned: 0,
        rewardsRedeemed: 0,
        createdAt: now,
        history: [{ id: `E${Date.now()}`, type: "join", label: "Registrácia do vernostného klubu", at: now }],
        notifications: [],
        pendingReview: false,
      };
      store[id] = member;
      // uvítacia notifikácia
      member.notifications = [
        {
          id: `N${Date.now()}`,
          title: `Vitajte v klube, ${member.name.split(" ")[0]}! 🎉`,
          body: `Zbierajte pečiatky ${loyaltyConfig.stampReason}. Po ${loyaltyConfig.stampsPerReward} pečiatkach získate: ${loyaltyConfig.reward}.`,
          at: now,
          read: false,
          action: null,
        },
      ];
      persist(store);
      setCurrentId(id);
      localStorage.setItem(SESSION_KEY, id);
      return { ok: true, message: `Karta vytvorená. Vaše ID: ${id}`, member };
    },
    [persist],
  );

  const loginById = useCallback((id: string): Result => {
    const key = id.trim().toUpperCase();
    const store = loadMembers();
    const m = store[key];
    if (!m) return { ok: false, message: "Karta s týmto ID sa nenašla." };
    setMembers(store);
    setCurrentId(key);
    localStorage.setItem(SESSION_KEY, key);
    return { ok: true, message: `Vitajte späť, ${m.name}!`, member: m };
  }, []);

  const logout = useCallback(() => {
    setCurrentId(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const addStamp = useCallback(
    (id: string): Result => {
      const key = id.trim().toUpperCase();
      const store = loadMembers();
      const m = store[key];
      if (!m) return { ok: false, message: "Karta s týmto ID sa nenašla." };
      const now = new Date().toISOString();
      m.stamps += 1;
      m.totalStamps += 1;
      m.history = [{ id: `E${Date.now()}`, type: "stamp", label: "Pridaná pečiatka", at: now }, ...m.history];

      let rewarded = false;
      if (m.stamps >= loyaltyConfig.stampsPerReward) {
        m.stamps = 0;
        m.rewardsEarned += 1;
        rewarded = true;
        m.history = [{ id: `E${Date.now()}R`, type: "reward", label: "Naplnená karta — vznikla odmena", at: now }, ...m.history];
        pushNotification(store, key, {
          title: "Karta je plná! 🏆",
          body: `Získali ste odmenu: ${loyaltyConfig.reward}. Uplatnite ju pri ďalšom tepovaní.`,
          action: null,
        });
      } else {
        pushNotification(store, key, {
          title: "Nová pečiatka pripísaná ✅",
          body: `Máte ${m.stamps}/${loyaltyConfig.stampsPerReward}. Do odmeny zostáva ${loyaltyConfig.stampsPerReward - m.stamps}.`,
          action: null,
        });
      }
      persist(store);
      return {
        ok: true,
        message: rewarded ? "Pečiatka pridaná — karta naplnená, vznikla odmena!" : "Pečiatka pridaná.",
        member: m,
      };
    },
    [persist, pushNotification],
  );

  const requestReview = useCallback(
    (id: string): Result => {
      const key = id.trim().toUpperCase();
      const store = loadMembers();
      const m = store[key];
      if (!m) return { ok: false, message: "Karta s týmto ID sa nenašla." };
      const now = new Date().toISOString();
      m.pendingReview = true;
      m.history = [{ id: `E${Date.now()}`, type: "review", label: "Odoslaná žiadosť o Google recenziu", at: now }, ...m.history];
      pushNotification(store, key, {
        title: "Ako sme zvládli tepovanie? ⭐",
        body: "Ak ste boli spokojní, ohodnoťte nás prosím na Google. Zaberie to 20 sekúnd.",
        action: "review",
      });
      persist(store);
      return { ok: true, message: "Žiadosť o recenziu odoslaná zákazníkovi.", member: m };
    },
    [persist, pushNotification],
  );

  const redeemReward = useCallback(
    (id: string): Result => {
      const key = id.trim().toUpperCase();
      const store = loadMembers();
      const m = store[key];
      if (!m) return { ok: false, message: "Karta sa nenašla." };
      const available = m.rewardsEarned - m.rewardsRedeemed;
      if (available <= 0) return { ok: false, message: "Zatiaľ nemáte odmenu na uplatnenie." };
      const now = new Date().toISOString();
      m.rewardsRedeemed += 1;
      m.history = [{ id: `E${Date.now()}`, type: "redeem", label: "Uplatnená odmena", at: now }, ...m.history];
      persist(store);
      return { ok: true, message: "Odmena uplatnená. Ďakujeme!", member: m };
    },
    [persist],
  );

  const markNotificationsRead = useCallback(
    (id: string) => {
      const store = loadMembers();
      const m = store[id];
      if (!m) return;
      m.notifications = m.notifications.map((n) => ({ ...n, read: true }));
      persist(store);
    },
    [persist],
  );

  const clearPendingReview = useCallback(
    (id: string) => {
      const store = loadMembers();
      const m = store[id];
      if (!m) return;
      m.pendingReview = false;
      persist(store);
    },
    [persist],
  );

  const value = useMemo<LoyaltyCtx>(
    () => ({
      members,
      current: currentId ? members[currentId] ?? null : null,
      join,
      loginById,
      logout,
      addStamp,
      requestReview,
      redeemReward,
      markNotificationsRead,
      clearPendingReview,
    }),
    [members, currentId, join, loginById, logout, addStamp, requestReview, redeemReward, markNotificationsRead, clearPendingReview],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLoyalty() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLoyalty musí byť použitý vnútri <LoyaltyProvider>");
  return ctx;
}
