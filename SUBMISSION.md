# SUBMISSION.md

## Candidate Information
- **Name:** Omkar Wagh
- **Email:** waghomkar71@gmail.com
- **Date Submitted:** 01/07/2026

## Links
- **GitHub Repo:** https://github.com/omkarwagh264/Smart-lab
- **Frontend (Live):** https://omkarwagh264.github.io/Smart-lab/
- **Backend (Live):** https://smartlab-backend-ydam.onrender.com

## Tech Stack Used
- Frontend: React 18 (Vite)
- Backend: Node.js + Express
- Database: SQLite (via sql.js — chosen over a native-binding driver so the
  project installs cleanly on any host with zero native build step, which
  matters for free-tier deploy reliability on Render)
- Charts: Recharts

## Tiers Completed

### Tier 1 (Mandatory) — Full CRUD, REST API, responsive UI, deployment
- [x] Dashboard with summary stat cards (total / active / under maintenance / decommissioned / average health)
- [x] Equipment list with full CRUD (create, read, update, delete)
- [x] Add/Edit form with client + server-side validation
- [x] Delete confirmation dialog
- [x] Real-time search (name, serial, location) + type/status filters
- [x] Responsive layout — tested at mobile and desktop widths
- [x] Deployed: frontend on GitHub Pages, backend on Render

### Tier 2 (Engineering) — Bug fixing, CSV import, data visualization
- [x] Fixed 3 intentional bugs in `backend/utils/healthScore.js` (documented in `BUG-FIXES.md`)
- [x] CSV import endpoint (`POST /api/equipment/import`) + UI modal, with per-row validation and results summary (inserted/skipped/errors)
- [x] Dashboard insights: status breakdown pie chart + equipment-by-type bar chart (toggle via "Show Insights")

### Tier 3 (Innovation) — IoT simulation, health scoring, own feature
- [x] Health scoring system: every piece of equipment carries a health_score (0–100), computed from days since last maintenance and current status, rendered as a colored progress bar on each card (teal = healthy, amber = watch, red = needs attention)

## Engineering Decisions

- **Database choice:** SQLite via sql.js (WASM) — no external database service needed, installs on any platform with zero native build step. Trade-off: single-file storage, not suited for multi-instance scaling, but perfect for this assessment scope.

- **Health score formula:** Linear decay (100 - 0.5 × days since maintenance), flat penalty for "Under Maintenance", hard 0 for "Decommissioned". Simple and fully explainable by reading healthScore.js directly.

- **Real bug found and fixed during testing:** During development I discovered that sql.js's `db.export()` function (used to persist the database to disk) silently terminates any open SQLite transaction. This caused CSV imports to crash because `persist()` was being called after every individual INSERT inside a transaction. Fixed by adding an `inTransaction` flag that skips per-statement persists while a transaction is open, then persists once after COMMIT. Documented in BUG-FIXES.md as Bug #4.

## Known Limitations
- SQLite file storage resets on Render redeploy (ephemeral filesystem on free tier) — would use managed Postgres in production
- No authentication — out of scope per assessment brief
- Render free tier spins down after inactivity; first request after idle can take 30–60 seconds to wake up

## AI Tool Usage Disclosure
Built with the assistance of Claude (Anthropic). I have read through, tested, and debugged every part of the code end-to-end and can explain any part of it in the follow-up interview.
