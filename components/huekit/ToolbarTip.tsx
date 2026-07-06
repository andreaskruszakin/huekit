"use client";

import { useCallback, useLayoutEffect, useRef, useState, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const DELAY_MS = 600;
const GAP = 6;
const PAD = 8;

type TipPos = { top: number; left: number; transform: string };

function computeTipPos(rect: DOMRect, tipW: number, tipH: number): TipPos {
  const centerX = rect.left + rect.width / 2;
  let left = centerX;
  let transform = "translateX(-50%)";
  const half = tipW / 2;

  if (centerX - half < PAD) {
    left = PAD;
    transform = "translateX(0)";
  } else if (centerX + half > window.innerWidth - PAD) {
    left = window.innerWidth - PAD;
    transform = "translateX(-100%)";
  }

  const top = rect.top - tipH - GAP;
  return { top, left, transform };
}

export function ToolbarTip({
  label,
  children,
}: {
  label: string;
  children: ReactElement;
}) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<TipPos | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const wrapRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  const updatePos = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const tipEl = tipRef.current;
    const tipW = tipEl?.offsetWidth ?? 80;
    const tipH = tipEl?.offsetHeight ?? 22;
    setPos(computeTipPos(rect, tipW, tipH));
    const root = el.closest(".huekit-root");
    setTheme(root?.getAttribute("data-theme") === "light" ? "light" : "dark");
  }, []);

  useLayoutEffect(() => {
    if (!visible) return;
    updatePos();
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(updatePos);
    });
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [visible, label, updatePos]);

  function show() {
    if (timer.current) clearTimeout(timer.current);
    if (reduce) {
      setVisible(true);
      return;
    }
    timer.current = setTimeout(() => setVisible(true), DELAY_MS);
  }

  function hide() {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  }

  const tip =
    visible && typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            <motion.span
              ref={tipRef}
              role="tooltip"
              className="huekit-toolbar-tip-portal"
              data-theme={theme}
              style={
                pos
                  ? {
                      position: "fixed",
                      top: pos.top,
                      left: pos.left,
                      transform: pos.transform,
                      zIndex: 9999,
                    }
                  : { position: "fixed", visibility: "hidden", top: 0, left: 0 }
              }
              initial={reduce ? false : { opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 2 }}
              transition={{ duration: reduce ? 0 : 0.12, ease: "easeOut" }}
              onAnimationComplete={updatePos}
            >
              {label}
            </motion.span>
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <span
      ref={wrapRef}
      className="huekit-toolbar-tip-wrap"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {tip}
    </span>
  );
}
