# HueKit

DialKit for colors. A floating dev overlay that scans CSS variables on your page, lets you tune hues live, save palettes, and copy a `:root` block back into your stylesheet.

**Live demo:** https://huekit.vercel.app

## Quick start

1. Clone this repo or copy `components/huekit/` and `lib/huekit-color.ts` into your Next.js project.
2. Mount `<HueKitRoot />` as a sibling in your root layout (not wrapping `{children}`).
3. Define color tokens as CSS variables on `:root`.

```tsx
// app/layout.tsx
import { HueKitRoot } from "@/components/huekit/HueKitRoot";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <HueKitRoot />
      </body>
    </html>
  );
}
```

```css
/* app/globals.css */
:root {
  --hue-accent: hsl(210 82% 56%);
  --hue-surface: hsl(240 6% 6%);
  --hue-ink: hsl(0 0% 96%);
}
```

Open the bubble, pick a variable, tune the hue ring, copy CSS or save a palette.

## Features

- Auto-scan `--*` CSS variables with color values
- 12-hue ring + shade arc + HSL sliders or hex input
- 10-step lightness scale per hue
- Live `setProperty` updates across the page
- Save/load palettes (localStorage, max 20)
- Copy `:root { ... }` export block
- Eyedropper (Chrome/Edge when supported)
- Draggable bubble and panel

## Contributing

HueKit is open source. Contributions welcome.

1. Fork the repo and create a branch from `master`.
2. Run `npm install` and `npm run dev` (port 3320).
3. Keep changes focused. Match existing patterns in `components/huekit/`.
4. Run `npm run build` before opening a PR.
5. Add a line to `docs/CHANGELOG.md` for user-visible changes.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Docs

- [docs/HUEKIT.md](docs/HUEKIT.md) — architecture and edge cases
- [docs/CHANGELOG.md](docs/CHANGELOG.md) — release notes

## License

MIT — see [LICENSE](LICENSE).

## Stack

Next.js 16, Tailwind 4, framer-motion. Typography: Aeonik Pro.
