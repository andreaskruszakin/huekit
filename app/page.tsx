const tileHeights = [180, 260, 150, 220, 300, 170, 240, 140, 280, 200, 160, 250];

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--hue-muted)]">
        Dev fixture
      </p>
      <h1 className="mb-3 text-2xl font-medium text-balance text-[var(--hue-ink)]">
        HueKit demo
      </h1>
      <p className="mb-8 max-w-md text-pretty text-sm leading-relaxed text-[var(--hue-muted)]">
        Open the bubble to tune CSS variables on this page. Docs and install steps live at{" "}
        <a
          href="https://huekits.vercel.app"
          className="text-[var(--hue-ink)] underline decoration-[var(--hue-border)] underline-offset-2 hover:decoration-[var(--hue-accent)]"
        >
          huekits.vercel.app
        </a>
        .
      </p>
      <div
        className="mb-6 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold"
        style={{ background: "var(--hue-accent)", color: "var(--hue-surface)" }}
      >
        Accent pill
      </div>
      <div
        className="columns-2 gap-4 sm:columns-3 [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
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
