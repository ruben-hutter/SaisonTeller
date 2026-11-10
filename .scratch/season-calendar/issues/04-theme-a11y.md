# 04 — Theme & accessibility

Status: resolved

## Task

- `src/app.css`: design tokens as CSS custom properties on `:root` + `@media (prefers-color-scheme: dark)` overrides; season accents via `[data-season]` (light/dark pairs from spec); category dot colors per theme; derived `--accent-ink` for text usage and `--on-accent` for text on accent fills.
- Contrast ≥ 4.5:1 for all text/surface pairs in both themes (verified by script during implementation; values recorded in this issue when resolved).
- Focus-visible rings in accent; `prefers-reduced-motion` respected; system font stack; radius ~10px; no emoji.
- A11y checklist: `aria-pressed` chips, `aria-current` on selected month/view/language links, `aria-label` on search + month links + view toggle group, visually-hidden strip summaries, sticky header does not trap focus, keyboard-operable everything (native links/buttons/inputs only).

## Acceptance

- `npm run check` clean; manual pass over both themes at mobile and desktop widths.

## Comments

- Proof: all text/surface pairs verified >= 4.5:1 in both themes (light: text 13.4-14.6, muted 5.5-6.0, accent-ink 4.84-5.44, on-accent 5.03-7.76; dark: 7.0-14.6); prefers-color-scheme + prefers-reduced-motion only; focus-visible rings in accent; svelte-check 0 errors.
