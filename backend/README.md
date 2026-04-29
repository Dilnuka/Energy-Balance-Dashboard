# Energy Balance Dashboard - Backend

## Setup & Running

### 1. Activate the virtual environment
```powershell
cd d:\SLESA\backend
.\venv\Scripts\activate
```

### 2. Run the API server
```powershell
uvicorn main:app --reload --port 8000
```

### 3. Access interactive API docs
Open your browser and navigate to:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/energy-data` | Get hourly energy records |
| POST | `/api/math/convert` | Convert between energy units |
| POST | `/api/math/balance` | Run energy balance equation |
| GET | `/api/stats/summary` | Get dashboard KPI summary stats |
