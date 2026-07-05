# HueKit architecture

HueKit is a client-side dev overlay. It does not require per-component wiring: mount once, define CSS variables, tune live.

## Data flow

```
stylesheets → collect --* names → filter color values → ColorVar[]
     ↓
user selects var → WheelPicker edits HSL
     ↓
document.documentElement.style.setProperty(name, css)
     ↓
page re-renders with new computed values
```

## Scan algorithm

`collectVarNames()` in `useColorVars.ts`:

1. Iterate `document.styleSheets`.
2. For each `CSSStyleRule`, collect property names starting with `--`.
3. Cross-origin stylesheets throw on `cssRules`; those are skipped silently.
4. Filter names where `getComputedStyle(document.documentElement).getPropertyValue(name)` parses as a color via `parseColor()`.

On first scan, each var's computed value is stored as `original` for dirty detection and reset.

## Apply and reset

- **Apply:** `document.documentElement.style.setProperty(name, value)` writes inline on `:root`. Inline wins over stylesheet rules until removed.
- **Reset one:** `removeProperty(name)` restores stylesheet value; state re-reads from computed style.
- **Reset all:** removes inline overrides for every tracked var, then re-scans.

Dirty state: `current !== original` (amber dot in var list).

## Color parsing

`lib/huekit-color.ts` supports:

- Hex (`#rgb`, `#rrggbb`)
- HSL / HSLA (space-separated modern syntax)
- RGB / RGBA

Export uses `hslCss()` for applied values. Format toggle in the picker is display-only unless you paste hex (which updates the var via HSL internally).

## Palettes

Saved to `localStorage` key `huekit-palettes`:

```json
{ "id": "uuid", "name": "...", "vars": { "--hue-accent": "hsl(...)" }, "savedAt": "ISO" }
```

Max 20 entries (newest first). Load applies all vars via `setProperty` then re-scans.

## Panel position

`huekit-bubble-pos` stores `{ x, y }` anchor for the bubble top-left.

When the panel opens:

- If bubble center is left of viewport midpoint, panel grows from top-left.
- Otherwise panel uses `marginLeft: -(panelWidth - bubbleSize)` so the bubble stays at the anchor while the panel extends left.

Drag clamping uses **visual panel bounds** (accounts for right-origin negative margin), not raw anchor x alone.

## Picker UI

- **Horizontal layout:** var list (280px) + wheel column (240px) when a var is selected. Panel width 280 → 520px.
- **Format toggle:** `huekit-color-format` in localStorage (`hsl` | `hex`).
- **Toolbar:** eyedropper, reset all, copy CSS. Long-hover tooltips (600ms).

## Browser notes

- **EyeDropper API:** Chrome/Edge only; button disabled elsewhere.
- **Fonts:** Aeonik Pro in panel and landing; CSS var names stay monospace.
- **Production:** mount only in dev or gate behind an env flag if you do not want the overlay in production builds.

## File map

| File | Role |
|------|------|
| `HueKitRoot.tsx` | Bubble, panel shell, drag, toolbar |
| `useColorVars.ts` | Scan, apply, reset, palettes, export |
| `WheelPicker.tsx` | Hue ring, shade arc, sliders, hex, scale |
| `PalettePanel.tsx` | Var list, save/load palettes |
| `huekit-color.ts` | Parse, hslCss, hslToHex, shadeScale |
| `huekit-panel.css` | Glass panel tokens and layout |
