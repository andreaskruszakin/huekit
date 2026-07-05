"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ColorWheelPopover } from "@/components/ColorWheelPopover";
import { HUES, SPRING, hsl, type PickedColor } from "@/lib/picker-preset";

function SearchGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="8" cy="8" r="5.5" />
      <path d="M12.5 12.5L16 16" />
    </svg>
  );
}

function LensGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M6 1.5H3.5A2 2 0 0 0 1.5 3.5V6" />
      <path d="M12 1.5h2.5a2 2 0 0 1 2 2V6" />
      <path d="M6 16.5H3.5a2 2 0 0 1-2-2V12" />
      <path d="M12 16.5h2.5a2 2 0 0 0 2-2V12" />
      <circle cx="9" cy="9" r="2.6" />
    </svg>
  );
}

function WheelGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      {HUES.map((h) => {
        const a = ((h - 90) * Math.PI) / 180;
        const cx = (10 + 7 * Math.cos(a)).toFixed(2);
        const cy = (10 + 7 * Math.sin(a)).toFixed(2);
        return <circle key={h} cx={cx} cy={cy} r="1.8" fill={hsl(h)} />;
      })}
    </svg>
  );
}

export function SearchBar({ onColorChange }: { onColorChange: (color: PickedColor | null) => void }) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState<PickedColor | null>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointer(e: PointerEvent) {
      if (!zoneRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  function pick(next: PickedColor) {
    setColor(next);
    onColorChange(next);
    setOpen(false);
  }

  function clear() {
    setColor(null);
    onColorChange(null);
  }

  return (
    <div ref={zoneRef} className="relative w-full max-w-[640px]">
      <div className="flex h-14 items-center gap-3 rounded-full border border-line bg-bar pl-5 pr-2">
        <span className="shrink-0 text-dim"><SearchGlyph /></span>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <AnimatePresence>
            {color && (
              <motion.span
                key="token"
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-white/[0.06] py-1 pl-1 pr-1.5 text-xs text-ink"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
                transition={SPRING.token}
              >
                <span
                  className="h-5 w-5 rounded-full"
                  style={{ background: color.css, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }}
                />
                {color.name}
                <button
                  aria-label="Remove color"
                  className="grid h-4 w-4 place-items-center rounded-full text-dim hover:bg-white/10 hover:text-ink"
                  onClick={clear}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                    <path d="M1 1l6 6M7 1L1 7" />
                  </svg>
                </button>
              </motion.span>
            )}
          </AnimatePresence>
          <span className="truncate text-sm text-dim">Try &lsquo;contemporary art&rsquo;</span>
        </div>

        <button aria-label="Visual search" className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-dim transition-colors hover:bg-white/[0.06] hover:text-ink">
          <LensGlyph />
        </button>

        <button
          aria-label="Color search"
          aria-haspopup="dialog"
          aria-expanded={open}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors hover:bg-white/[0.08] ${open ? "bg-white/[0.08]" : ""}`}
          onClick={() => setOpen((v) => !v)}
        >
          <WheelGlyph />
        </button>

        <motion.button
          className="h-10 shrink-0 rounded-full px-5 text-sm font-semibold"
          animate={{
            backgroundColor: color ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.06)",
            color: color ? "#0a0a0a" : "rgba(255,255,255,0.45)",
          }}
          transition={{ duration: 0.18 }}
          disabled={!color}
        >
          Search
        </motion.button>
      </div>

      <ColorWheelPopover open={open} onPick={pick} />
    </div>
  );
}
