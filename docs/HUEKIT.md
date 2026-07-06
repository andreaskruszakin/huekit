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

Max 20 entries (newest first).

**Header dropdown** (`PaletteMenu.tsx`):
- **Load** — click a palette row to apply vars and set it active
- **Rename** — pencil icon, inline edit, Enter to save
- **Delete** — trash icon, immediate removal
- **Update** — overwrite the active palette with current var values
- **Save as…** — create a new palette and set it active

`activePaletteId` tracks the loaded palette; cleared on reset all or delete of active entry.

Hook API: `savePaletteAs`, `loadPalette(id)`, `updateActivePalette`, `renamePalette`, `deletePalette`, `activePalette`.

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
- **Fonts:** Inter in panel chrome; CSS var names stay monospace. Docs site: [huekits.vercel.app](https://huekits.vercel.app).
- **Production:** mount only in dev or gate behind an env flag if you do not want the overlay in production builds.

## File map

| File | Role |
|------|------|
| `HueKitRoot.tsx` | Bubble, panel shell, drag, toolbar |
| `useColorVars.ts` | Scan, apply, reset, palettes, export |
| `WheelPicker.tsx` | Hue ring, shade arc, sliders, hex, scale |
| `PalettePanel.tsx` | Var list, per-var reset |
| `PaletteMenu.tsx` | Header palette dropdown (load, rename, delete, update, save as) |
| `huekit-color.ts` | Parse, hslCss, hslToHex, shadeScale |
| `huekit-preset.ts` | Wheel geometry and spring tokens |
| `huekit-panel.css` | Glass panel tokens and layout |
