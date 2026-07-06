# HueKit

DialKit for colors. A floating dev overlay that scans CSS variables on your page, lets you tune hues live, save palettes, and copy a `:root` block back into your stylesheet.

**Docs & live demo:** https://huekits.vercel.app  
**Source:** https://github.com/andreaskruszakin/huekit

## Install

Copy into your Next.js project:

- `components/huekit/` — UI module
- `lib/huekit-color.ts`, `lib/huekit-preset.ts`, `lib/huekit-theme.ts` — color helpers and theme hook

Mount once in your root layout (sibling, not wrapper):

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

Full installation guide, API reference, and interactive demo: **[huekits.vercel.app](https://huekits.vercel.app)**

## Dev

```bash
npm install
npm run dev   # http://localhost:3320 — minimal demo fixture
npm run build
```

## Docs

- [docs/HUEKIT.md](docs/HUEKIT.md) — architecture and edge cases
- [docs/CHANGELOG.md](docs/CHANGELOG.md) — release notes
- [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT — see [LICENSE](LICENSE).

## Stack

Next.js 16, Tailwind 4, framer-motion. Inter in panel chrome.
