import { useMemo } from "react";

/**
 * Dekoratívna vrstva stúpajúcich bubliniek. Čisto vizuálny efekt (aria-hidden).
 */
export default function Bubbles({
  count = 14,
  className = "",
  color = "255 255 255",
}: {
  count?: number;
  className?: string;
  color?: string; // "r g b"
}) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const size = 6 + Math.random() * 26;
        return {
          key: i,
          left: Math.random() * 100,
          size,
          delay: Math.random() * 8,
          duration: 7 + Math.random() * 9,
          opacity: 0.08 + Math.random() * 0.22,
        };
      }),
    [count],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {bubbles.map((b) => (
        <span
          key={b.key}
          className="absolute bottom-[-40px] rounded-full"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 30% 30%, rgba(${color} / ${b.opacity + 0.15}), rgba(${color} / ${b.opacity}))`,
            boxShadow: `inset 0 0 6px rgba(${color} / 0.25)`,
            animation: `rise ${b.duration}s linear ${b.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
