type LogoProps = {
  /** veľkosť značky (mark) v px */
  size?: number;
  /** zobraziť textový wordmark vedľa značky */
  showText?: boolean;
  /** svetlý text pre tmavé pozadia */
  light?: boolean;
  className?: string;
};

/**
 * Droply logo — kvapka vody, v ktorej sa rozpúšťa šumivá tableta,
 * so stúpajúcimi bublinkami. Spája dva kľúčové nápady značky:
 * vodu (kvapka) a šumivú tabletu (kruh + bublinky).
 */
export function DroplyMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  const id = "droply-grad";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="Droply"
    >
      <defs>
        <linearGradient id={id} x1="8" y1="4" x2="40" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.55" stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <radialGradient id={`${id}-tab`} cx="0.5" cy="0.4" r="0.7">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#DFF6FF" />
        </radialGradient>
      </defs>

      {/* kvapka */}
      <path
        d="M24 3.5C32.5 18 39.5 25.5 39.5 33A15.5 15.5 0 1 1 8.5 33C8.5 25.5 15.5 18 24 3.5Z"
        fill={`url(#${id})`}
      />

      {/* šumivá tableta vo vnútri */}
      <circle cx="24" cy="33" r="8.4" fill={`url(#${id}-tab)`} opacity="0.96" />
      <circle cx="24" cy="33" r="8.4" fill="none" stroke="#0EA5E9" strokeOpacity="0.25" strokeWidth="1" />

      {/* bublinky v tablete */}
      <circle cx="21" cy="34.5" r="1.5" fill="#0EA5E9" opacity="0.55" />
      <circle cx="26.5" cy="35" r="1.1" fill="#0EA5E9" opacity="0.45" />
      <circle cx="24.5" cy="31" r="1.3" fill="#0EA5E9" opacity="0.5" />

      {/* stúpajúce bublinky */}
      <circle cx="30" cy="19" r="1.6" fill="#ffffff" opacity="0.9" />
      <circle cx="33" cy="13.5" r="1.1" fill="#ffffff" opacity="0.75" />
      <circle cx="31.5" cy="9.5" r="0.8" fill="#ffffff" opacity="0.6" />
      {/* lesk */}
      <ellipse cx="19.5" cy="29" rx="2.4" ry="3.4" fill="#ffffff" opacity="0.4" transform="rotate(-20 19.5 29)" />
    </svg>
  );
}

export default function Logo({ size = 40, showText = true, light = false, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <DroplyMark size={size} />
      {showText && (
        <span
          className="font-display font-extrabold tracking-tight leading-none"
          style={{ fontSize: size * 0.62 }}
        >
          <span className={light ? "text-white" : "text-foreground"}>Drop</span>
          <span className="text-gradient">ly</span>
        </span>
      )}
    </span>
  );
}
