from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
import pandas as pd
import io

from app.database import get_db, engine
from app.models import Base, EnergyFactData, ConversionFactor, PJMRegion, PJMHourlyData
from app.math_engine import MathEngine

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Energy Balance Dashboard API",
    description="FastAPI backend for the SLSEA Energy Balance Dashboard",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Pydantic Schemas ────────────────────────────────────────────────────────

class EnergyDataPoint(BaseModel):
    id: int
    timestamp: datetime
    value: float
    unit: str
    source: str
    class Config:
        from_attributes = True

class ConvertRequest(BaseModel):
    value: float
    from_unit: str
    to_unit: str

class BalanceRequest(BaseModel):
    primary_supply: float
    transformations: float
    losses: float

class RegionSummary(BaseModel):
    id: int
    name: str
    display_name: str
    description: Optional[str]
    record_count: int
    date_start: Optional[datetime]
    date_end: Optional[datetime]
    avg_mw: Optional[float]
    peak_mw: Optional[float]
    class Config:
        from_attributes = True

class HourlyDataPoint(BaseModel):
    id: int
    timestamp: datetime
    mw_value: float
    class Config:
        from_attributes = True

# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "project": "Energy Balance Dashboard", "version": "1.0.0"}

# ─── Existing Energy Data ─────────────────────────────────────────────────────

@app.get("/api/energy-data", response_model=List[EnergyDataPoint], tags=["Energy Data"])
def get_energy_data(limit: int = 100, db: Session = Depends(get_db)):
    records = db.query(EnergyFactData).order_by(EnergyFactData.timestamp).limit(limit).all()
    return [
        EnergyDataPoint(id=r.id, timestamp=r.timestamp, value=r.value,
                        unit=r.source.unit_default, source=r.source.name)
        for r in records
    ]

@app.get("/api/stats/summary", tags=["Analytics"])
def get_summary_stats(db: Session = Depends(get_db)):
    records = db.query(EnergyFactData).all()
    if not records:
        return {"message": "No data available"}
    values = [r.value for r in records]
    return {
        "total_records": len(values),
        "avg_consumption_mw": round(sum(values) / len(values), 2),
        "peak_consumption_mw": round(max(values), 2),
        "min_consumption_mw": round(min(values), 2),
        "source": records[0].source.name if records else "N/A"
    }

@app.post("/api/math/convert", tags=["Math Engine"])
def convert_units(req: ConvertRequest, db: Session = Depends(get_db)):
    factors = db.query(ConversionFactor).all()
    eng = MathEngine()
    eng.load_factors_from_db(factors)
    try:
        result = eng.convert(req.value, req.from_unit, req.to_unit)
        return {"input": req.value, "from_unit": req.from_unit, "to_unit": req.to_unit, "result": result}
    except ValueError as e:
        return {"error": str(e)}

@app.post("/api/math/balance", tags=["Math Engine"])
def check_energy_balance(req: BalanceRequest):
    eng = MathEngine()
    final = eng.calculate_energy_balance(req.primary_supply, req.transformations, req.losses)
    return {
        "primary_supply": req.primary_supply,
        "transformations": req.transformations,
        "losses": req.losses,
        "final_consumption": final,
        "balance_check": "BALANCED" if final >= 0 else "DEFICIT_WARNING"
    }

# ─── PJM Region Upload & Query ────────────────────────────────────────────────

@app.get("/api/regions", response_model=List[RegionSummary], tags=["PJM State Data"])
def list_regions(db: Session = Depends(get_db)):
    """List all uploaded PJM state/region datasets."""
    regions = db.query(PJMRegion).order_by(PJMRegion.name).all()
    result = []
    for r in regions:
        agg = db.query(
            func.avg(PJMHourlyData.mw_value),
            func.max(PJMHourlyData.mw_value)
        ).filter(PJMHourlyData.region_id == r.id).first()
        result.append(RegionSummary(
            id=r.id, name=r.name, display_name=r.display_name,
            description=r.description, record_count=r.record_count,
            date_start=r.date_start, date_end=r.date_end,
            avg_mw=round(agg[0], 2) if agg[0] else None,
            peak_mw=round(agg[1], 2) if agg[1] else None,
        ))
    return result

