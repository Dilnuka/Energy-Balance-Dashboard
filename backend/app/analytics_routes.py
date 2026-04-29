
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
