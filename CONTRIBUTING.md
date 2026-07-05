# Contributing to HueKit

Thanks for helping improve HueKit.

## Setup

```bash
git clone https://github.com/andreaskruszakin/huekit.git
cd huekit
npm install
npm run dev
```

Open http://localhost:3320 and use the HueKit bubble to test changes.

## What to work on

- Panel UX and spacing
- Color parsing and export formats
- Accessibility (keyboard, reduced motion, ARIA)
- Documentation and examples

Check open issues or propose a small, scoped change in a PR description.

## Pull requests

1. One logical change per PR when possible.
2. No secrets, API keys, or personal data in commits.
3. Update `docs/CHANGELOG.md` for user-visible changes (newest entry at top).
4. Verify `npm run build` passes.

## Code style

- Minimal, focused diffs
- Match existing file structure under `components/huekit/`
- Motion: transform and opacity only; respect `prefers-reduced-motion`

## Questions

Open a GitHub issue with context and screenshots for UI changes.
