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
