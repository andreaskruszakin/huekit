"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  HUES, HUE_NAMES, SHADE_LIGHTNESS, WHEEL, SPRING, SHADE_STAGGER_S,
  sphereFill, type PickedColor,
} from "@/lib/picker-preset";

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;

function dotPosition(radius: number, deg: number, size: number) {
  const c = WHEEL.size / 2;
  return {
    left: c + radius * Math.cos(rad(deg)) - size / 2,
    top: c + radius * Math.sin(rad(deg)) - size / 2,
    width: size,
    height: size,
  };
}

export function ColorWheelPopover({
  open, onPick, onHoverIn, onHoverOut,
}: {
  open: boolean;
  onPick: (color: PickedColor) => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
}) {
  const [activeHue, setActiveHue] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const wheelRef = useRef<HTMLDivElement>(null);

  function focusHue(offset: number) {
    const dots = wheelRef.current?.querySelectorAll<HTMLButtonElement>("[data-hue-dot]");
    if (!dots?.length) return;
    const current = [...dots].indexOf(document.activeElement as HTMLButtonElement);
    dots[(current + offset + dots.length) % dots.length].focus();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Color search"
          className="absolute right-0 top-[calc(100%+10px)] z-10 origin-top-right rounded-[20px] border border-line bg-panel p-5 shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -6 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.12 } }}
          transition={SPRING.panel}
          onPointerEnter={onHoverIn}
          onPointerLeave={onHoverOut}
        >
          <div
            ref={wheelRef}
            className="relative"
            style={{ width: WHEEL.size, height: WHEEL.size }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); focusHue(1); }
              if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); focusHue(-1); }
            }}
          >
            <AnimatePresence>
              {activeHue === null && (
                <motion.span
                  className="pointer-events-none absolute inset-0 grid place-items-center text-xs text-dim"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  Pick a hue
                </motion.span>
              )}
            </AnimatePresence>

            {HUES.map((h) => (
              <motion.button
                key={h}
                data-hue-dot
                aria-label={HUE_NAMES[h]}
                className="absolute rounded-full"
                style={{
                  ...dotPosition(WHEEL.hueRadius, h, WHEEL.hueDot),
                  background: sphereFill(h, 82, 56),
                  boxShadow: activeHue === h
                    ? "0 0 0 2px #161618, 0 0 0 3.5px rgba(255,255,255,0.9)"
                    : "inset 0 0 0 1px rgba(255,255,255,0.06)",
                }}
                whileHover={reduce ? undefined : { scale: 1.16 }}
                whileTap={reduce ? undefined : { scale: 0.94 }}
                transition={SPRING.hover}
                onClick={() => setActiveHue(h)}
              />
            ))}

            <AnimatePresence mode="wait">
              {activeHue !== null && (
                <motion.div key={activeHue} className="absolute inset-0">
                  {SHADE_LIGHTNESS.map((l, i) => {
                    const deg = activeHue + (i - 2) * WHEEL.shadeSpreadDeg;
                    return (
                      <motion.button
                        key={l}
                        aria-label={`${HUE_NAMES[activeHue]} shade ${i + 1}`}
                        className="absolute rounded-full"
                        style={{
                          ...dotPosition(WHEEL.shadeRadius, deg, WHEEL.shadeDot),
                          background: sphereFill(activeHue, 72, l),
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
                        }}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.3 }}
                        animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, transition: { duration: 0.1 } }}
                        transition={{ ...SPRING.dot, delay: reduce ? 0 : i * SHADE_STAGGER_S }}
                        whileHover={reduce ? undefined : { scale: 1.18 }}
                        whileTap={reduce ? undefined : { scale: 0.94 }}
                        onClick={() =>
                          onPick({ h: activeHue, s: 72, l, css: `hsl(${activeHue} 72% ${l}%)`, name: HUE_NAMES[activeHue] })
                        }
                      />
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
