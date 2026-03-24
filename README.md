# NRL League Heroes Tracker v3

A static, mobile-friendly PWA starter for tracking the **official 2026 NRL League Heroes checklist**.

## What changed in v3
- Full 2026 checklist loaded into the app
- Binder-style 9-pocket view
- Subset progress and team progress
- Generated local card-art previews for every card
- Local custom team badge art
- Collection export/import JSON

## Open it
Open `index.html` in a browser, or host the folder on GitHub Pages / Netlify / Vercel.

## Data note
The checklist data in `data/cards-2026.js` was parsed from the official 2026 checklist PDF.

A source-note caveat is preserved in the data:
- the official Mercury list shows a missing `M173`
- the official Mercury list repeats `M180`

The app keeps those published codes exactly as a checklist tracker.

## Files
- `index.html` – app shell
- `app.js` – tracker logic
- `styles.css` – UI styling
- `data/cards-2026.js` – official checklist data
- `assets/team-badges/*.svg` – local badge art
