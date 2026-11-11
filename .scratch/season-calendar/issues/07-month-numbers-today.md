# 07 — Numbered month strips + Today button

Status: ready-for-agent

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
