"use client";

import { useState } from "react";

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="landing-code">
      {label && <span className="landing-code-label">{label}</span>}
      <pre><code>{code}</code></pre>
      <button type="button" className="landing-code-copy" onClick={copy} aria-label="Copy code">
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
