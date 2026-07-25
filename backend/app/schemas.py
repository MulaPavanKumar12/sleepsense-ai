from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# ---------- Auth ----------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    occupation: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    age: Optional[int]
    gender: Optional[str]
    height_cm: Optional[float]
    weight_kg: Optional[float]
    occupation: Optional[str]
    bmi: Optional[float] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Sleep entry input ----------
class SleepEntryInput(BaseModel):
    # Module 2: Sleep tracking
    sleep_duration_hours: float = Field(..., ge=0, le=24)
    bedtime: Optional[str] = None
    wake_time: Optional[str] = None
    time_to_fall_asleep_min: Optional[float] = 15
    awakenings: Optional[int] = 0
    nap_duration_min: Optional[float] = 0
    sleep_consistency: Optional[str] = "consistent"
    weekend_sleep_duration: Optional[float] = None

    # Module 3: Lifestyle
    daily_exercise_min: Optional[float] = 0
    exercise_type: Optional[str] = None
    exercise_timing: Optional[str] = None
    daily_steps: Optional[int] = 0
    sitting_hours: Optional[float] = 0
    work_hours: Optional[float] = 8
    outdoor_activity_min: Optional[float] = 0

    # Module 4: Screen usage
    phone_screen_time_hr: Optional[float] = 0
    laptop_usage_hr: Optional[float] = 0
    tv_hr: Optional[float] = 0
    screen_time_before_bed_min: Optional[float] = 0
    blue_light_filter: Optional[bool] = False
    gaming_min: Optional[float] = 0

    # Module 5: Food & drink
    coffee_cups: Optional[int] = 0
    tea_cups: Optional[int] = 0
    energy_drinks_per_week: Optional[int] = 0
    water_intake_liters: Optional[float] = 2.0
    dinner_time: Optional[str] = None
    heavy_dinner: Optional[bool] = False
    late_night_snacks: Optional[bool] = False
    smoking: Optional[bool] = False
    alcohol: Optional[bool] = False

    # Module 6: Nutrition (foods consumed today, free-form list)
    foods_consumed: Optional[List[str]] = []

    # Module 7: Mental health
    stress_level: Optional[int] = Field(5, ge=1, le=10)
    anxiety_level: Optional[int] = Field(5, ge=1, le=10)
    mood: Optional[str] = "neutral"
    depression_score: Optional[int] = None
    meditation_min: Optional[float] = 0
    yoga_frequency_per_week: Optional[int] = 0

    # Module 8: Health
    blood_pressure: Optional[str] = None
    heart_rate: Optional[int] = None
    diabetes: Optional[bool] = False
    thyroid: Optional[bool] = False
    asthma: Optional[bool] = False
    sleep_apnea: Optional[bool] = False
    snoring: Optional[bool] = False

    # Module 9: Sleep environment
    room_temperature_c: Optional[float] = 22
    noise_level: Optional[str] = "low"
    light_level: Optional[str] = "dark"
    mattress_comfort: Optional[int] = Field(7, ge=1, le=10)
    pillow_comfort: Optional[int] = Field(7, ge=1, le=10)
    humidity_percent: Optional[float] = 50

    # Module 10: Smart device (optional)
    wearable_heart_rate: Optional[int] = None
    wearable_spo2: Optional[float] = None
    wearable_deep_sleep_min: Optional[float] = None
    wearable_rem_sleep_min: Optional[float] = None
    wearable_calories_burned: Optional[float] = None
    wearable_activity_min: Optional[float] = None
    wearable_sleep_score: Optional[float] = None


class PredictionOutput(BaseModel):
    sleep_quality_score: float
    sleep_category: str
    sleep_efficiency: float
    deep_sleep_minutes: float
    rem_sleep_minutes: float
    sleep_debt_minutes: float
    fatigue_risk: str
    stress_impact: float
    overall_wellness_score: float
    key_factors: List[str]


class RecommendationOutput(BaseModel):
    foods_to_eat: Dict[str, List[str]]
    foods_to_avoid: Dict[str, List[str]]
    lifestyle_tips: List[str]


class SleepEntryOut(BaseModel):
    id: int
    date: datetime
    data: Dict[str, Any]
    prediction: Dict[str, Any]

    class Config:
        from_attributes = True


class CoachQuestion(BaseModel):
    question: str
