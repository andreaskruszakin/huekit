"use client";

import { useState } from "react";
import type { ColorVar, SavedPalette } from "@/components/huekit/useColorVars";
import { IconChevron, IconPlus } from "@/components/huekit/icons";

export function PalettePanel({
  vars, selected, onSelect, onReset, onSave, onLoad, palettes,
}: {
  vars: ColorVar[];
  selected: string | null;
  onSelect: (name: string) => void;
  onReset: (name: string) => void;
  onSave: (name: string) => void;
  onLoad: (p: SavedPalette) => void;
  palettes: SavedPalette[];
}) {
  const [saveName, setSaveName] = useState("");
  const [palettesOpen, setPalettesOpen] = useState(true);

  const selectedVar = vars.find((v) => v.name === selected);
  const selectedDirty = selectedVar && selectedVar.current !== selectedVar.original;

  return (
    <div className="flex flex-col gap-1">
      <div className="huekit-section-label">CSS variables</div>

      <ul className="space-y-0.5">
        {vars.map((v) => {
          const dirty = v.current !== v.original;
          return (
            <li key={v.name}>
              <button
                type="button"
                className="huekit-var-row"
                data-selected={selected === v.name}
                onClick={() => onSelect(v.name)}
              >
                <span className="huekit-swatch" style={{ background: v.current }} />
                <span className="min-w-0 flex-1 truncate">{v.name}</span>
                {dirty && <span className="huekit-dirty-dot" aria-label="Edited" />}
              </button>
            </li>
          );
        })}
        {vars.length === 0 && (
          <li className="huekit-empty">No color variables detected on :root</li>
        )}
      </ul>

      {selected && selectedDirty && (
        <button
          type="button"
          className="huekit-var-row mt-1 text-[11px]"
          onClick={() => onReset(selected)}
        >
          <IconResetInline />
          <span>Reset selected</span>
        </button>
      )}

      <div className="huekit-divider flex gap-2">
        <input
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder="Palette name"
          className="huekit-input"
          onKeyDown={(e) => {
            if (e.key === "Enter" && saveName.trim()) {
              onSave(saveName.trim());
              setSaveName("");
            }
          }}
        />
        <button
          type="button"
          aria-label="Save palette"
          title="Save palette"
          disabled={!saveName.trim()}
          className="huekit-toolbar-btn disabled:opacity-40"
          onClick={() => { onSave(saveName.trim()); setSaveName(""); }}
        >
          <IconPlus />
        </button>
      </div>

      {palettes.length > 0 && (
        <div className="mt-1">
          <button
            type="button"
            className="huekit-folder-header"
            aria-expanded={palettesOpen}
            onClick={() => setPalettesOpen((o) => !o)}
          >
            <IconChevron open={palettesOpen} />
            <span>Saved palettes</span>
            <span className="ml-auto text-[10px] font-normal text-[var(--hk-text-tertiary)]">
              {palettes.length}
            </span>
          </button>
          {palettesOpen && (
            <ul className="mt-0.5 space-y-0.5">
              {palettes.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="huekit-palette-row"
                    onClick={() => onLoad(p)}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function IconResetInline() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 2.25-5.97M3 4v5h5" />
    </svg>
  );
}