@app.post("/api/regions/upload", tags=["PJM State Data"])
async def upload_region_csv(
    region_name: str = Form(...),
    display_name: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload a PJM hourly CSV file for a specific state/region."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are accepted.")

    content = await file.read()
    try:
        df = pd.read_csv(io.StringIO(content.decode("utf-8")))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV: {e}")

    # Auto-detect columns: first col = Datetime, second col = MW values
    if len(df.columns) < 2:
        raise HTTPException(status_code=400, detail="CSV must have at least 2 columns: Datetime and MW value.")

    dt_col = df.columns[0]
    mw_col = df.columns[1]

    # Parse datetimes
    try:
        df[dt_col] = pd.to_datetime(df[dt_col])
    except Exception:
        raise HTTPException(status_code=400, detail=f"Could not parse datetime column '{dt_col}'.")

    df = df.dropna(subset=[dt_col, mw_col])
    df[mw_col] = pd.to_numeric(df[mw_col], errors="coerce")
    df = df.dropna(subset=[mw_col])

    region_name_upper = region_name.strip().upper()

    # Upsert the region record
    region = db.query(PJMRegion).filter(PJMRegion.name == region_name_upper).first()
    if region:
        # Delete old records for a clean re-upload
        db.query(PJMHourlyData).filter(PJMHourlyData.region_id == region.id).delete()
    else:
        region = PJMRegion(name=region_name_upper)
        db.add(region)
        db.flush()

    region.display_name = display_name.strip() if display_name.strip() else region_name_upper
    region.description = description.strip()
    region.column_name = mw_col
    region.date_start = df[dt_col].min().to_pydatetime()
    region.date_end = df[dt_col].max().to_pydatetime()
    region.record_count = len(df)

    # Bulk insert hourly records (cap at 10,000 rows for performance)
    batch = df.head(10000)
    records = [
        PJMHourlyData(region_id=region.id, timestamp=row[dt_col].to_pydatetime(), mw_value=float(row[mw_col]))
        for _, row in batch.iterrows()
    ]
    db.bulk_save_objects(records)
    db.commit()

    return {
        "message": f"Successfully uploaded {len(records)} records for region '{region_name_upper}'.",
        "region": region_name_upper,
        "display_name": region.display_name,
        "records_inserted": len(records),
        "date_start": str(region.date_start),
        "date_end": str(region.date_end),
    }

