import { useEffect, useMemo, useState } from "react";

/** Odpočet do konca uvádzacej ponuky (demo: 2 dni od načítania). */
export default function Countdown() {
  const target = useMemo(() => Date.now() + 1000 * 60 * 60 * 47 + 1000 * 60 * 12, []);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);

  const cells = [
    { v: h, l: "hodín" },
    { v: m, l: "minút" },
    { v: s, l: "sekúnd" },
  ];

  return (
    <div className="flex items-center gap-2">
      {cells.map((c, i) => (
        <div key={c.l} className="flex items-center gap-2">
          <div className="grid min-w-[3rem] place-items-center rounded-xl bg-secondary px-3 py-2 text-secondary-foreground">
            <span className="font-display text-xl font-extrabold tabular-nums">
              {String(c.v).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-white/60">{c.l}</span>
          </div>
          {i < cells.length - 1 && <span className="font-display text-xl font-bold text-secondary">:</span>}
        </div>
      ))}
    </div>
  );
}
