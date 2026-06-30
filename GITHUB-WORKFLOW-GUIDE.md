# GITHUB-WORKFLOW-GUIDE.md

How to get this project from your machine onto GitHub, and from GitHub onto
live URLs the assessment asks for.

## 1. Fork & clone

1. Fork the original assessment repo to your own GitHub account (or push
   this folder as a brand-new repo named `cadmech-fullstack-assessment` if
   you're starting from this delivered code directly).
2. Clone your fork locally:
   ```
   git clone https://github.com/YOUR-USERNAME/cadmech-fullstack-assessment.git
   cd cadmech-fullstack-assessment
   ```
3. Copy this project's `backend/` and `frontend/` folders (and the root
   `.md` files) into that clone, replacing the starter scaffolding.

## 2. Commit in meaningful chunks

The assessment explicitly says they review commit history and reward
small, meaningful commits over multiple days rather than one giant commit.
A reasonable sequence:

```
git add backend/
git commit -m "Set up Express server, SQLite schema, and seed data"

git add backend/routes backend/utils
git commit -m "Implement CRUD API endpoints with validation"

git add frontend/src/components/StatsBar.jsx frontend/src/components/Toolbar.jsx
git commit -m "Build dashboard stats and search/filter toolbar"

git add frontend/src/components/EquipmentCard.jsx frontend/src/components/EquipmentForm.jsx
git commit -m "Build equipment cards and add/edit form"

git add frontend/src/components/ImportCsvModal.jsx backend/routes/api.js
git commit -m "Add CSV import endpoint and modal (Tier 2)"

git add frontend/src/components/HealthChart.jsx
git commit -m "Add dashboard insights charts (Tier 2)"

git add backend/utils/healthScore.js BUG-FIXES.md
git commit -m "Fix 3 intentional bugs in healthScore utility, document fixes"

git add frontend/src/styles.css
git commit -m "Polish responsive UI and visual design"
```

Push regularly: `git push origin main`.

## 3. Local development

**Backend:**
```
cd backend
npm install
cp .env.example .env
node server.js
# -> http://localhost:5000
```

**Frontend (new terminal):**
```
cd frontend
npm install
cp .env.example .env.local
# edit .env.local: VITE_API_URL=http://localhost:5000
npm run dev
# -> http://localhost:5173
```

## 4. Deploy the backend (Render)

1. Push your repo to GitHub first.
2. Go to [render.com](https://render.com) → New → Web Service → connect
   your GitHub repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance type:** Free
4. Deploy. Render gives you a URL like
   `https://cadmech-backend-xxxx.onrender.com`.
5. Note: the free tier spins down when idle, so the first request after
   inactivity can take 30–60 seconds to wake up — this is expected.

## 5. Deploy the frontend (GitHub Pages)

This repo includes `.github/workflows/deploy-pages.yml`, which builds and
deploys the frontend automatically on every push to `main`.

1. In your repo: **Settings → Pages → Build and deployment → Source** →
   set to **GitHub Actions**.
2. In your repo: **Settings → Secrets and variables → Actions → New
   repository secret**:
   - Name: `VITE_API_URL`
   - Value: your Render backend URL from step 4 (no trailing slash)
3. Push to `main` (or run the workflow manually from the Actions tab).
4. Your site will be live at
   `https://YOUR-USERNAME.github.io/cadmech-fullstack-assessment/`

If you prefer a manual deploy instead of Actions:
```
cd frontend
npm install
npm run build
npx gh-pages -d dist
```

## 6. Verify before submitting

- [ ] Frontend loads at the GitHub Pages URL
- [ ] Frontend successfully fetches data from the live backend (check
      Network tab — no CORS or 404 errors)
- [ ] All CRUD operations work end-to-end on the live site
- [ ] CSV import works using `sample-import.csv`
- [ ] Mobile view (375px) looks correct — resize your browser or use dev
      tools device emulation
- [ ] `SUBMISSION.md` is filled out
