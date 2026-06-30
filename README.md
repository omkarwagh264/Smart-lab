# 🏭 SmartLab Equipment Manager

Full-stack lab equipment management system built for the CADMech
Engineering Full Stack Developer technical assessment.

React (Vite) frontend + Node.js/Express backend + SQLite database.

## Features

- **Dashboard** — live summary cards (total, active, under maintenance,
  decommissioned, average health score)
- **Full CRUD** — add, edit, delete, and list lab equipment
- **Search & filter** — real-time search by name/serial/location, plus
  type and status filters
- **CSV import** — bulk-add equipment from a CSV file with per-row
  validation and an import results report
- **Insights** — status breakdown and equipment-by-type charts
- **Health scoring** — each item shows a 0–100 health score derived from
  maintenance recency and current status
- **Responsive design** — usable from a 375px phone up to a 1920px
  desktop

## Project structure

```
.
├── backend/
│   ├── server.js              # Express entry point
│   ├── routes/api.js          # All REST endpoints
│   ├── utils/healthScore.js   # Health scoring + validation (Tier 2 bug fixes)
│   └── db/
│       ├── schema.sql         # Table definition + seed data
│       └── index.js           # SQLite (sql.js) connection layer
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── api.js             # Fetch wrapper for the backend
│       ├── constants.js
│       ├── styles.css
│       └── components/
├── sample-import.csv          # Sample file for testing CSV import
├── BUG-FIXES.md               # Tier 2 bug documentation
├── SUBMISSION.md              # Fill out before submitting
└── GITHUB-WORKFLOW-GUIDE.md   # Commit strategy + deployment steps
```

## Quick start

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
node server.js
# http://localhost:5000
```

**Frontend** (new terminal):
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
# http://localhost:5173
```

The frontend reads the backend URL from `VITE_API_URL` (see
`frontend/.env.example`). Defaults to `http://localhost:5000` if unset.

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/equipment` | List all (`?search=`, `?type=`, `?status=`) |
| GET | `/api/equipment/:id` | Get one |
| POST | `/api/equipment` | Create |
| PUT | `/api/equipment/:id` | Update |
| DELETE | `/api/equipment/:id` | Delete |
| GET | `/api/stats` | Dashboard stats |
| POST | `/api/equipment/import` | Bulk CSV import (multipart `file` field) |

## Deployment

See [GITHUB-WORKFLOW-GUIDE.md](./GITHUB-WORKFLOW-GUIDE.md) for full steps
on deploying the backend to Render and the frontend to GitHub Pages
(a ready-made GitHub Actions workflow is included).
