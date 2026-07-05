"use client";

import { useRef, useState, type ReactElement } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const DELAY_MS = 600;

export function ToolbarTip({
  label,
  children,
}: {
  label: string;
  children: ReactElement;
}) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

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

  return (
    <span
      className="huekit-toolbar-tip-wrap"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.span
            role="tooltip"
            className="huekit-toolbar-tip"
            initial={reduce ? false : { opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -2 }}
            transition={{ duration: reduce ? 0 : 0.12, ease: "easeOut" }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
