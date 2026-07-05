# Changelog

## 20:10 [05-07-2026]

- Popover now dismisses itself when the pointer leaves it (marketplace-theme hover behavior): `scheduleClose`/`cancelClose` timer pair in `components/SearchBar.tsx` with `HOVER_CLOSE_DELAY_MS` (320ms grace) frozen in `lib/picker-preset.ts`, hover handlers threaded into `components/ColorWheelPopover.tsx` via `onHoverIn`/`onHoverOut`. Gated to `(hover: hover) and (pointer: fine)` so touch keeps tap-to-toggle; grace period covers the trigger-to-panel gap. Solves the popover lingering after the cursor moves on.

## 20:05 [05-07-2026]

- Converged the picked wireframe (variation 2, Hue ring + shades) into the high-fidelity dark build: Next.js 16 + Tailwind 4 + framer-motion on port 3320. `app/page.tsx` (dark canvas, masonry skeleton that tints toward the picked color), `components/SearchBar.tsx` (Cosmos-style bar, color token, wheel trigger, Search state), `components/ColorWheelPopover.tsx` (12-hue lit-sphere ring, 5-shade inner arc bloom with damped springs, keyboard arrows/Escape, reduced-motion branches), `lib/picker-preset.ts` (frozen geometry, palette, spring values). Fixed an SVG trig hydration mismatch by rounding trigger-icon coordinates to 2 decimals. Solves the characterless saturation-square picker by carrying the dot-wheel motif through the whole interaction.

## 19:20 [05-07-2026]

- Created `prototypes/color-search.html` — prototype-md divergence round for the search bar color-search popover. Five interaction models (Dot ring, Hue ring + shades, Orbital scrub, Dot grid, Inline bloom) as prefetched screens with a pill tab switcher; shared wireframe search-bar stage (`buildStage`) with color token + Search button state, popover plumbing (`attachPopover`), and per-variation IIFEs with isolated state. Solves the "one-shot UI" problem: interaction models are compared side-by-side at wireframe fidelity before any high-fidelity build.
