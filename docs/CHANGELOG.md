# Changelog

## 10:40 [06-07-2026]

- Split repos: `huekit` is install-only product (`components/huekit/`, `lib/`, minimal demo in `app/page.tsx`); docs/marketing site moved to [huekit-landing](https://github.com/andreaskruszakin/huekit-landing) at https://huekits.vercel.app. Removed `components/landing/`, landing CSS from `app/globals.css`; README links to docs site. Ships UX polish (tooltips, Inter, light/dark, HSL/hex height) as installable module.

## 10:22 [06-07-2026]

- Completed site-replicator DialKit scrape (`node scrape.mjs` + `analyze.mjs` → `Andreas Studio/site-replicator/output/dialkit-ref/`, `design-tokens.json`, `site-data.json`); refined HueKit landing CSS in `app/globals.css` (`--hue-body-muted`, 720px column, 64px section / 80px footer rhythm, 30/20/16px heading scale, 16px body #525252, 12px mono code blocks, table padding, 36px CTA pill) from scraped `typographyScale` / `spacingScale` while keeping Inter and HueKit content in `components/landing/LandingPage.tsx`. Aligns docs page with live DialKit reference after proper Playwright scrape.

## 10:00 [06-07-2026]

- HueKit UX polish: portaled viewport-aware toolbar tooltips (`ToolbarTip.tsx`) so labels are not clipped by panel overflow; Inter via `next/font` replaces Aeonik; fixed-height HSL/Hex controls (`huekit-format-controls`, `WheelPicker.tsx`); system light/dark panel tokens (`lib/huekit-theme.ts`, `data-theme` on `HueKitRoot`); DialKit-style landing restructure (Usage, Features table, agent prompt, `globals.css` prefers-color-scheme). Solves tooltip cutoff, format jump, accessibility font, theme mismatch, and docs page parity with DialKit rhythm.

## 09:36 [06-07-2026]

- Disabled Vercel Deployment Protection (`ssoProtection: null`) on the `color-search` project so `huekits.vercel.app` and all deployment URLs load without login. Solves SSO redirect blocking public preview links.

## 09:30 [06-07-2026]

- Palette toolbar UX: moved saved-palettes control after eyedropper/reset/copy as a wider 32px pill with icon + label (`HueKitRoot.tsx`, `PaletteMenu.tsx`, `huekit-panel.css`); HSL/Hex toggle gets sliding pill + crossfading readout/controls (`WheelPicker.tsx`). Solves easy-to-miss compact icon and abrupt format switch.

## 09:20 [06-07-2026]

- Toolbar palette control: `PaletteMenu` moved into icon toolbar as compact palette button with amber active dot, dropdown anchored to button (`PaletteMenu.tsx`, `huekit-panel.css`, `IconPalette`). OG color-search prototype split to [color-search-prototype](https://github.com/andreaskruszakin/color-search-prototype); removed `SearchBar`, `ColorWheelPopover`, `prototypes/`; slimmed wheel constants to `lib/huekit-preset.ts`.

## 09:10 [06-07-2026]

- Palette manager UX: header dropdown (`PaletteMenu.tsx`) with load, rename, delete, update active, and save-as; CRUD hooks in `useColorVars.ts` (`activePaletteId`, `savePaletteAs`, `renamePalette`, `deletePalette`, `updateActivePalette`); removed save/list UI from `PalettePanel.tsx`; pencil/trash icons + dropdown CSS in `huekit-panel.css`. Solves inability to edit or remove saved palettes and declutters the var list column.

## 00:05 [06-07-2026]

- Open source release prep: wheel column left padding (18px) and overflow fixes so HSL labels, scale swatches, and toolbar tooltips no longer clip on hover (`huekit-panel.css`, `ToolbarTip.tsx`); scale hover uses inset transform instead of outline-offset. Added `README.md`, `CONTRIBUTING.md`, `LICENSE` (MIT), contributing section on landing, GitHub links, package rename to `huekit`. Repo renamed to `huekit` (public), deployed to https://huekits.vercel.app (`huekit.vercel.app` globally taken on Vercel).

## 23:55 [05-07-2026]

- HueKit polish + DialKit landing: Aeonik Pro (`public/fonts/`, `app/globals.css`, `huekit-panel.css`); spacing pass (panel 520px, wheel col 240px, removed redundant wheel var label, looser sliders/scale); drag fix (`HueKitRoot.tsx` visual-bounds clamp for right-origin `marginLeft`, `panelRef` height, origin flip on drag); HSL/Hex format toggle in `WheelPicker.tsx` + `hslToHex`/`formatColor` in `lib/huekit-color.ts`; DialKit-style landing (`components/landing/`, `app/page.tsx`, landing CSS); `README.md` + `docs/HUEKIT.md`. Solves cramped panel, blocked right-edge drag, missing docs/marketing, and hex preference in picker.

## 23:45 [05-07-2026]

- HueKit UX pass: long-hover toolbar tooltips (`ToolbarTip.tsx`, 600ms delay, dark toast, reduced-motion instant), panel drag via header grab handle (`HueKitRoot.tsx`, persists position), squircle shadow fix (removed CSS `boxShadow` on bubble button; SVG-only `feDropShadow` on squircle in `HueKitIcon.tsx`/`public/huekit-icon.svg`, unique filter IDs, no shadow on dial knob), horizontal wheel layout (panel 280→500px when var selected, wheel column beside var list in `WheelPicker.tsx`/`huekit-panel.css`). Solves wacky rectangular bubble shadow, stacked vertical wheel, missing toolbar hints, and immovable open panel.

## 23:18 [05-07-2026]

- DialKit-aligned HueKit polish: `components/huekit/huekit-panel.css` (glass `#212121` panel, hidden scrollbars, DialKit row/slider tokens), `components/huekit/icons.tsx` (inline SVG toolbar icons + clipboard/check swap). Single `.huekit-scroll` container replaces triple nested scrollbars; shade scale uses `grid-cols-10`. `HueKitRoot` — 280px panel, header icon toolbar (eyedropper, reset all, copy), spring bubble tap, corner-aware transform origin. `PalettePanel` — dirty amber dot, collapsible saved palettes, icon save. Solves ugly nested scrollbars and mismatched dev-tool chrome for daily work usage.

## 23:10 [05-07-2026]

- Reverted squircle box shading in `HueKitIcon.tsx` and `public/huekit-icon.svg` to the original vertical neomorphic gradient (`#2a2a2e` → `#141416`, `rx=16`, flat `#0e0e10` well). Preview page HueKit wordmark lockup unchanged.

## 23:08 [05-07-2026]

- Revamped `HueKitIcon.tsx` and `public/huekit-icon.svg`: softer squircle, radial well inset, tighter hue dots, layered white dial knob (no overlap with red dot). `public/icon-preview.html` now shows a horizontal lockup with the icon + **HueKit** wordmark (split weight: Hue / Kit); wordmark preview-only, bubble unchanged.

## 22:55 [05-07-2026]

- Pivoted to **HueKit** (DialKit for colors): `components/huekit/` module with `HueKitRoot` (draggable neomorphic bubble + panel), `useColorVars` (CSS variable scan/apply/reset, localStorage palettes, copy export), `WheelPicker` (hue ring + shade arc + HSL sliders + 10-step scale), `PalettePanel`, `lib/huekit-color.ts`. Neomorphic app icon in `HueKitIcon.tsx` + `public/huekit-icon.svg` + `public/icon-preview.html`. Demo page and `:root` vars (`--hue-accent`, `--hue-surface`, etc.) in `app/globals.css`/`app/page.tsx`; `HueKitRoot` mounted in `app/layout.tsx`. Solves live shade experimentation on any CSS-variable-driven site without per-component wiring.

## 20:22 [05-07-2026]

- Removed the white hover outline from the inner shade dots in `components/ColorWheelPopover.tsx` — they keep the spring scale-up on hover, the ring stays on the outer hue dots only. The shades already read as one family; outlining them was noise.

- Fixed hue switching: the shade-arc container (`absolute inset-0` in `components/ColorWheelPopover.tsx`) was invisibly covering the whole wheel and swallowing clicks on other hue dots — now `pointer-events-none` with `pointer-events-auto` on the shade buttons, so you can hop between hues freely. Added a `HoverRing` component: white outline (same treatment as the selected state) on hover and keyboard focus for both hue and shade dots, opacity-only transition. Solves "can't switch colors after picking one" and makes hover targets explicit.

- Smoother popover in/out per Emil's origin-aware guidance: `transformOrigin` now aims at the wheel trigger's measured center (`PANEL_ORIGIN` in `lib/picker-preset.ts`, browser-measured 126px/-38px) so the panel grows out of the trigger instead of its own corner; entrance switched to a duration+bounce spring (`SPRING.panel` 0.4s bounce 0), dropped the `y` slide (scale + origin carries the direction), exit is a faster 150ms quint ease-out (`PANEL_EXIT`) for asymmetric enter/exit. `components/ColorWheelPopover.tsx` updated. Solves the entrance feeling like a detached corner-slide.

- Popover now dismisses itself when the pointer leaves it (marketplace-theme hover behavior): `scheduleClose`/`cancelClose` timer pair in `components/SearchBar.tsx` with `HOVER_CLOSE_DELAY_MS` (320ms grace) frozen in `lib/picker-preset.ts`, hover handlers threaded into `components/ColorWheelPopover.tsx` via `onHoverIn`/`onHoverOut`. Gated to `(hover: hover) and (pointer: fine)` so touch keeps tap-to-toggle; grace period covers the trigger-to-panel gap. Solves the popover lingering after the cursor moves on.

## 20:05 [05-07-2026]

- Converged the picked wireframe (variation 2, Hue ring + shades) into the high-fidelity dark build: Next.js 16 + Tailwind 4 + framer-motion on port 3320. `app/page.tsx` (dark canvas, masonry skeleton that tints toward the picked color), `components/SearchBar.tsx` (Cosmos-style bar, color token, wheel trigger, Search state), `components/ColorWheelPopover.tsx` (12-hue lit-sphere ring, 5-shade inner arc bloom with damped springs, keyboard arrows/Escape, reduced-motion branches), `lib/picker-preset.ts` (frozen geometry, palette, spring values). Fixed an SVG trig hydration mismatch by rounding trigger-icon coordinates to 2 decimals. Solves the characterless saturation-square picker by carrying the dot-wheel motif through the whole interaction.

## 19:20 [05-07-2026]

- Created `prototypes/color-search.html` — prototype-md divergence round for the search bar color-search popover. Five interaction models (Dot ring, Hue ring + shades, Orbital scrub, Dot grid, Inline bloom) as prefetched screens with a pill tab switcher; shared wireframe search-bar stage (`buildStage`) with color token + Search button state, popover plumbing (`attachPopover`), and per-variation IIFEs with isolated state. Solves the "one-shot UI" problem: interaction models are compared side-by-side at wireframe fidelity before any high-fidelity build.
