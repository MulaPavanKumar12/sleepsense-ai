"""
SleepSense AI prediction engine.

This ships as an explainable, rule-based scoring model so the app works
out of the box with zero training data. It's structured so you can swap
it for a trained scikit-learn/XGBoost model later: just replace the body
of `predict()` with `model.predict(features)` and keep the same output
shape (see schemas.PredictionOutput).

To train a real model later:
1. Collect labeled SleepEntry rows (features + a measured sleep_quality_score
   from a wearable or sleep study).
2. Build a feature vector with `build_feature_vector()` below.
3. Train e.g. an XGBoost regressor on those vectors.
4. Save with joblib and load it here instead of using the rule engine.
"""

from typing import Dict, Any, List


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def build_feature_vector(entry: Dict[str, Any]) -> Dict[str, float]:
    """Flatten the raw entry into a numeric feature dict for a future ML model."""
    return {
        "sleep_duration_hours": entry.get("sleep_duration_hours", 7),
        "time_to_fall_asleep_min": entry.get("time_to_fall_asleep_min", 15),
        "awakenings": entry.get("awakenings", 0),
        "screen_time_before_bed_min": entry.get("screen_time_before_bed_min", 0),
        "coffee_cups": entry.get("coffee_cups", 0),
        "stress_level": entry.get("stress_level", 5),
        "daily_exercise_min": entry.get("daily_exercise_min", 0),
        "daily_steps": entry.get("daily_steps", 0),
        "water_intake_liters": entry.get("water_intake_liters", 2.0),
        "room_temperature_c": entry.get("room_temperature_c", 22),
        "meditation_min": entry.get("meditation_min", 0),
    }


def predict(entry: Dict[str, Any]) -> Dict[str, Any]:
    score = 100.0
    factors: List[str] = []

    duration = entry.get("sleep_duration_hours", 7)
    if duration < 6:
        score -= (6 - duration) * 8
        factors.append("Short sleep duration")
    elif duration > 9:
        score -= (duration - 9) * 4
        factors.append("Oversleeping")

    fall_asleep = entry.get("time_to_fall_asleep_min", 15)
    if fall_asleep > 20:
        score -= min((fall_asleep - 20) * 0.5, 15)
        factors.append("Long time to fall asleep")

    awakenings = entry.get("awakenings", 0)
    if awakenings > 1:
        score -= min(awakenings * 3, 15)
        factors.append("Frequent awakenings")

    screen_before_bed = entry.get("screen_time_before_bed_min", 0)
    if screen_before_bed > 30:
        penalty = min((screen_before_bed - 30) * 0.15, 12)
        score -= penalty
        if not entry.get("blue_light_filter", False):
            score -= 3
        factors.append("High screen time before bed")

    coffee = entry.get("coffee_cups", 0) + entry.get("tea_cups", 0) * 0.5
    if coffee > 2:
        score -= min((coffee - 2) * 4, 15)
        factors.append("High caffeine intake")

    if entry.get("alcohol", False):
        score -= 8
        factors.append("Alcohol consumption")

    if entry.get("smoking", False):
        score -= 6
        factors.append("Smoking / nicotine use")

    if entry.get("heavy_dinner", False):
        score -= 5
        factors.append("Heavy late dinner")

    if entry.get("late_night_snacks", False):
        score -= 4
        factors.append("Late-night snacking")

    stress = entry.get("stress_level", 5)
    stress_impact = _clamp((stress - 3) * 12, 0, 100)
    if stress > 6:
        score -= (stress - 6) * 3
        factors.append("Elevated stress levels")

    anxiety = entry.get("anxiety_level", 5)
    if anxiety > 6:
        score -= (anxiety - 6) * 2

    exercise = entry.get("daily_exercise_min", 0)
    if 20 <= exercise <= 60:
        score += 5
        factors.append("Healthy exercise routine (positive)")
    elif exercise > 0:
        score += 2

    steps = entry.get("daily_steps", 0)
    if steps >= 8000:
        score += 3

    meditation = entry.get("meditation_min", 0)
    if meditation >= 10:
        score += 4
        factors.append("Meditation practice (positive)")

    noise = entry.get("noise_level", "low")
    if noise == "high":
        score -= 6
        factors.append("Noisy sleep environment")
    elif noise == "medium":
        score -= 2

    light = entry.get("light_level", "dark")
    if light == "bright":
        score -= 6
        factors.append("Bright sleep environment")
    elif light == "dim":
        score -= 2

    temp = entry.get("room_temperature_c", 22)
    if temp < 16 or temp > 26:
        score -= 5
        factors.append("Uncomfortable room temperature")

    mattress = entry.get("mattress_comfort", 7)
    pillow = entry.get("pillow_comfort", 7)
    if mattress < 5:
        score -= (5 - mattress) * 2
    if pillow < 5:
        score -= (5 - pillow) * 1.5

    if entry.get("snoring", False) or entry.get("sleep_apnea", False):
        score -= 8
        factors.append("Snoring / possible sleep apnea")

    if entry.get("sleep_consistency", "consistent") == "inconsistent":
        score -= 6
        factors.append("Inconsistent sleep schedule")

    score = _clamp(score, 0, 100)

    if score >= 90:
        category = "Excellent"
    elif score >= 75:
        category = "Good"
    elif score >= 55:
        category = "Fair"
    elif score >= 35:
        category = "Poor"
    else:
        category = "Critical"

    efficiency = _clamp(
        100 - (fall_asleep * 0.5) - (awakenings * 4) - (0 if duration >= 7 else (7 - duration) * 3),
        40,
        99,
    )

    total_sleep_min = duration * 60
    deep_sleep = entry.get("wearable_deep_sleep_min") or _clamp(total_sleep_min * 0.20, 30, 150)
    rem_sleep = entry.get("wearable_rem_sleep_min") or _clamp(total_sleep_min * 0.22, 30, 140)

    ideal_sleep_min = 8 * 60
    sleep_debt = max(0, ideal_sleep_min - total_sleep_min)

    if score >= 80 and stress <= 5:
        fatigue_risk = "Low"
    elif score >= 55:
        fatigue_risk = "Medium"
    else:
        fatigue_risk = "High"

    wellness_score = _clamp(
        (score * 0.55) + ((100 - stress_impact) * 0.25) + (min(exercise, 60) / 60 * 20),
        0,
        100,
    )

    return {
        "sleep_quality_score": round(score, 1),
        "sleep_category": category,
        "sleep_efficiency": round(efficiency, 1),
        "deep_sleep_minutes": round(deep_sleep, 0),
        "rem_sleep_minutes": round(rem_sleep, 0),
        "sleep_debt_minutes": round(sleep_debt, 0),
        "fatigue_risk": fatigue_risk,
        "stress_impact": round(stress_impact, 1),
        "overall_wellness_score": round(wellness_score, 1),
        "key_factors": factors[:8],
    }
