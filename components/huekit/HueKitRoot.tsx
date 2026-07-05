"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HueKitIcon } from "@/components/huekit/HueKitIcon";
import { PalettePanel } from "@/components/huekit/PalettePanel";
import { WheelPicker } from "@/components/huekit/WheelPicker";
import { loadBubblePos, saveBubblePos, useColorVars } from "@/components/huekit/useColorVars";
import { parseColor } from "@/lib/huekit-color";
import { PANEL_EXIT, SPRING } from "@/lib/picker-preset";

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
  }
}

export function HueKitRoot() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 16, y: 16 });
  const drag = useRef({ dx: 0, dy: 0, active: false, moved: false });
  const reduce = useReducedMotion();

  const {
    vars, selected, setSelected, selectedVar, resetVar, resetAll,
    savePalette, loadPalette, palettes, exportCss, setSelectedHsl,
  } = useColorVars();

  useEffect(() => {
    const saved = loadBubblePos();
    if (saved) setPos(saved);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (open) return;
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y, active: true, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [open, pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.moved = true;
    const x = Math.max(8, Math.min(window.innerWidth - 64, e.clientX - drag.current.dx));
    const y = Math.max(8, Math.min(window.innerHeight - 64, e.clientY - drag.current.dy));
    setPos({ x, y });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const x = Math.max(8, Math.min(window.innerWidth - 64, e.clientX - drag.current.dx));
    const y = Math.max(8, Math.min(window.innerHeight - 64, e.clientY - drag.current.dy));
    saveBubblePos(x, y);
  }, []);

  const eyedropper = useCallback(async () => {
    if (!window.EyeDropper || !selected) return;
    try {
      const { sRGBHex } = await new window.EyeDropper!().open();
      const hsl = parseColor(sRGBHex);
      if (hsl) setSelectedHsl(hsl);
    } catch { /* cancelled */ }
  }, [selected, setSelectedHsl]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <motion.div
        className="pointer-events-auto absolute"
        style={{ left: pos.x, top: pos.y }}
        drag={false}
      >
        {!open && (
          <button
            type="button"
            aria-label="Open HueKit"
            aria-expanded={open}
            className="cursor-grab touch-none active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={() => {
              if (!drag.current.moved) setOpen(true);
            }}
          >
            <HueKitIcon size={56} />
          </button>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-label="HueKit"
              className="w-[300px] rounded-[20px] border border-line bg-panel shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, transition: PANEL_EXIT }}
              transition={SPRING.panel}
              style={{ transformOrigin: "top left" }}
            >
              <header className="flex items-center justify-between border-b border-line px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <HueKitIcon size={28} />
                  <span className="text-sm font-semibold text-ink">HueKit</span>
                </div>
                <button
                  type="button"
                  aria-label="Close HueKit"
                  className="grid h-7 w-7 place-items-center rounded-lg text-dim hover:bg-white/6 hover:text-ink"
                  onClick={() => setOpen(false)}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 1l8 8M9 1L1 9" />
                  </svg>
                </button>
              </header>

              <div className="max-h-[70vh] overflow-y-auto p-3">
                <PalettePanel
                  vars={vars}
                  selected={selected}
                  onSelect={setSelected}
                  onReset={resetVar}
                  onResetAll={resetAll}
                  onSave={savePalette}
                  onLoad={loadPalette}
                  palettes={palettes}
                  onExport={exportCss}
                  onEyedropper={eyedropper}
                />
                {selectedVar && (
                  <WheelPicker
                    varName={selectedVar.name}
                    hsl={selectedVar.hsl}
                    onChange={setSelectedHsl}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
