"use client";

import { useCallback, useEffect, useState } from "react";
import { hslCss, isColorValue, parseColor, type Hsl } from "@/lib/huekit-color";

export type ColorVar = {
  name: string;
  original: string;
  current: string;
  hsl: Hsl;
};

export type SavedPalette = {
  id: string;
  name: string;
  vars: Record<string, string>;
  savedAt: string;
};

const PALETTE_KEY = "huekit-palettes";
const BUBBLE_POS_KEY = "huekit-bubble-pos";
const MAX_PALETTES = 20;

function collectVarNames(): string[] {
  const names = new Set<string>();
  for (const sheet of [...document.styleSheets]) {
    try {
      for (const rule of [...sheet.cssRules]) {
        if (!(rule instanceof CSSStyleRule)) continue;
        for (const i of rule.style) {
          if (i.startsWith("--")) names.add(i);
        }
      }
    } catch {
      // cross-origin stylesheet
    }
  }
  const root = getComputedStyle(document.documentElement);
  return [...names]
    .filter((name) => {
      const v = root.getPropertyValue(name).trim();
      return v && isColorValue(v);
    })
    .sort();
}

function readVars(names: string[], originals: Record<string, string>): ColorVar[] {
  const root = getComputedStyle(document.documentElement);
  const inline = document.documentElement.style;
  return names.flatMap((name) => {
    const fromInline = inline.getPropertyValue(name).trim();
    const computed = root.getPropertyValue(name).trim();
    const current = fromInline || computed;
    if (!isColorValue(current)) return [];
    const hsl = parseColor(current)!;
    const original = originals[name] ?? computed;
    return [{ name, original, current, hsl }];
  });
}

function currentVarSnapshot(vars: ColorVar[]): Record<string, string> {
  return Object.fromEntries(vars.map((v) => [v.name, v.current]));
}

function persistPalettes(next: SavedPalette[]) {
  localStorage.setItem(PALETTE_KEY, JSON.stringify(next));
}

export function useColorVars() {
  const [vars, setVars] = useState<ColorVar[]>([]);
  const [originals, setOriginals] = useState<Record<string, string>>({});
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);
  const [activePaletteId, setActivePaletteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const scan = useCallback(() => {
    const names = collectVarNames();
    const root = getComputedStyle(document.documentElement);
    setOriginals((prev) => {
      const snap = { ...prev };
      for (const name of names) {
        if (!snap[name]) snap[name] = root.getPropertyValue(name).trim();
      }
      return snap;
    });
    setVars((prev) => {
      const snap: Record<string, string> = {};
      for (const name of names) {
        const v = prev.find((p) => p.name === name);
        snap[name] = v?.original ?? root.getPropertyValue(name).trim();
      }
      return readVars(names, snap);
    });
  }, []);

  useEffect(() => {
    scan();
    try {
      const raw = localStorage.getItem(PALETTE_KEY);
      if (raw) setPalettes(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [scan]);

  const applyVar = useCallback((name: string, css: string) => {
    document.documentElement.style.setProperty(name, css);
    setVars((prev) =>
      prev.map((v) =>
        v.name === name ? { ...v, current: css, hsl: parseColor(css)! } : v
      )
    );
  }, []);

  const resetVar = useCallback((name: string) => {
    document.documentElement.style.removeProperty(name);
    setVars((prev) =>
      prev.map((v) => {
        if (v.name !== name) return v;
        const css = originals[name] ?? v.original;
        return { ...v, current: css, hsl: parseColor(css)! };
      })
    );
  }, [originals]);

  const resetAll = useCallback(() => {
    for (const v of vars) document.documentElement.style.removeProperty(v.name);
    setActivePaletteId(null);
    scan();
  }, [vars, scan]);

  const savePaletteAs = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const entry: SavedPalette = {
      id: crypto.randomUUID(),
      name: trimmed,
      vars: currentVarSnapshot(vars),
      savedAt: new Date().toISOString(),
    };
    setPalettes((prev) => {
      const next = [entry, ...prev].slice(0, MAX_PALETTES);
      persistPalettes(next);
      return next;
    });
    setActivePaletteId(entry.id);
  }, [vars]);

  const loadPalette = useCallback((id: string) => {
    const palette = palettes.find((p) => p.id === id);
    if (!palette) return;
    for (const [name, css] of Object.entries(palette.vars)) {
      document.documentElement.style.setProperty(name, css);
    }
    setActivePaletteId(id);
    scan();
  }, [palettes, scan]);

  const updateActivePalette = useCallback(() => {
    if (!activePaletteId) return;
    const snapshot = currentVarSnapshot(vars);
    setPalettes((prev) => {
      const next = prev.map((p) =>
        p.id === activePaletteId
          ? { ...p, vars: snapshot, savedAt: new Date().toISOString() }
          : p
      );
      persistPalettes(next);
      return next;
    });
  }, [activePaletteId, vars]);

  const renamePalette = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPalettes((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p));
      persistPalettes(next);
      return next;
    });
  }, []);

  const deletePalette = useCallback((id: string) => {
    setPalettes((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persistPalettes(next);
      return next;
    });
    setActivePaletteId((prev) => (prev === id ? null : prev));
  }, []);

  const exportCss = useCallback(() => {
    const lines = vars.map((v) => `  ${v.name}: ${v.current};`);
    return `:root {\n${lines.join("\n")}\n}`;
  }, [vars]);

  const selectedVar = vars.find((v) => v.name === selected) ?? null;
  const activePalette = palettes.find((p) => p.id === activePaletteId) ?? null;

  const setSelectedHsl = useCallback((hsl: Hsl) => {
    if (!selected) return;
    applyVar(selected, hslCss(hsl.h, hsl.s, hsl.l));
  }, [selected, applyVar]);

  return {
    vars,
    selected,
    setSelected,
    selectedVar,
    applyVar,
    resetVar,
    resetAll,
    savePaletteAs,
    loadPalette,
    updateActivePalette,
    renamePalette,
    deletePalette,
    palettes,
    activePaletteId,
    activePalette,
    exportCss,
    setSelectedHsl,
    scan,
  };
}

export function loadBubblePos(): { x: number; y: number } | null {
  try {
    const raw = localStorage.getItem(BUBBLE_POS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveBubblePos(x: number, y: number) {
  localStorage.setItem(BUBBLE_POS_KEY, JSON.stringify({ x, y }));
}
