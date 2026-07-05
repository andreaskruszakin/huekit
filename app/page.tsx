const tileHeights = [180, 260, 150, 220, 300, 170, 240, 140, 280, 200, 160, 250];

export default function Page() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col px-6 pb-24 pt-16">
      <p
        className="text-balance text-3xl font-semibold tracking-tight"
        style={{ color: "var(--hue-ink)" }}
      >
        Open HueKit and tune the CSS variables live.
      </p>
      <p className="mt-3 max-w-md text-pretty text-sm" style={{ color: "var(--hue-muted)" }}>
        Pick a variable, twist the hue ring, save a palette locally, copy the block back into your stylesheet.
      </p>

      <div
        className="mt-8 inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold"
        style={{ background: "var(--hue-accent)", color: "var(--hue-surface)" }}
      >
        Accent pill
      </div>

      <div
        className="mt-12 w-full columns-2 gap-4 sm:columns-3 md:columns-4 [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
        aria-hidden="true"
      >
        {tileHeights.map((h, i) => (
          <div
            key={i}
            className="relative mb-4 break-inside-avoid overflow-hidden rounded-2xl"
            style={{
              height: h,
              background: "var(--hue-tile)",
              border: "1px solid var(--hue-border)",
            }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: "var(--hue-accent-muted)" }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
