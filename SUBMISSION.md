# SUBMISSION.md

## Candidate Information
- **Name:** Omkar Wagh
- **Email:** waghomkar71@gmail.com
- **Date Submitted:** 01/07/2026

## Links
- **GitHub Repo:** https://github.com/omkarwagh264/cadmech-fullstack-assessment
- **Frontend (Live):** https://omkarwagh264.github.io/cadmech-fullstack-assessment/
- **Backend (Live):** https://smartlab-backend-ydam.onrender.com

## Tech Stack Used
- Frontend: React 18 (Vite)
- Backend: Node.js + Express
- Database: SQLite (via sql.js)
- Charts: Recharts

## Features Completed

### Dashboard
- [x] Summary stat cards — Total, Active, Under Maintenance, Decommissioned, Average Health Score

### CRUD Operations
- [x] List all equipment
- [x] Add new equipment (form with validation)
- [x] Edit existing equipment
- [x] Delete equipment (with confirmation dialog)

### Search & Filters
- [x] Real-time search by name, serial number, and location
- [x] Filter by equipment type
- [x] Filter by status

### Responsive UI
- [x] Desktop layout (1920px tested)
- [x] Mobile layout (375px tested)
- [x] Tablet layout

### Deployment
- [x] Frontend deployed on GitHub Pages
- [x] Backend deployed on Render (free tier)

### Bonus Features
- [x] CSV bulk import with per-row validation and error reporting
- [x] Data visualization charts (status breakdown + equipment by type)
- [x] Health scoring system (0–100 per equipment based on maintenance history)
- [x] Bug fixes documented in BUG-FIXES.md

## Engineering Decisions

- **Database:** SQLite via sql.js (WASM) — no external database service needed,
  installs on any platform with zero native build step.

- **Health score formula:** Linear decay (100 - 0.5 × days since last maintenance),
  flat penalty for "Under Maintenance", hard 0 for "Decommissioned".

- **Real bug found and fixed:** sql.js's db.export() silently terminates open
  SQLite transactions. Fixed by adding an inTransaction flag that skips
  per-statement persists while a transaction is open, and persists once after
  COMMIT. Documented in BUG-FIXES.md as Bug #4.

## Known Limitations
- SQLite resets on Render redeploy (ephemeral filesystem on free tier)
- No authentication — out of scope per assessment brief
- Render free tier spins down after inactivity; first request after idle
  takes 30–60 seconds to wake up

## AI Tool Usage Disclosure
Built with the assistance of Claude (Anthropic). I have read through, tested,
and debugged every part of the code end-to-end and can explain any part of it
in the follow-up interview.
