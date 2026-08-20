import { useEffect, useRef, useState } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { SUPPORT_IMAGE, SUPPORT_NAME } from "@/lib/droply-data";

type Msg = { from: "agent" | "user"; text: string };

/** Plávajúci chat so zákazníckou podporou (demo). Otvára sa aj eventom „droply-open-chat". */
export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "agent", text: `Ahoj, som ${SUPPORT_NAME} z Droply. Ako ti môžem pomôcť?` },
  ]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("droply-open-chat", openHandler);
    return () => window.removeEventListener("droply-open-chat", openHandler);
  }, []);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          from: "agent",
          text: "Ďakujem za správu! Toto je demo chat — v ostrej verzii ti odpovie náš tím zvyčajne do pár minút. 💧",
        },
      ]);
    }, 700);
  };

  return (
    <>
      {/* panel */}
      <div
        className={`fixed bottom-24 right-4 z-40 w-[min(92vw,22rem)] origin-bottom-right rounded-3xl border border-border bg-card shadow-hover transition-all duration-300 sm:right-6 ${
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-t-3xl bg-water-gradient p-4 text-white">
          <img src={SUPPORT_IMAGE} alt={SUPPORT_NAME} className="h-10 w-10 rounded-full object-cover ring-2 ring-white/40" />
          <div className="flex-1">
            <p className="font-semibold leading-tight">{SUPPORT_NAME} · Podpora</p>
            <p className="flex items-center gap-1.5 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-eco" /> Online
            </p>
          </div>
          <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15" aria-label="Zavrieť chat">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex max-h-72 flex-col gap-2.5 overflow-y-auto p-4">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                m.from === "agent"
                  ? "self-start rounded-tl-sm bg-muted text-foreground"
                  : "self-end rounded-tr-sm bg-primary text-primary-foreground"
              }`}
            >
              {m.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Napíš správu…"
            className="min-w-0 flex-1 rounded-full border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button type="submit" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Odoslať">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* plávajúce tlačidlo s tvárou podpory */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full bg-card p-1.5 pr-4 shadow-hover ring-1 ring-border transition-transform hover:scale-105 sm:right-6"
        aria-label="Chat s podporou"
      >
        <span className="relative">
          <img src={SUPPORT_IMAGE} alt={SUPPORT_NAME} className="h-12 w-12 rounded-full object-cover" />
          <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground ring-2 ring-card">
            <MessageCircle className="h-3 w-3" />
          </span>
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-eco ring-2 ring-card" />
        </span>
        <span className="hidden text-sm font-semibold text-foreground sm:block">Potrebuješ pomoc?</span>
      </button>
    </>
  );
}
