import { CodeBlock } from "@/components/landing/CodeBlock";

const tileHeights = [180, 260, 150, 220, 300, 170, 240, 140, 280, 200, 160, 250];

const installLayout = `import { HueKitRoot } from "@/components/huekit/HueKitRoot";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <HueKitRoot />
      </body>
    </html>
  );
}`;

const cssVars = `:root {
  --hue-accent: hsl(210 82% 56%);
  --hue-surface: hsl(240 6% 6%);
  --hue-ink: hsl(0 0% 96%);
  /* any --* var with a color value */
}`;

const prompts = [
  {
    title: "Add HueKit to an existing site",
    body: "Mount HueKitRoot as a sibling in the root layout (not wrapping children). Define color CSS variables on :root. Open the bubble, pick a variable, tune the hue ring, copy the :root block back into globals.css.",
  },
  {
    title: "Tune an accent palette live",
    body: "I have --hue-accent and --hue-accent-muted on :root. Add HueKit so I can adjust both in real time with the hue wheel, shade arc, and 10-step scale. Save the result as a named palette.",
  },
  {
    title: "Export tuned colors",
    body: "After tuning CSS variables with HueKit, copy the generated :root block and replace the values in app/globals.css. Reset individual vars or reset all from the toolbar.",
  },
];

const apiRows = [
  { name: "HueKitRoot", type: "component", desc: "Floating bubble + glass panel. Mount once at app root." },
  { name: "useColorVars()", type: "hook", desc: "Scans stylesheets, tracks selected var, apply/reset/export." },
  { name: "vars", type: "ColorVar[]", desc: "name, original, current, hsl for each color CSS variable." },
  { name: "setSelectedHsl(hsl)", type: "fn", desc: "Writes hsl() to the selected var via setProperty." },
  { name: "exportCss()", type: "fn", desc: "Returns a :root { ... } block of current values." },
  { name: "savePalette / loadPalette", type: "fn", desc: "Persist up to 20 palettes in localStorage." },
  { name: "huekit-palettes", type: "localStorage", desc: "Saved palette JSON." },
  { name: "huekit-bubble-pos", type: "localStorage", desc: "Bubble/panel anchor position." },
  { name: "huekit-color-format", type: "localStorage", desc: "HSL or Hex display preference in picker." },
];

export function LandingPage() {
  return (
    <main className="landing">
      <section className="landing-hero">
        <p className="landing-eyebrow">Dev tool</p>
        <h1 className="landing-title text-balance">
          <span className="landing-title-hue">Hue</span>
          <span className="landing-title-kit">Kit</span>
        </h1>
        <p className="landing-lede text-pretty">
          DialKit for colors. A floating panel that scans your CSS variables, lets you tune hues live on the page, save palettes, and copy a :root block back into your stylesheet.
        </p>
        <a href="#demo" className="landing-cta">View demo</a>
        <p className="landing-hero-meta text-pretty">
          Open source ·{" "}
          <a href="https://github.com/andreaskruszakin/huekit" className="landing-link">
            github.com/andreaskruszakin/huekit
          </a>
        </p>
      </section>

      <section className="landing-section">
        <h2 className="landing-h2">Installation</h2>
        <p className="landing-p text-pretty">
          Copy the <code className="landing-inline">components/huekit/</code> module into your Next.js project. Mount the root once alongside your app content.
        </p>
        <CodeBlock code={installLayout} label="app/layout.tsx" />
        <p className="landing-p text-pretty">
          Define color tokens as CSS variables. HueKit auto-detects any <code className="landing-inline">--*</code> name whose computed value parses as a color.
        </p>
        <CodeBlock code={cssVars} label="app/globals.css" />
      </section>

      <section className="landing-section">
        <h2 className="landing-h2">How it works</h2>
        <ol className="landing-steps">
          <li><strong>Scan</strong> — walks document stylesheets for custom properties, filters to color values on <code className="landing-inline">:root</code>.</li>
          <li><strong>Pick</strong> — select a variable; the hue wheel opens beside the list.</li>
          <li><strong>Tune</strong> — 12-hue ring, shade arc, HSL sliders or hex input, 10-step scale.</li>
          <li><strong>Ship</strong> — copy CSS, save palettes locally, reset per var or all at once.</li>
        </ol>
        <p className="landing-p text-pretty">
          Edits write to <code className="landing-inline">document.documentElement.style</code>, so the whole page updates instantly without a rebuild.
        </p>
      </section>

      <section className="landing-section">
        <h2 className="landing-h2">Prompts to get started</h2>
        <div className="landing-prompts">
          {prompts.map((p) => (
            <div key={p.title} className="landing-prompt">
              <h3 className="landing-h3">{p.title}</h3>
              <p className="landing-p text-pretty">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <h2 className="landing-h2">API reference</h2>
        <div className="landing-table-wrap">
          <table className="landing-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {apiRows.map((row) => (
                <tr key={row.name}>
                  <td><code>{row.name}</code></td>
                  <td>{row.type}</td>
                  <td>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="landing-section">
        <h2 className="landing-h2">Contributing</h2>
        <p className="landing-p text-pretty">
          HueKit is open source under the MIT license. Fork the repo, run <code className="landing-inline">npm run dev</code>, and open a pull request with a focused change. See{" "}
          <a href="https://github.com/andreaskruszakin/huekit/blob/master/CONTRIBUTING.md" className="landing-link">
            CONTRIBUTING.md
          </a>{" "}
          for setup and PR guidelines.
        </p>
      </section>

      <section id="demo" className="landing-section landing-demo">
        <h2 className="landing-h2">Live demo</h2>
        <p className="landing-p text-pretty">
          Open the HueKit bubble (top-left by default). Pick <code className="landing-inline">--hue-accent</code> or any var below. These tiles react in real time.
        </p>
        <div
          className="landing-demo-accent inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--hue-accent)", color: "var(--hue-surface)" }}
        >
          Accent pill
        </div>
        <div
          className="landing-masonry columns-2 gap-4 sm:columns-3 md:columns-4 [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
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
      </section>

      <footer className="landing-footer">
        <p>
          HueKit ·{" "}
          <a href="https://huekits.vercel.app" className="landing-link">huekits.vercel.app</a>
          {" · "}
          <a href="https://github.com/andreaskruszakin/huekit" className="landing-link">GitHub</a>
        </p>
      </footer>
    </main>
  );
}
