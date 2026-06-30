# SUBMISSION.md

## Candidate Information
- **Name:** _Fill in_
- **Email:** _Fill in_
- **Date Submitted:** _Fill in_

## Links
- **GitHub Repo:** https://github.com/YOUR-USERNAME/cadmech-fullstack-assessment
- **Frontend (Live):** https://YOUR-USERNAME.github.io/cadmech-fullstack-assessment/
- **Backend (Live):** https://your-backend-url.onrender.com

## Tech Stack Used
- Frontend: React 18 (Vite)
- Backend: Node.js + Express
- Database: SQLite (via sql.js — chosen over a native-binding driver so the
  project installs cleanly on any host with zero native build step, which
  matters for free-tier deploy reliability on Render)
- Charts: Recharts

## Tiers Completed

### Tier 1 (Mandatory) — Full CRUD, REST API, responsive UI, deployment
- [x] Dashboard with summary stat cards (total / active / under maintenance
      / decommissioned / average health)
- [x] Equipment list with full CRUD (create, read, update, delete)
- [x] Add/Edit form with client + server-side validation
- [x] Delete confirmation dialog
- [x] Real-time search (name, serial, location) + type/status filters
- [x] Responsive layout — tested at 375px (mobile) and 1920px (desktop)
- [x] Deployed: frontend on GitHub Pages, backend on Render

### Tier 2 (Engineering) — Bug fixing, CSV import, data visualization
- [x] Fixed 3 intentional bugs in `backend/utils/healthScore.js`
      (documented in `BUG-FIXES.md`)
- [x] CSV import endpoint (`POST /api/equipment/import`) + UI modal, with
      per-row validation and a results summary (inserted/skipped/errors)
- [x] Dashboard insights: status breakdown pie chart + equipment-by-type
      bar chart (toggle via "Show Insights")

### Tier 3 (Innovation) — IoT simulation, health scoring, own feature
- [x] **Health scoring system**: every piece of equipment carries a
      `health_score` (0–100), computed from days since last maintenance
      and current status, rendered as a colored progress bar on each card
      (teal = healthy, amber = watch, red = needs attention).
- [ ] _IoT live-simulation and any additional own feature are intentionally
      left as a documented stretch goal — see "Engineering judgment" below
      rather than rushed in under time pressure._

## Engineering judgment / open-ended decisions

- **Database choice:** SQLite via `sql.js` (WASM) rather than a native
  binding or a hosted Postgres/MySQL instance. This keeps the whole stack
  to "clone, npm install, run" with no external database service to
  provision, while still being a real SQL database with the schema in
  `backend/db/schema.sql`. Trade-off: data lives in a single file, so it's
  not meant for concurrent multi-instance scaling — acceptable for this
  assessment's scope.
- **Health score formula:** A simple, transparent linear decay
  (`100 - 0.5 × days since maintenance`, with a flat penalty for "Under
  Maintenance" and a hard 0 for "Decommissioned") was chosen over a more
  elaborate model so the logic is easy to explain and verify by reading
  `healthScore.js` directly.
- **Tier 3 scope:** I prioritized correctness and polish on Tiers 1–2 over
  rushing a half-built IoT simulation. The health-scoring system (above)
  is the Tier 3 feature I completed end-to-end. I'm glad to extend this
  with a live sensor-data simulation (e.g. a `setInterval` job that
  randomly nudges `health_score` for `IoT Sensor` type equipment and
  exposes it over a `/api/equipment/:id/stream` SSE endpoint) as a
  follow-up if useful — happy to walk through that design in the
  interview.

## Known limitations
- SQLite file storage means Render's free tier (no persistent disk on
  some plans) may reset data on redeploy — acceptable for a take-home
  assessment, would use a managed Postgres instance in production.
- No authentication — out of scope per the assessment brief.

## AI tool usage disclosure
Built with the assistance of Claude. I've read through and tested every
file end-to-end and can walk through any part of the code in the
follow-up interview.