@app.get("/api/regions/{region_name}/data", response_model=List[HourlyDataPoint], tags=["PJM State Data"])
def get_region_data(
    region_name: str,
    limit: int = 500,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Paginated hourly data for a specific region."""
    region = db.query(PJMRegion).filter(PJMRegion.name == region_name.upper()).first()
    if not region:
        raise HTTPException(status_code=404, detail=f"Region '{region_name}' not found.")
    records = (
        db.query(PJMHourlyData)
        .filter(PJMHourlyData.region_id == region.id)
        .order_by(PJMHourlyData.timestamp)
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [HourlyDataPoint(id=r.id, timestamp=r.timestamp, mw_value=r.mw_value) for r in records]

@app.get("/api/regions/{region_name}/stats", tags=["PJM State Data"])
def get_region_stats(region_name: str, db: Session = Depends(get_db)):
    """Hourly aggregated statistics for a specific region."""
    region = db.query(PJMRegion).filter(PJMRegion.name == region_name.upper()).first()
    if not region:
        raise HTTPException(status_code=404, detail=f"Region '{region_name}' not found.")
    agg = db.query(
        func.avg(PJMHourlyData.mw_value),
        func.max(PJMHourlyData.mw_value),
        func.min(PJMHourlyData.mw_value),
        func.count(PJMHourlyData.id)
    ).filter(PJMHourlyData.region_id == region.id).first()
    return {
        "region": region.name,
        "display_name": region.display_name,
        "record_count": agg[3],
        "avg_mw": round(agg[0], 2) if agg[0] else None,
        "peak_mw": round(agg[1], 2) if agg[1] else None,
        "min_mw": round(agg[2], 2) if agg[2] else None,
        "date_start": str(region.date_start),
        "date_end": str(region.date_end),
    }

@app.delete("/api/regions/{region_name}", tags=["PJM State Data"])
def delete_region(region_name: str, db: Session = Depends(get_db)):
    """Delete a region and all its associated data."""
    region = db.query(PJMRegion).filter(PJMRegion.name == region_name.upper()).first()
    if not region:
        raise HTTPException(status_code=404, detail=f"Region '{region_name}' not found.")
    db.delete(region)
    db.commit()
    return {"message": f"Region '{region_name.upper()}' and all its data have been deleted."}

# ─── PJM Analytics ────────────────────────────────────────────────────────────

@app.get("/api/regions/{region_name}/analytics", tags=["PJM Analytics"])
def get_region_analytics(region_name: str, db: Session = Depends(get_db)):
    """
    Pre-aggregated analytics for a region:
    hourly_pattern, day_pattern, monthly_trend, load_duration, heatmap (weekday x hour)
    """
    region = db.query(PJMRegion).filter(PJMRegion.name == region_name.upper()).first()
    if not region:
        raise HTTPException(status_code=404, detail=f"Region '{region_name}' not found.")

    records = db.query(PJMHourlyData).filter(PJMHourlyData.region_id == region.id).all()
    if not records:
        return {"error": "No data available for this region."}

    df = pd.DataFrame([{"timestamp": r.timestamp, "mw": r.mw_value} for r in records])
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["hour"]         = df["timestamp"].dt.hour
    df["weekday"]      = df["timestamp"].dt.weekday
    df["month_label"]  = df["timestamp"].dt.strftime("%Y-%m")

    DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    overall_avg = float(df["mw"].mean())

    # 1. Hourly pattern 0-23
    hp = df.groupby("hour")["mw"].agg(["mean", "max", "min"]).reset_index()
    hourly_pattern = [
        {"hour": int(r["hour"]), "avg_mw": round(r["mean"], 2),
         "peak_mw": round(r["max"], 2), "min_mw": round(r["min"], 2)}
        for _, r in hp.iterrows()
    ]

    # 2. Day-of-week pattern
    dp = df.groupby("weekday")["mw"].agg(["mean", "max"]).reset_index().sort_values("weekday")
    day_pattern = [
        {"day": DAY_NAMES[int(r["weekday"])], "avg_mw": round(r["mean"], 2), "peak_mw": round(r["max"], 2)}
        for _, r in dp.iterrows()
    ]

    # 3. Monthly trend
    mt = df.groupby("month_label")["mw"].agg(["mean", "max"]).reset_index().sort_values("month_label")
    monthly_trend = [
        {"month": r["month_label"], "avg_mw": round(r["mean"], 2), "peak_mw": round(r["max"], 2)}
        for _, r in mt.iterrows()
    ]

    # 4. Load duration curve (300 sampled points)
    sorted_vals = df["mw"].sort_values(ascending=False).reset_index(drop=True)
    step = max(1, len(sorted_vals) // 300)
    load_duration = [
        {"rank": int(i), "percent": round(i / len(sorted_vals) * 100, 2), "mw": round(float(sorted_vals.iloc[i]), 2)}
        for i in range(0, len(sorted_vals), step)
    ]

    # 5. Heatmap weekday x hour
    hm = df.groupby(["weekday", "hour"])["mw"].mean().reset_index()
    heatmap = [
        {"weekday": int(r["weekday"]), "day": DAY_NAMES[int(r["weekday"])],
         "hour": int(r["hour"]), "avg_mw": round(r["mw"], 2),
         "intensity": round(r["mw"] / overall_avg, 3)}
        for _, r in hm.iterrows()
    ]

    return {
        "region": region.name,
        "display_name": region.display_name,
        "record_count": len(df),
        "overall_avg_mw": round(overall_avg, 2),
        "overall_peak_mw": round(float(df["mw"].max()), 2),
        "hourly_pattern": hourly_pattern,
        "day_pattern": day_pattern,
        "monthly_trend": monthly_trend,
        "load_duration": load_duration,
        "heatmap": heatmap,
    }

@app.get("/api/analytics/compare", tags=["PJM Analytics"])
def compare_all_regions(db: Session = Depends(get_db)):
    """Compare avg and peak MW across all uploaded regions."""
    regions = db.query(PJMRegion).all()
    result = []
    for r in regions:
        agg = db.query(
            func.avg(PJMHourlyData.mw_value),
            func.max(PJMHourlyData.mw_value),
            func.min(PJMHourlyData.mw_value),
        ).filter(PJMHourlyData.region_id == r.id).first()
        if agg[0] is not None:
            result.append({
                "region": r.name, "display_name": r.display_name,
                "avg_mw": round(agg[0], 2), "peak_mw": round(agg[1], 2),
                "min_mw": round(agg[2], 2), "record_count": r.record_count,
            })
    return sorted(result, key=lambda x: x["avg_mw"], reverse=True)
