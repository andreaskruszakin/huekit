import { useId } from "react";
import { HUES, hsl } from "@/lib/picker-preset";

/** Neomorphic app-icon style bubble: dark squircle + recessed ring + hue dots */
export function HueKitIcon({ size = 56 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  const shadowId = `hk-shadow-${uid}`;
  const insetId = `hk-inset-${uid}`;
  const bgId = `hk-bg-${uid}`;

  const cx = 32;
  const cy = 32;
  const ringR = 14;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="huekit-icon-svg"
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a2e" />
          <stop offset="100%" stopColor="#141416" />
        </linearGradient>
        <filter
          id={shadowId}
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.45" />
        </filter>
        <filter id={insetId}>
          <feOffset dx="0" dy="1" />
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feComposite in="b" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="i" />
          <feFlood floodColor="#000" floodOpacity="0.55" />
          <feComposite in2="i" operator="in" />
          <feComposite in2="SourceGraphic" operator="over" />
        </filter>
      </defs>

      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="16"
        fill={`url(#${bgId})`}
        filter={`url(#${shadowId})`}
      />
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="16"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />

      <circle
        cx={cx}
        cy={cy}
        r={ringR + 3}
        fill="#0e0e10"
        stroke="rgba(0,0,0,0.5)"
        strokeWidth="1"
        filter={`url(#${insetId})`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={ringR + 3}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="0.5"
      />

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

      <circle cx={cx} cy={cy - ringR} r="4.2" fill="#fff" />
      <circle cx={cx} cy={cy - ringR - 0.8} r="2.2" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}
