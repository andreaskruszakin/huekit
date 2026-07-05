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

export function shadeScale(h: number, s: number): string[] {
  return [92, 82, 72, 62, 55, 48, 40, 32, 24, 16].map((l) => hslCss(h, s, l));
}

export function isColorValue(value: string): boolean {
  if (!value.trim()) return false;
  return parseColor(value) !== null;
}
