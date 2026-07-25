from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    occupation = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    entries = relationship("SleepEntry", back_populates="owner")


class SleepEntry(Base):
    """
    One row per day of tracked data. `data` stores the full raw payload
    (lifestyle, screen usage, food, mental health, environment, wearables)
    as JSON so the schema can evolve without migrations, while the key
    prediction outputs are stored as columns for fast querying/charting.
    """

    __tablename__ = "sleep_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())

    data = Column(JSON, nullable=False)

    sleep_quality_score = Column(Float, nullable=True)
    sleep_category = Column(String, nullable=True)
    sleep_efficiency = Column(Float, nullable=True)
    deep_sleep_minutes = Column(Float, nullable=True)
    rem_sleep_minutes = Column(Float, nullable=True)
    sleep_debt_minutes = Column(Float, nullable=True)
    fatigue_risk = Column(String, nullable=True)
    stress_impact = Column(Float, nullable=True)
    overall_wellness_score = Column(Float, nullable=True)

    owner = relationship("User", back_populates="entries")
