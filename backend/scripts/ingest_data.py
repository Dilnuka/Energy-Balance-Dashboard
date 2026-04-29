import os
import sys
import pandas as pd
from datetime import datetime

# Add the parent directory to sys.path so we can import 'app'
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine
from app.models import Base, EnergySource, ISICSector, ConversionFactor, EnergyFactData

def mock_pjm_data():
    """Generates a mock of the PJM dataset for initial testing based on user sample."""
    return [
        {"Datetime": "2004-12-31 01:00:00", "AEP_MW": 13478.0},
        {"Datetime": "2004-12-31 02:00:00", "AEP_MW": 12865.0},
        {"Datetime": "2004-12-31 03:00:00", "AEP_MW": 12577.0},
        {"Datetime": "2004-12-31 04:00:00", "AEP_MW": 12517.0},
        {"Datetime": "2004-12-31 05:00:00", "AEP_MW": 12670.0},
        {"Datetime": "2004-12-31 06:00:00", "AEP_MW": 13038.0},
        {"Datetime": "2004-12-31 07:00:00", "AEP_MW": 13692.0},
        {"Datetime": "2004-12-31 08:00:00", "AEP_MW": 14297.0},
    ]

def ingest_data():
    print("Connecting to local SQLite database...")
    db = SessionLocal()
    
    try:
        # Seed core lookups
        print("Seeding database with lookup tables (ISIC, Energy Sources, Conversion Factors)...")
        
        # Check if already seeded
        existing_source = db.query(EnergySource).filter(EnergySource.name == "Electricity (PJM Grid)").first()
        if existing_source:
            print("Database already seeded. Skipping lookup creation.")
            electricity = existing_source
            national_grid = db.query(ISICSector).filter(ISICSector.code == "TOTAL").first()
        else:
            electricity = EnergySource(name="Electricity (PJM Grid)", unit_default="MW")
            db.add(electricity)
            
            # Map PJM region broadly as a total grid sector
            national_grid = ISICSector(code="TOTAL", name="Total Grid Load")
            db.add(national_grid)
            
            # Add mathematical conversion factors
            mw_to_kw = ConversionFactor(from_unit="MW", to_unit="kW", multiplier=1000.0)
            db.add(mw_to_kw)
            
            db.commit()
            db.refresh(electricity)
            db.refresh(national_grid)
        
        # Ingest PJM Data
        print("Ingesting PJM hourly energy consumption sample...")
        data = mock_pjm_data()
        
        records_added = 0
        for row in data:
            dt = datetime.strptime(row["Datetime"], "%Y-%m-%d %H:%M:%S")
            
            # Check if this exact timestamp already exists to prevent duplicates
            exists = db.query(EnergyFactData).filter(
                EnergyFactData.timestamp == dt,
                EnergyFactData.source_id == electricity.id
            ).first()
            
            if not exists:
                fact = EnergyFactData(
                    timestamp=dt,
                    source_id=electricity.id,
                    sector_id=national_grid.id,
                    value=row["AEP_MW"]
                )
                db.add(fact)
                records_added += 1
                
        db.commit()
        print(f"Data successfully ingested! {records_added} new hourly records added.")
        
    except Exception as e:
        print(f"Error during ingestion: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    ingest_data()
