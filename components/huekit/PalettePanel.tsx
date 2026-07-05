"use client";

import { useState } from "react";
import type { ColorVar, SavedPalette } from "@/components/huekit/useColorVars";

export function PalettePanel({
  vars, selected, onSelect, onReset, onResetAll, onSave, onLoad, palettes, onExport, onEyedropper,
}: {
  vars: ColorVar[];
  selected: string | null;
  onSelect: (name: string) => void;
  onReset: (name: string) => void;
  onResetAll: () => void;
  onSave: (name: string) => void;
  onLoad: (p: SavedPalette) => void;
  palettes: SavedPalette[];
  onExport: () => string;
  onEyedropper: () => void;
}) {
  const [saveName, setSaveName] = useState("");
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink">CSS variables</span>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Pick color from screen"
            className="rounded-md px-2 py-1 text-[11px] text-dim hover:bg-white/6 hover:text-ink"
            onClick={onEyedropper}
          >
            Dropper
          </button>
          <button
            type="button"
            className="rounded-md px-2 py-1 text-[11px] text-dim hover:bg-white/6 hover:text-ink"
            onClick={onResetAll}
          >
            Reset all
          </button>
        </div>
      </div>

      <ul className="max-h-40 space-y-1 overflow-y-auto">
        {vars.map((v) => {
          const dirty = v.current !== v.original;
          return (
            <li key={v.name}>
              <button
                type="button"
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] ${selected === v.name ? "bg-white/10 text-ink" : "text-dim hover:bg-white/5 hover:text-ink"}`}
                onClick={() => onSelect(v.name)}
              >
                <span
                  className="h-4 w-4 shrink-0 rounded-full border border-white/10"
                  style={{ background: v.current }}
                />
                <span className="min-w-0 flex-1 truncate font-mono">{v.name}</span>
                {dirty && <span className="shrink-0 text-[10px] text-amber-300/80">edited</span>}
              </button>
            </li>
          );
        })}
        {vars.length === 0 && (
          <li className="py-4 text-center text-[11px] text-dim">No color variables detected on :root</li>
        )}
      </ul>

      {selected && (
        <button
          type="button"
          className="text-[11px] text-dim hover:text-ink"
          onClick={() => onReset(selected)}
        >
          Reset selected to original
        </button>
      )}

      <div className="flex gap-2 border-t border-line pt-3">
        <input
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder="Palette name"
          className="min-w-0 flex-1 rounded-lg border border-line bg-white/4 px-2 py-1.5 text-[11px] text-ink placeholder:text-dim"
        />
        <button
          type="button"
          disabled={!saveName.trim()}
          className="shrink-0 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-semibold text-bg disabled:opacity-40"
          onClick={() => { onSave(saveName.trim()); setSaveName(""); }}
        >
          Save
        </button>
      </div>

      {palettes.length > 0 && (
        <ul className="max-h-24 space-y-1 overflow-y-auto">
          {palettes.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="w-full rounded-lg px-2 py-1 text-left text-[11px] text-dim hover:bg-white/5 hover:text-ink"
                onClick={() => onLoad(p)}
              >
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className="w-full rounded-lg border border-line py-2 text-[11px] text-dim hover:bg-white/5 hover:text-ink"
        onClick={async () => {
          await navigator.clipboard.writeText(onExport());
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "Copied" : "Copy CSS block"}
      </button>
    </div>
  );
}
