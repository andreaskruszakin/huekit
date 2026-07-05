"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  HUES, HUE_NAMES, SHADE_LIGHTNESS, WHEEL, SPRING, SHADE_STAGGER_S, sphereFill,
} from "@/lib/picker-preset";
import { hslCss, parseColor, shadeScale, type Hsl } from "@/lib/huekit-color";

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;

function HoverRing({ visible = false }: { visible?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ boxShadow: "0 0 0 2px #0a0a0a, 0 0 0 3px rgba(255,255,255,0.9)" }}
    />
  );
}

function dotPos(radius: number, deg: number, size: number, c = WHEEL.size / 2) {
  return {
    left: c + radius * Math.cos(rad(deg)) - size / 2,
    top: c + radius * Math.sin(rad(deg)) - size / 2,
    width: size,
    height: size,
  };
}

function Slider({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[11px] text-dim">
      <span className="w-3 tabular-nums">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-white"
      />
      <span className="w-7 text-right tabular-nums text-ink">{value}</span>
    </label>
  );
}

export function WheelPicker({
  hsl, onChange, varName,
}: {
  hsl: Hsl;
  onChange: (h: Hsl) => void;
  varName: string;
}) {
  const [activeHue, setActiveHue] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const wheelRef = useRef<HTMLDivElement>(null);
  const size = 200;
  const scale = size / WHEEL.size;

  function pickHue(h: number) {
    setActiveHue(h);
    onChange({ h, s: hsl.s, l: hsl.l });
  }

  function pickShade(h: number, l: number) {
    onChange({ h, s: 72, l });
    setActiveHue(h);
  }

  return (
    <div className="border-t border-line pt-3">
      <p className="mb-2 truncate text-[11px] text-dim">{varName}</p>
      <div
        ref={wheelRef}
        className="relative mx-auto"
        style={{ width: size, height: size }}
      >
        {HUES.map((h) => (
          <motion.button
            key={h}
            aria-label={HUE_NAMES[h]}
            className="group absolute rounded-full"
            style={{
              ...dotPos(WHEEL.hueRadius * scale, h, WHEEL.hueDot * scale, size / 2),
              background: sphereFill(h, 82, 56),
            }}
            whileHover={reduce ? undefined : { scale: 1.14 }}
            whileTap={reduce ? undefined : { scale: 0.94 }}
            transition={SPRING.hover}
            onClick={() => pickHue(h)}
          >
            <HoverRing visible={activeHue === h || Math.round(hsl.h / 30) * 30 % 360 === h} />
          </motion.button>
        ))}

        <AnimatePresence mode="wait">
          {activeHue !== null && (
            <motion.div key={activeHue} className="pointer-events-none absolute inset-0">
              {SHADE_LIGHTNESS.map((l, i) => {
                const deg = activeHue + (i - 2) * WHEEL.shadeSpreadDeg;
                return (
                  <motion.button
                    key={l}
                    aria-label={`Shade ${i + 1}`}
                    className="pointer-events-auto absolute rounded-full"
                    style={{
                      ...dotPos(WHEEL.shadeRadius * scale, deg, WHEEL.shadeDot * scale, size / 2),
                      background: sphereFill(activeHue, 72, l),
                    }}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.3 }}
                    animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
                    transition={{ ...SPRING.dot, delay: reduce ? 0 : i * SHADE_STAGGER_S }}
                    whileHover={reduce ? undefined : { scale: 1.16 }}
                    onClick={() => pickShade(activeHue, l)}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 space-y-1.5">
        <Slider label="H" value={Math.round(hsl.h)} min={0} max={360} onChange={(h) => onChange({ ...hsl, h })} />
        <Slider label="S" value={Math.round(hsl.s)} min={0} max={100} onChange={(s) => onChange({ ...hsl, s })} />
        <Slider label="L" value={Math.round(hsl.l)} min={0} max={100} onChange={(l) => onChange({ ...hsl, l })} />
      </div>

      <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
        {shadeScale(hsl.h, hsl.s).map((css, i) => (
          <button
            key={i}
            aria-label={`Scale step ${i + 1}`}
            className="h-6 w-6 shrink-0 rounded-md border border-white/10"
            style={{ background: css }}
            onClick={() => {
              const parsed = parseColor(css);
              if (parsed) onChange(parsed);
            }}
          />
        ))}
      </div>
    </div>
  );
}
