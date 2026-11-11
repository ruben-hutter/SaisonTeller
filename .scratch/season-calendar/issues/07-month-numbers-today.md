# 07 — Numbered month strips + Today button

Status: resolved

## What

### Numbered strips

- Each of the 12 strip cells shows its month number (1–12). Harvest = accent-filled (readable number text), storage = light fill, other = faint; current month = ring/outline.
- ~8–9px font, cells ≥ 12px wide, two-digit numbers fit; nothing overflows at 320px viewport width.
- A11y: strip gets a concise `aria-label` listing harvest months ("Harvest: 6, 7, 8, 9" + storage when present, key `aria.stripLabel`); cells stay `aria-hidden`.

### Today button

- When selected month ≠ current month: small pill "Today" (`action.today`) near the month strip; `<a href="?m={currentMonth}">`, `aria-label` = `aria.backToToday`. Hidden when already on the current month.

## Strings (exact)

| key | en | de | fr | it |
|---|---|---|---|---|
| action.today | Today | Heute | Aujourd'hui | Oggi |
| aria.backToToday | Back to the current month | Zurück zum aktuellen Monat | Retour au mois en cours | Torna al mese corrente |
| aria.stripLabel | Harvest months | Erntemonate | Mois de récolte | Mesi di raccolto |

## Comments

- Strip cells now carry the month number (1–12): harvest = accent fill + bold `--on-accent` number, storage = light accent fill + `--text-muted` number, other months = faint `--surface-dim` fill; current month keeps the ring. 9px tabular-nums, `minmax(12px, 1fr)` columns (resolved 18.1px at 320px), 4px radius.
- A11y: strip is `role="img"` with `aria-label` from `aria.stripLabel` ("Harvest months: 7, 8, 9, 10" + storage when present); cells `aria-hidden`. The old visually-hidden `legend.*` summary was replaced by this label (name stays in the h3).
- Today button: rendered inside `MonthSwitcher` next to the strip when `selected !== current`; `<a href="/{locale}?m={current}">` pill, `aria.backToToday` label, hover fills with accent. Hidden when already on the current month.
- Verification (headless Chromium @320px on the production build, `?m=7`): `scrollWidth == clientWidth == 320` (no horizontal overflow); cells 18.08×16px with texts 1–12; hydrated page shows the today link (`/en?m=11`, "Back to the current month"). Prerendered HTML itself always has selected == build month, so the button is hydration-only — covered by `MonthSwitcher.test.ts` (`svelte/server` render: link present for selected 1/current 11, absent for 11/11, pills carry `?m=` only).
- Proof: `npm test` 26 passed; `npm run check` clean (2025-11-11).
