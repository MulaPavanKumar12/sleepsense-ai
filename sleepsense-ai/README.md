# 🌙 SleepSense AI

Intelligent Sleep Quality Prediction & Wellness Recommendation System.

SleepSense AI predicts a daily sleep quality score from lifestyle, health, environmental,
and behavioral data, then gives personalized food and lifestyle recommendations, an
analytics dashboard, a simple AI sleep coach, and a downloadable PDF health report.

## Tech stack

- **Frontend:** React (Vite), Tailwind CSS, Recharts
- **Backend:** FastAPI, SQLAlchemy, JWT auth
- **ML:** explainable rule-based scoring engine (swap-in ready for scikit-learn/XGBoost)
- **Database:** PostgreSQL (SQLite fallback for local dev)
- **Reports:** ReportLab (PDF generation)
- **Deployment:** Docker + docker-compose

## Project structure

```
sleepsense-ai/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app entrypoint
│   │   ├── database.py        # DB session/engine
│   │   ├── db_models.py       # SQLAlchemy models
│   │   ├── schemas.py         # Pydantic request/response models
│   │   ├── auth.py            # JWT + password hashing
│   │   ├── ml/
│   │   │   ├── predictor.py   # Sleep quality prediction engine
│   │   │   └── recommender.py # Food/lifestyle recommendations + AI coach
│   │   └── routers/
│   │       ├── auth_router.py
│   │       ├── sleep_router.py
│   │       └── report_router.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/              # Landing, Login, Register, Dashboard, LogSleep, Recommendations, Coach
│   │   ├── components/         # NavBar, ProtectedRoute
│   │   ├── context/AuthContext.jsx
│   │   └── api/client.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Running locally (without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.
By default it uses a local SQLite file (`sleepsense.db`) so you don't need Postgres running
just to try it out — set `DATABASE_URL` in `.env` to a Postgres URL when you're ready.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api` requests to the backend.

## Running with Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:4173
- Backend: http://localhost:8000
- Postgres: localhost:5432

## Swapping in a real ML model

`backend/app/ml/predictor.py` ships as an explainable rule-based engine so the app works
with zero training data. To upgrade it:

1. Collect labeled `SleepEntry` rows (features + a real measured sleep score).
2. Use `build_feature_vector()` to turn entries into numeric features.
3. Train a scikit-learn/XGBoost/LightGBM model on those vectors.
4. Save it with `joblib` and load it in `predict()`, keeping the same output shape.

## Roadmap

- Smartwatch integration (Apple Health / Fitbit / Google Fit)
- Voice-based sleep journal
- Smart alarm with optimal wake-up prediction
- White noise generator
- Family sleep monitoring / doctor dashboard
- Multi-language support

## License

MIT — see [LICENSE](LICENSE).
