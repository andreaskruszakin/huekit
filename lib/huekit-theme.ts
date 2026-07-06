"use client";

import { useEffect, useState } from "react";

export type HueKitTheme = "light" | "dark";

function getSystemTheme(): HueKitTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useHueKitTheme(): HueKitTheme {
  const [theme, setTheme] = useState<HueKitTheme>("dark");

  useEffect(() => {
    setTheme(getSystemTheme());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(getSystemTheme());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return theme;
}
