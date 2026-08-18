import { useMemo } from "react";

/**
 * Pohár vody, v ktorom sa rozpúšťa šumivá tableta.
 * `progress` 0 → 1 riadi mieru rozpustenia:
 *  - 0   = celá tableta, čistá voda
 *  - ~0.5 = intenzívne šumenie, voda sa farbí
 *  - 1   = tableta rozpustená, sfarbená voda pripravená na použitie
 *
 * Použité v hero (jemná slučka) aj v scroll-scrubbed sekcii „Ako to funguje“.
 */
export default function DissolveGlass({
  progress,
  className = "",
}: {
  progress: number;
  className?: string;
}) {
  const p = Math.max(0, Math.min(1, progress));

  // tableta sa zmenšuje a mizne
  const tabletR = 27 * (1 - p);
  const tabletOpacity = p > 0.85 ? Math.max(0, (1 - p) / 0.15) : 1;
  const tabletSink = p * 18; // mierne klesá, ako sa rozpúšťa

  // voda sa postupne sfarbuje
  const tintOpacity = 0.12 + p * 0.5;

  // fizz je najsilnejší v strede procesu
  const fizz = p === 0 ? 0 : p < 0.85 ? 1 : Math.max(0, (1 - p) / 0.15);

  const bubbles = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        key: i,
        left: 33 + Math.random() * 34, // v strede poháru
        size: 3 + Math.random() * 8,
        delay: Math.random() * 4,
        duration: 2.4 + Math.random() * 2.6,
        bottom: 12 + Math.random() * 26,
      })),
    [],
  );

  return (
    <div className={`relative mx-auto ${className}`} style={{ aspectRatio: "200 / 280", maxWidth: 340 }}>
      <svg viewBox="0 0 200 280" fill="none" className="absolute inset-0 h-full w-full">
        <defs>
          <clipPath id="glass-inner">
            <path d="M52 62 L148 62 L136 244 Q134 254 124 254 L76 254 Q66 254 64 244 Z" />
          </clipPath>
          <linearGradient id="water-base" x1="0" y1="62" x2="0" y2="254" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EAF9FF" />
            <stop offset="1" stopColor="#CBEFFF" />
          </linearGradient>
          <linearGradient id="water-tint" x1="0" y1="62" x2="0" y2="254" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38D6F0" />
            <stop offset="1" stopColor="#0E9AE0" />
          </linearGradient>
          <linearGradient id="tablet-grad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#DCEFFB" />
          </linearGradient>
          <radialGradient id="cloud" cx="0.5" cy="0.5" r="0.5">
            <stop stopColor="#2CC6E8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#2CC6E8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g clipPath="url(#glass-inner)">
          {/* základná voda */}
          <rect x="40" y="66" width="120" height="196" fill="url(#water-base)" />
          {/* sfarbenie podľa rozpustenia */}
          <rect x="40" y="66" width="120" height="196" fill="url(#water-tint)" opacity={tintOpacity} />
          {/* oblak rozpúšťajúcej sa látky */}
          {p > 0.05 && (
            <circle cx="100" cy={150 + tabletSink} r={30 + p * 26} fill="url(#cloud)" opacity={0.5 * p} />
          )}
          {/* hladina – jemný lesk */}
          <rect x="40" y="64" width="120" height="6" fill="#ffffff" opacity="0.55" />

          {/* tableta */}
          {tabletR > 0.5 && (
            <g opacity={tabletOpacity}>
              <circle cx="100" cy={150 + tabletSink} r={tabletR} fill="url(#tablet-grad)" />
              <circle
                cx="100"
                cy={150 + tabletSink}
                r={tabletR}
                fill="none"
                stroke="#8FD8F5"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              {/* drážka tablety */}
              <line
                x1={100 - tabletR * 0.7}
                y1={150 + tabletSink}
                x2={100 + tabletR * 0.7}
                y2={150 + tabletSink}
                stroke="#8FD8F5"
                strokeOpacity="0.5"
                strokeWidth="1.2"
              />
            </g>
          )}
        </g>

        {/* sklo poháru */}
        <path
          d="M52 62 L148 62 L136 244 Q134 254 124 254 L76 254 Q66 254 64 244 Z"
          fill="#ffffff"
          fillOpacity="0.06"
          stroke="#BFE9FA"
          strokeWidth="3"
        />
        {/* lesk skla */}
        <path d="M60 74 L70 74 L82 240 L74 240 Z" fill="#ffffff" opacity="0.35" />
      </svg>

      {/* stúpajúce bublinky (fizz) */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ opacity: fizz }}
        aria-hidden="true"
      >
        {bubbles.map((b) => (
          <span
            key={b.key}
            className="absolute rounded-full bg-white/80"
            style={{
              left: `${b.left}%`,
              bottom: `${b.bottom}%`,
              width: b.size,
              height: b.size,
              boxShadow: "0 0 4px rgba(255,255,255,0.7)",
              animation: `rise ${b.duration}s linear ${b.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
