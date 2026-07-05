"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const ICON_CHECK = "M5 12.75L10 19L19 5";

export const ICON_CHEVRON = "M6 9.5L12 15.5L18 9.5";

export const ICON_CLIPBOARD = {
  board: "M8 6C8 4.34315 9.34315 3 11 3H13C14.6569 3 16 4.34315 16 6V7H8V6Z",
  sparkle:
    "M19.2405 16.1852L18.5436 14.3733C18.4571 14.1484 18.241 14 18 14C17.759 14 17.5429 14.1484 17.4564 14.3733L16.7595 16.1852C16.658 16.4493 16.4493 16.658 16.1852 16.7595L14.3733 17.4564C14.1484 17.5429 14 17.759 14 18C14 18.241 14.1484 18.4571 14.3733 18.5436L16.1852 19.2405C16.4493 19.342 16.658 19.5507 16.7595 19.8148L17.4564 21.6267C17.5429 21.8516 17.759 22 18 22C18.241 22 18.4571 21.8516 18.5436 21.6267L19.2405 19.8148C19.342 19.5507 19.5507 19.342 19.8148 19.2405L21.6267 18.5436C21.8516 18.4571 22 18.241 22 18C22 17.759 21.8516 17.5429 21.6267 17.4564L19.8148 16.7595C19.5507 16.658 19.342 16.4493 19.2405 16.1852Z",
  body: "M16 5H17C18.6569 5 20 6.34315 20 8V11M8 5H7C5.34315 5 4 6.34315 4 8V18C4 19.6569 5.34315 21 7 21H12",
};

export const ICON_RESET =
  "M3 12a9 9 0 1 0 2.25-5.97M3 4v5h5";

export const ICON_EYEDROPPER =
  "M2 22l10-10m0 0l2.5-2.5a2.12 2.12 0 0 1 3 3L15 15m-3-3l3.5 3.5M9 11l-5 5v3h3l5-5";

export const ICON_PLUS = "M12 5v14M5 12h14";

export const ICON_CLOSE = "M6 6l12 12M18 6L6 18";

function IconSvg({
  children,
  viewBox = "0 0 24 24",
  strokeWidth = 2,
  fill = "none",
}: {
  children: ReactNode;
  viewBox?: string;
  strokeWidth?: number;
  fill?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconEyedropper() {
  return (
    <IconSvg>
      <path d={ICON_EYEDROPPER} />
    </IconSvg>
  );
}

export function IconReset() {
  return (
    <IconSvg>
      <path d={ICON_RESET} />
    </IconSvg>
  );
}

export function IconPlus() {
  return (
    <IconSvg>
      <path d={ICON_PLUS} />
    </IconSvg>
  );
}

export function IconClose() {
  return (
    <IconSvg>
      <path d={ICON_CLOSE} />
    </IconSvg>
  );
}

export function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      className="huekit-chevron"
      data-open={open}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICON_CHEVRON} />
    </svg>
  );
}

export function IconCopySwap({ copied }: { copied: boolean }) {
  return (
    <span className="huekit-toolbar-copy-wrap">
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.svg
            key="check"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: "absolute", inset: 0, width: 16, height: 16 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.08 }}
          >
            <path d={ICON_CHECK} />
          </motion.svg>
        ) : (
          <motion.svg
            key="clipboard"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: "absolute", inset: 0, width: 16, height: 16 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.08 }}
          >
            <path d={ICON_CLIPBOARD.board} />
            <path d={ICON_CLIPBOARD.sparkle} />
            <path d={ICON_CLIPBOARD.body} />
          </motion.svg>
        )}
      </AnimatePresence>
    </span>
  );
}
