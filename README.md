# F1 Predictor

A small web app that shows the next Formula 1 race, the current driver standings and a live AI‑driven prediction of who is most likely to win.

## What you get

- **Next‑race card** – date, time, circuit and a quick visual.
- **Leaderboard** – driver positions with initials instead of broken photos, plus a header that shows the race name (e.g. “Results for Las Vegas Grand Prix”).
- **AI prediction** – a Random‑Forest model trained on the 2025 season predicts finishing position, win probability and podium chance for the current championship leader.
- **Live background** – animated track line and moving “car dots” give the page a race‑track feel.

## Quick start (development)

```bash
# 1. Clone the repo
git clone https://github.com/<your‑username>/f1‑predictor.git
cd f1-predictor

# 2. Backend (Python)
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload   # runs on http://localhost:8000

# 3. Frontend (React + Vite)
cd frontend
npm install
npm run dev                         # runs on http://localhost:5173
```

The backend serves three endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/next-race` | GET | Details of the upcoming Grand Prix |
| `/standings` | GET | Current driver standings plus the race name |
| `/predict`   | POST| Returns AI prediction for the supplied driver/team/grid |

## Deploying

The app is completely stateless – just copy the `backend/` folder to a server that can run FastAPI (Uvicorn, Gunicorn, Docker, etc.) and serve the static files from `frontend/dist` after building with `npm run build`.

## Project layout

```
f1-predictor/
├─ backend/          # FastAPI server
│   ├─ model.py      # Random‑Forest trainer / predictor
│   ├─ data_collector.py
│   ├─ data_service.py
│   └─ main.py
├─ frontend/         # React + Vite UI
│   ├─ src/
│   │   ├─ components/
│   │   ├─ pages/
│   │   └─ index.css
│   └─ vite.config.ts
└─ README.md
```

## Cleaning the repo before the first commit

Run the script below (or copy‑paste the commands) to:

1. **Remove test files** (`*_test*.py`, `test_*.py`, etc.).
2. **Delete the virtual‑environment folder** (`.venv` or any `venv/` you may have created locally).
3. **Strip all Python/TS/JS comments** – this leaves only executable code.
4. **Create a `.gitignore`** that excludes the virtual environment and any local build artefacts.

```bash
#!/usr/bin/env bash
set -e

# 1. Delete test files
find . -type f -name "test_*.py" -delete
find . -type f -name "*_test.py" -delete
find . -type f -name "*test*.py" -delete

# 2. Remove virtual‑env directories (common names)
rm -rf .venv venv env

# 3. Strip comments from source files (Python, TypeScript, JavaScript, CSS)
strip_comments() {
  local ext=$1
  find . -type f -name "*.$ext" -exec sed -i \
    -e 's/#.*$//' \
    -e 's://.*$::' \
    -e '/\/\*/,/\*\//d' {} +
}
strip_comments py
strip_comments ts
strip_comments js
strip_comments css

# 4. Create .gitignore
cat > .gitignore <<'EOF'
# Python
__pycache__/
*.pyc
*.pyo
*.pyd
*.egg-info/
*.egg
.env
.venv/
venv/
env/

# Node / Vite
node_modules/
dist/
npm-debug.log
yarn-error.log

# OS / editor artefacts
.DS_Store
Thumbs.db
.idea/
.vscode/
EOF
```

Make the script executable (`chmod +x clean_repo.sh`) and run it once before the first commit.

## First commit & push

```bash
git init
git add .
git commit -m "Initial commit – F1 Predictor"
git branch -M main
# Replace the URL with your own repository
git remote add origin https://github.com/<your‑username>/f1-predictor.git
git push -u origin main
```

That’s it. The repository now contains only the code that actually runs, a tidy README, and a `.gitignore` that keeps the local environment out of the history. Enjoy!
