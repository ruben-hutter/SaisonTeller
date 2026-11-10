# 04 — Theme & accessibility

Status: ready-for-agent

## Task

- `src/app.css`: design tokens as CSS custom properties on `:root` + `@media (prefers-color-scheme: dark)` overrides; season accents via `[data-season]` (light/dark pairs from spec); category dot colors per theme; derived `--accent-ink` for text usage and `--on-accent` for text on accent fills.
- Contrast ≥ 4.5:1 for all text/surface pairs in both themes (verified by script during implementation; values recorded in this issue when resolved).
- Focus-visible rings in accent; `prefers-reduced-motion` respected; system font stack; radius ~10px; no emoji.
- A11y checklist: `aria-pressed` chips, `aria-current` on selected month/view/language links, `aria-label` on search + month links + view toggle group, visually-hidden strip summaries, sticky header does not trap focus, keyboard-operable everything (native links/buttons/inputs only).

## Acceptance

- `npm run check` clean; manual pass over both themes at mobile and desktop widths.
