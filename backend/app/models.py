from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.database import Base

class EnergySource(Base):
    __tablename__ = "energy_sources"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True) # e.g. "Electricity", "Petroleum"
    unit_default = Column(String) # e.g. "GWh", "MT"

class ISICSector(Base):
    __tablename__ = "isic_sectors"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True) # e.g. "C10"
    name = Column(String) # e.g. "Manufacture of food products"

class ConversionFactor(Base):
    __tablename__ = "conversion_factors"
    
    id = Column(Integer, primary_key=True, index=True)
    from_unit = Column(String, index=True)
    to_unit = Column(String, index=True)
    multiplier = Column(Float)

class PJMRegion(Base):
    """Represents an uploaded PJM state/region CSV dataset."""
    __tablename__ = "pjm_regions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)  # e.g. "AEP", "DEOK"
    display_name = Column(String)                   # e.g. "American Electric Power"
    description = Column(Text, nullable=True)
    column_name = Column(String)                    # The MW column header in the CSV
    record_count = Column(Integer, default=0)
    date_start = Column(DateTime, nullable=True)
    date_end = Column(DateTime, nullable=True)
    hourly_data = relationship("PJMHourlyData", back_populates="region", cascade="all, delete-orphan")


class PJMHourlyData(Base):
    """Hourly MW consumption record per PJM region."""
    __tablename__ = "pjm_hourly_data"

    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, ForeignKey("pjm_regions.id"), index=True)
    timestamp = Column(DateTime, index=True)
    mw_value = Column(Float)
    region = relationship("PJMRegion", back_populates="hourly_data")


class EnergyFactData(Base):
    __tablename__ = "energy_fact_data"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, index=True)
    source_id = Column(Integer, ForeignKey("energy_sources.id"))
    sector_id = Column(Integer, ForeignKey("isic_sectors.id"), nullable=True)
    value = Column(Float) # The measured value in the default unit
    
    source = relationship("EnergySource")
    sector = relationship("ISICSector")
