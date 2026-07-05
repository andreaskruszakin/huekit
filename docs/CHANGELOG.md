# Changelog

## 20:22 [05-07-2026]

- Removed the white hover outline from the inner shade dots in `components/ColorWheelPopover.tsx` — they keep the spring scale-up on hover, the ring stays on the outer hue dots only. The shades already read as one family; outlining them was noise.

- Fixed hue switching: the shade-arc container (`absolute inset-0` in `components/ColorWheelPopover.tsx`) was invisibly covering the whole wheel and swallowing clicks on other hue dots — now `pointer-events-none` with `pointer-events-auto` on the shade buttons, so you can hop between hues freely. Added a `HoverRing` component: white outline (same treatment as the selected state) on hover and keyboard focus for both hue and shade dots, opacity-only transition. Solves "can't switch colors after picking one" and makes hover targets explicit.

- Smoother popover in/out per Emil's origin-aware guidance: `transformOrigin` now aims at the wheel trigger's measured center (`PANEL_ORIGIN` in `lib/picker-preset.ts`, browser-measured 126px/-38px) so the panel grows out of the trigger instead of its own corner; entrance switched to a duration+bounce spring (`SPRING.panel` 0.4s bounce 0), dropped the `y` slide (scale + origin carries the direction), exit is a faster 150ms quint ease-out (`PANEL_EXIT`) for asymmetric enter/exit. `components/ColorWheelPopover.tsx` updated. Solves the entrance feeling like a detached corner-slide.

- Popover now dismisses itself when the pointer leaves it (marketplace-theme hover behavior): `scheduleClose`/`cancelClose` timer pair in `components/SearchBar.tsx` with `HOVER_CLOSE_DELAY_MS` (320ms grace) frozen in `lib/picker-preset.ts`, hover handlers threaded into `components/ColorWheelPopover.tsx` via `onHoverIn`/`onHoverOut`. Gated to `(hover: hover) and (pointer: fine)` so touch keeps tap-to-toggle; grace period covers the trigger-to-panel gap. Solves the popover lingering after the cursor moves on.

## 20:05 [05-07-2026]

- Converged the picked wireframe (variation 2, Hue ring + shades) into the high-fidelity dark build: Next.js 16 + Tailwind 4 + framer-motion on port 3320. `app/page.tsx` (dark canvas, masonry skeleton that tints toward the picked color), `components/SearchBar.tsx` (Cosmos-style bar, color token, wheel trigger, Search state), `components/ColorWheelPopover.tsx` (12-hue lit-sphere ring, 5-shade inner arc bloom with damped springs, keyboard arrows/Escape, reduced-motion branches), `lib/picker-preset.ts` (frozen geometry, palette, spring values). Fixed an SVG trig hydration mismatch by rounding trigger-icon coordinates to 2 decimals. Solves the characterless saturation-square picker by carrying the dot-wheel motif through the whole interaction.

## 19:20 [05-07-2026]

- Created `prototypes/color-search.html` — prototype-md divergence round for the search bar color-search popover. Five interaction models (Dot ring, Hue ring + shades, Orbital scrub, Dot grid, Inline bloom) as prefetched screens with a pill tab switcher; shared wireframe search-bar stage (`buildStage`) with color token + Search button state, popover plumbing (`attachPopover`), and per-variation IIFEs with isolated state. Solves the "one-shot UI" problem: interaction models are compared side-by-side at wireframe fidelity before any high-fidelity build.
