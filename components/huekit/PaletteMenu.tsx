"use client";

import { useEffect, useRef, useState } from "react";
import { IconPalette, IconPencil, IconPlus, IconTrash } from "@/components/huekit/icons";
import { ToolbarTip } from "@/components/huekit/ToolbarTip";
import type { SavedPalette } from "@/components/huekit/useColorVars";

export function PaletteMenu({
  palettes,
  activePaletteId,
  activePalette,
  onLoad,
  onSaveAs,
  onUpdate,
  onRename,
  onDelete,
}: {
  palettes: SavedPalette[];
  activePaletteId: string | null;
  activePalette: SavedPalette | null;
  onLoad: (id: string) => void;
  onSaveAs: (name: string) => void;
  onUpdate: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (editingId) {
          setEditingId(null);
          setEditName("");
        } else {
          setOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, editingId]);

  function startRename(p: SavedPalette) {
    setEditingId(p.id);
    setEditName(p.name);
  }

  function commitRename(id: string) {
    const trimmed = editName.trim();
    if (trimmed) onRename(id, trimmed);
    setEditingId(null);
    setEditName("");
  }

  function handleSaveAs() {
    const trimmed = saveName.trim();
    if (!trimmed) return;
    onSaveAs(trimmed);
    setSaveName("");
  }

  const label = activePalette ? activePalette.name : "Palettes";
  const tipLabel = activePalette ? activePalette.name : "Saved palettes";

  return (
    <div ref={rootRef} className="huekit-palette-menu-wrap">
      <ToolbarTip label={tipLabel}>
        <button
          type="button"
          className="huekit-toolbar-btn huekit-palette-toolbar-btn"
          aria-label={activePalette ? `Palette: ${activePalette.name}` : "Saved palettes"}
          aria-haspopup="menu"
          aria-expanded={open}
          data-active={!!activePaletteId}
          onClick={() => setOpen((o) => !o)}
        >
          <IconPalette />
          <span className="huekit-palette-btn-label">{label}</span>
        </button>
      </ToolbarTip>

      {open && (
        <div className="huekit-palette-menu" role="menu">
          {palettes.length === 0 ? (
            <p className="huekit-palette-empty">No saved palettes yet</p>
          ) : (
            <ul className="huekit-palette-list">
              {palettes.map((p) => (
                <li key={p.id} role="none">
                  {editingId === p.id ? (
                    <input
                      type="text"
                      className="huekit-palette-rename-input"
                      value={editName}
                      autoFocus
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename(p.id);
                        if (e.key === "Escape") {
                          setEditingId(null);
                          setEditName("");
                        }
                      }}
                      onBlur={() => commitRename(p.id)}
                    />
                  ) : (
                    <div
                      className="huekit-palette-item"
                      data-active={activePaletteId === p.id}
                      role="menuitem"
                    >
                      <button
                        type="button"
                        className="huekit-palette-item-load"
                        onClick={() => {
                          onLoad(p.id);
                          setOpen(false);
                        }}
                      >
                        {p.name}
                      </button>
                      <div className="huekit-palette-item-actions">
                        <button
                          type="button"
                          className="huekit-palette-item-btn"
                          aria-label={`Rename ${p.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            startRename(p);
                          }}
                        >
                          <IconPencil />
                        </button>
                        <button
                          type="button"
                          className="huekit-palette-item-btn"
                          aria-label={`Delete ${p.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(p.id);
                          }}
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="huekit-palette-menu-footer">
            <div className="huekit-palette-footer-row">
              <button
                type="button"
                className="huekit-palette-footer-btn"
                disabled={!activePaletteId}
                onClick={() => {
                  onUpdate();
                  setOpen(false);
                }}
              >
                Update
              </button>
            </div>
            <div className="huekit-palette-footer-save flex gap-2">
              <input
                type="text"
                className="huekit-input"
                placeholder="Save as…"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveAs();
                }}
              />
              <button
                type="button"
                aria-label="Save palette"
                className="huekit-toolbar-btn disabled:opacity-40"
                disabled={!saveName.trim()}
                onClick={handleSaveAs}
              >
                <IconPlus />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
