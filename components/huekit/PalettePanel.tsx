"use client";

import type { ColorVar } from "@/components/huekit/useColorVars";

export function PalettePanel({
  vars, selected, onSelect, onReset,
}: {
  vars: ColorVar[];
  selected: string | null;
  onSelect: (name: string) => void;
  onReset: (name: string) => void;
}) {
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
