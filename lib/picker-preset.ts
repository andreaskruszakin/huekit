export const HUES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export const HUE_NAMES: Record<number, string> = {
  0: "Red", 30: "Orange", 60: "Yellow", 90: "Lime", 120: "Green", 150: "Mint",
  180: "Cyan", 210: "Sky", 240: "Blue", 270: "Purple", 300: "Magenta", 330: "Pink",
};

// lightness steps for the inner shade arc, light -> dark
export const SHADE_LIGHTNESS = [76, 65, 55, 44, 32];

export const WHEEL = {
  size: 280,
  hueRadius: 108,
  hueDot: 34,
  shadeRadius: 58,
  shadeDot: 28,
  shadeSpreadDeg: 22, // angular step between shade dots, centered on the hue
};

export const SPRING = {
  panel: { type: "spring", stiffness: 480, damping: 38, mass: 0.9 } as const,
  dot: { type: "spring", stiffness: 520, damping: 32, mass: 0.7 } as const,
  hover: { type: "spring", stiffness: 420, damping: 28 } as const,
  token: { type: "spring", stiffness: 560, damping: 36 } as const,
};

export const SHADE_STAGGER_S = 0.022;

// grace period before the popover closes after the pointer leaves it
export const HOVER_CLOSE_DELAY_MS = 320;

export const hsl = (h: number, s = 82, l = 56) => `hsl(${h} ${s}% ${l}%)`;

// lit-sphere fill so dots read as material, not flat vectors
export const sphereFill = (h: number, s: number, l: number) =>
  `radial-gradient(circle at 35% 30%, hsl(${h} ${Math.max(s - 14, 30)}% ${Math.min(l + 16, 92)}%), hsl(${h} ${s}% ${l}%) 58%, hsl(${h} ${s}% ${Math.max(l - 12, 12)}%))`;

export type PickedColor = { h: number; s: number; l: number; css: string; name: string };
