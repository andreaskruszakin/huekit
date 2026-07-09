"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HueKitIcon } from "@/components/huekit/HueKitIcon";
import {
  IconClose, IconCopySwap, IconEyedropper, IconReset,
} from "@/components/huekit/icons";
import { PaletteMenu } from "@/components/huekit/PaletteMenu";
import { PalettePanel } from "@/components/huekit/PalettePanel";
import { ToolbarTip } from "@/components/huekit/ToolbarTip";
import { WheelPicker } from "@/components/huekit/WheelPicker";
import { loadBubblePos, saveBubblePos, useColorVars } from "@/components/huekit/useColorVars";
import { parseColor } from "@/lib/huekit-color";
import { useHueKitTheme } from "@/lib/huekit-theme";
import { PANEL_EXIT, SPRING } from "@/lib/huekit-preset";
import "./huekit-panel.css";

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
  }
}

const BUBBLE_SIZE = 56;
const PANEL_WIDTH = 280;
const PANEL_EXPANDED = 520;
const WHEEL_COL = 240;
const FALLBACK_PANEL_H = 420;
const DRAG_THRESHOLD = 5;

function visualLeft(x: number, origin: "left" | "right", open: boolean, panelW: number) {
  if (!open || origin === "left") return x;
  return x - (panelW - BUBBLE_SIZE);
}

function anchorFromVisualLeft(
  visualLeftPos: number,
  origin: "left" | "right",
  open: boolean,
  panelW: number,
) {
  if (!open || origin === "left") return visualLeftPos;
  return visualLeftPos + (panelW - BUBBLE_SIZE);
}

