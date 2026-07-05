export type Hsl = { h: number; s: number; l: number };

export function parseColor(input: string): Hsl | null {
  const v = input.trim();
  const hex = v.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h.slice(0, 6), 16);
    return rgbToHsl((n >> 16) & 255, (n >> 8) & 255, n & 255);
  }
  const hsl = v.match(/^hsla?\(\s*([\d.]+)(?:deg)?\s+([\d.]+)%\s+([\d.]+)%/i);
  if (hsl) return { h: +hsl[1], s: +hsl[2], l: +hsl[3] };
  const rgb = v.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (rgb) return rgbToHsl(+rgb[1], +rgb[2], +rgb[3]);
  return null;
}

export function rgbToHsl(r: number, g: number, b: number): Hsl {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslCss(h: number, s: number, l: number) {
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
}

export function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function formatColor(hsl: Hsl, mode: "hsl" | "hex"): string {
  return mode === "hex" ? hslToHex(hsl.h, hsl.s, hsl.l) : hslCss(hsl.h, hsl.s, hsl.l);
}

export function shadeScale(h: number, s: number): string[] {
  return [92, 82, 72, 62, 55, 48, 40, 32, 24, 16].map((l) => hslCss(h, s, l));
}

export function isColorValue(value: string): boolean {
  if (!value.trim()) return false;
  return parseColor(value) !== null;
}
