"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  HUES, HUE_NAMES, SHADE_LIGHTNESS, WHEEL, SPRING, SHADE_STAGGER_S, sphereFill,
} from "@/lib/picker-preset";
import { formatColor, hslToHex, parseColor, shadeScale, type Hsl } from "@/lib/huekit-color";

const FORMAT_KEY = "huekit-color-format";
type ColorFormat = "hsl" | "hex";

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;

function loadFormat(): ColorFormat {
  try {
    const v = localStorage.getItem(FORMAT_KEY);
    return v === "hex" ? "hex" : "hsl";
  } catch {
    return "hsl";
  }
}

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
    <label className="huekit-slider-row">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <span>{value}</span>
    </label>
  );
}

function FormatToggle({ mode, onChange }: { mode: ColorFormat; onChange: (m: ColorFormat) => void }) {
  return (
    <div className="huekit-format-toggle" role="group" aria-label="Color format">
      {(["hsl", "hex"] as const).map((m) => (
        <button
          key={m}
          type="button"
          className="huekit-format-btn"
          data-active={mode === m}
          onClick={() => onChange(m)}
        >
          {m.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function WheelPicker({
  hsl, onChange,
}: {
  hsl: Hsl;
  onChange: (h: Hsl) => void;
}) {
  const [activeHue, setActiveHue] = useState<number | null>(null);
  const [format, setFormat] = useState<ColorFormat>("hsl");
  const [hexInput, setHexInput] = useState("");
  const reduce = useReducedMotion();
  const wheelRef = useRef<HTMLDivElement>(null);
  const size = 180;
  const scale = size / WHEEL.size;

  useEffect(() => {
    setFormat(loadFormat());
  }, []);

  useEffect(() => {
    setHexInput(hslToHex(hsl.h, hsl.s, hsl.l));
  }, [hsl.h, hsl.s, hsl.l]);

  function pickFormat(m: ColorFormat) {
    setFormat(m);
    try { localStorage.setItem(FORMAT_KEY, m); } catch { /* ignore */ }
  }

  function pickHue(h: number) {
    setActiveHue(h);
    onChange({ h, s: hsl.s, l: hsl.l });
  }

  function pickShade(h: number, l: number) {
    onChange({ h, s: 72, l });
    setActiveHue(h);
  }

  function commitHex(raw: string) {
    const parsed = parseColor(raw);
    if (parsed) onChange(parsed);
  }

  return (
    <div className="huekit-wheel-col">
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
              ...dotPos(WHEEL.hueRadius * scale, h, WHEEL.hueDot * scale * 0.92, size / 2),
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
                      ...dotPos(WHEEL.shadeRadius * scale, deg, WHEEL.shadeDot * scale * 0.92, size / 2),
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

      <div className="mt-3 flex items-center justify-between gap-2">
        <FormatToggle mode={format} onChange={pickFormat} />
        <span className="huekit-color-readout" title={formatColor(hsl, format)}>
          {formatColor(hsl, format)}
        </span>
      </div>

      {format === "hsl" ? (
        <div className="mt-1 space-y-1">
          <Slider label="H" value={Math.round(hsl.h)} min={0} max={360} onChange={(h) => onChange({ ...hsl, h })} />
          <Slider label="S" value={Math.round(hsl.s)} min={0} max={100} onChange={(s) => onChange({ ...hsl, s })} />
          <Slider label="L" value={Math.round(hsl.l)} min={0} max={100} onChange={(l) => onChange({ ...hsl, l })} />
        </div>
      ) : (
        <label className="huekit-hex-input-row mt-2">
          <span className="sr-only">Hex color</span>
          <input
            type="text"
            className="huekit-hex-input"
            value={hexInput}
            spellCheck={false}
            onChange={(e) => {
              setHexInput(e.target.value);
              commitHex(e.target.value);
            }}
            onBlur={() => setHexInput(hslToHex(hsl.h, hsl.s, hsl.l))}
          />
        </label>
      )}

      <div className="huekit-scale-grid huekit-scale-grid-compact">
        {shadeScale(hsl.h, hsl.s).map((css, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Scale step ${i + 1}`}
            className="huekit-scale-swatch"
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