export function HueKitRoot() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 16, y: 16 });
  const [copied, setCopied] = useState(false);
  const drag = useRef({ dx: 0, dy: 0, sx: 0, sy: 0, active: false, moved: false, fromHeader: false });
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const theme = useHueKitTheme();

  const {
    vars, selected, setSelected, selectedVar, resetVar, resetAll,
    savePaletteAs, loadPalette, updateActivePalette, renamePalette, deletePalette,
    palettes, activePaletteId, activePalette, exportCss, setSelectedHsl,
  } = useColorVars();

  const [panelOrigin, setPanelOrigin] = useState<"left" | "right">("left");
  const expanded = !!selectedVar;
  const panelWidth = expanded ? PANEL_EXPANDED : PANEL_WIDTH;

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

  const getPanelHeight = useCallback(() => {
    return panelRef.current?.getBoundingClientRect().height ?? FALLBACK_PANEL_H;
  }, []);

  const clampPos = useCallback((
    x: number,
    y: number,
    w: number,
    h: number,
    opts?: { open?: boolean; origin?: "left" | "right" },
  ) => {
    const isOpen = opts?.open ?? open;
    const origin = opts?.origin ?? panelOrigin;
    const left = visualLeft(x, origin, isOpen, w);
    const clampedLeft = Math.max(8, Math.min(window.innerWidth - w - 8, left));
    const clampedX = anchorFromVisualLeft(clampedLeft, origin, isOpen, w);
    return {
      x: clampedX,
      y: Math.max(8, Math.min(window.innerHeight - h - 8, y)),
    };
  }, [open, panelOrigin]);

  const onBubblePointerDown = useCallback((e: React.PointerEvent) => {
    if (open) return;
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y, sx: e.clientX, sy: e.clientY, active: true, moved: false, fromHeader: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [open, pos]);

  const onHeaderPointerDown = useCallback((e: React.PointerEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("button, input, .huekit-palette-menu")) return;
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y, sx: e.clientX, sy: e.clientY, active: true, moved: false, fromHeader: true };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active) return;
    if (Math.hypot(e.clientX - drag.current.sx, e.clientY - drag.current.sy) > DRAG_THRESHOLD) {
      drag.current.moved = true;
    }
    if (!drag.current.moved) return;
    const fromHeader = drag.current.fromHeader;
    const w = fromHeader ? panelWidth : BUBBLE_SIZE;
    const h = fromHeader ? getPanelHeight() : BUBBLE_SIZE;
    const rawX = e.clientX - drag.current.dx;
    const rawY = e.clientY - drag.current.dy;

    if (fromHeader && open) {
      const centerX = visualLeft(rawX, panelOrigin, true, panelWidth) + panelWidth / 2;
      const nextOrigin = centerX < window.innerWidth / 2 ? "left" : "right";
      if (nextOrigin !== panelOrigin) setPanelOrigin(nextOrigin);
      const next = clampPos(rawX, rawY, w, h, { open: true, origin: nextOrigin });
      setPos(next);
      return;
    }

    const next = clampPos(rawX, rawY, w, h, { open: fromHeader ? open : false, origin: panelOrigin });
    setPos(next);
  }, [clampPos, panelWidth, getPanelHeight, open, panelOrigin]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const fromHeader = drag.current.fromHeader;
    const w = fromHeader ? panelWidth : BUBBLE_SIZE;
    const h = fromHeader ? getPanelHeight() : BUBBLE_SIZE;
    const rawX = e.clientX - drag.current.dx;
    const rawY = e.clientY - drag.current.dy;
    const next = clampPos(rawX, rawY, w, h, { open: fromHeader ? open : false, origin: panelOrigin });
    setPos(next);
    saveBubblePos(next.x, next.y);
  }, [clampPos, panelWidth, getPanelHeight, open, panelOrigin]);

  const eyedropper = useCallback(async () => {
    if (!window.EyeDropper || !selected) return;
    try {
      const { sRGBHex } = await new window.EyeDropper!().open();
      const hsl = parseColor(sRGBHex);
      if (hsl) setSelectedHsl(hsl);
    } catch { /* cancelled */ }
  }, [selected, setSelectedHsl]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(exportCss());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [exportCss]);

  const hasEyedropper = typeof window !== "undefined" && !!window.EyeDropper;
  const rightOffset = panelWidth - BUBBLE_SIZE;

  return (
    <div className="huekit-root fixed inset-0 z-50 pointer-events-none" data-theme={theme}>
      <motion.div
        className="pointer-events-auto absolute"
        style={{ left: pos.x, top: pos.y }}
        drag={false}
      >
        {!open && (
          <motion.button
            type="button"
            aria-label="Open HueKit"
            aria-expanded={open}
            className="huekit-bubble-btn cursor-grab touch-none active:cursor-grabbing"
            onPointerDown={onBubblePointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            whileTap={reduce ? undefined : { scale: 0.9 }}
            transition={{ type: "spring", visualDuration: 0.15, bounce: 0.3 }}
            onClick={() => {
              if (!drag.current.moved) {
                const bubbleCenterX = pos.x + BUBBLE_SIZE / 2;
                setPanelOrigin(bubbleCenterX < window.innerWidth / 2 ? "left" : "right");
                setOpen(true);
              }
            }}
          >
            <HueKitIcon size={BUBBLE_SIZE} />
          </motion.button>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-label="HueKit"
              className="huekit-panel"
              data-expanded={expanded}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, transition: PANEL_EXIT }}
              transition={SPRING.panel}
              style={{
                width: panelWidth,
                transformOrigin: panelOrigin === "left" ? "top left" : "top right",
                ...(panelOrigin === "right" ? { marginLeft: -rightOffset } : {}),
              }}
            >
              <header
                className="huekit-panel-header huekit-panel-drag-handle"
                onPointerDown={onHeaderPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              >
                <div className="huekit-panel-title-row">
                  <div className="huekit-panel-title">
                    <HueKitIcon size={24} />
                    <span>HueKit</span>
                  </div>
                  <ToolbarTip label="Close">
                    <button
                      type="button"
                      aria-label="Close HueKit"
                      className="huekit-toolbar-btn"
                      onClick={() => setOpen(false)}
                    >
                      <IconClose />
                    </button>
                  </ToolbarTip>
                </div>
                <div className="huekit-toolbar">
                  <div className="huekit-toolbar-icons">
                    <ToolbarTip label="Eyedropper">
                      <button
                        type="button"
                        aria-label="Pick color from screen"
                        className="huekit-toolbar-btn"
                        disabled={!selected || !hasEyedropper}
                        onClick={eyedropper}
                      >
                        <IconEyedropper />
                      </button>
                    </ToolbarTip>
                    <ToolbarTip label="Reset all">
                      <button
                        type="button"
                        aria-label="Reset all variables"
                        className="huekit-toolbar-btn"
                        onClick={resetAll}
                      >
                        <IconReset />
                      </button>
                    </ToolbarTip>
                    <ToolbarTip label={copied ? "Copied!" : "Copy CSS"}>
                      <button
                        type="button"
                        aria-label="Copy CSS block"
                        className="huekit-toolbar-btn"
                        onClick={handleCopy}
                      >
                        <IconCopySwap copied={copied} />
                      </button>
                    </ToolbarTip>
                  </div>
                  <PaletteMenu
                    palettes={palettes}
                    activePaletteId={activePaletteId}
                    activePalette={activePalette}
                    onLoad={loadPalette}
                    onSaveAs={savePaletteAs}
                    onUpdate={updateActivePalette}
                    onRename={renamePalette}
                    onDelete={deletePalette}
                  />
                </div>
              </header>

              <div className="huekit-scroll">
                <div className="huekit-content-row">
                  <div className="huekit-content-left">
                    <PalettePanel
                      vars={vars}
                      selected={selected}
                      onSelect={setSelected}
                      onReset={resetVar}
                    />
                  </div>
                  <AnimatePresence>
                    {selectedVar && (
                      <motion.div
                        key="wheel-col"
                        className="huekit-content-right"
                        style={{ width: WHEEL_COL, flexBasis: WHEEL_COL }}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }}
                        animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }}
                        transition={{ duration: reduce ? 0 : 0.18, ease: "easeOut" }}
                      >
                        <WheelPicker
                          hsl={selectedVar.hsl}
                          onChange={setSelectedHsl}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
