"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import type { PickedColor } from "@/lib/picker-preset";

const tileHeights = [180, 260, 150, 220, 300, 170, 240, 140, 280, 200, 160, 250];

export default function Page() {
  const [color, setColor] = useState<PickedColor | null>(null);

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center px-6 pt-14">
      <SearchBar onColorChange={setColor} />

      <div
        className="mt-12 w-full columns-2 gap-4 sm:columns-3 md:columns-4 [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
        aria-hidden="true"
      >
        {tileHeights.map((h, i) => (
          <div
            key={i}
            className="relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/[0.04] bg-tile"
            style={{ height: h }}
          >
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{ background: color?.css ?? "transparent", opacity: color ? 0.16 : 0 }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
