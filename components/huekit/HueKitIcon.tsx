import { HUES, hsl } from "@/lib/picker-preset";

/** Neomorphic app-icon style bubble: dark squircle + recessed ring + hue dots */
export function HueKitIcon({ size = 56 }: { size?: number }) {
  const cx = 32;
  const cy = 32;
  const ringR = 14;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hk-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a2e" />
          <stop offset="100%" stopColor="#141416" />
        </linearGradient>
        <filter id="hk-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.45" />
        </filter>
        <filter id="hk-inset">
          <feOffset dx="0" dy="1" />
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feComposite in="b" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="i" />
          <feFlood floodColor="#000" floodOpacity="0.55" />
          <feComposite in2="i" operator="in" />
          <feComposite in2="SourceGraphic" operator="over" />
        </filter>
      </defs>

      {/* squircle body */}
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#hk-bg)" filter="url(#hk-shadow)" />
      <rect x="4" y="4" width="56" height="56" rx="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* recessed circular track */}
      <circle cx={cx} cy={cy} r={ringR + 3} fill="#0e0e10" stroke="rgba(0,0,0,0.5)" strokeWidth="1" filter="url(#hk-inset)" />
      <circle cx={cx} cy={cy} r={ringR + 3} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

      {/* hue dots around the ring */}
      {HUES.map((h) => {
        const a = ((h - 90) * Math.PI) / 180;
        const x = cx + ringR * Math.cos(a);
        const y = cy + ringR * Math.sin(a);
        return (
          <circle
            key={h}
            cx={x.toFixed(2)}
            cy={y.toFixed(2)}
            r="2.6"
            fill={hsl(h, 78, 52)}
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="0.4"
          />
        );
      })}

      {/* active knob — white sphere like DialKit slider thumb */}
      <circle cx={cx} cy={cy - ringR} r="4.2" fill="#fff" filter="url(#hk-shadow)" />
      <circle cx={cx} cy={cy - ringR - 0.8} r="2.2" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}
