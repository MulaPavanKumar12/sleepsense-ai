from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from app.database import get_db
from app.db_models import User, SleepEntry
from app import schemas
from app.auth import get_current_user
from app.ml import predictor, recommender

router = APIRouter(prefix="/api/sleep", tags=["sleep"])


@router.post("/entries", response_model=schemas.SleepEntryOut)
def create_entry(
    payload: schemas.SleepEntryInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry_dict = payload.model_dump()
    prediction = predictor.predict(entry_dict)

    entry = SleepEntry(
        user_id=current_user.id,
        data=entry_dict,
        sleep_quality_score=prediction["sleep_quality_score"],
        sleep_category=prediction["sleep_category"],
        sleep_efficiency=prediction["sleep_efficiency"],
        deep_sleep_minutes=prediction["deep_sleep_minutes"],
        rem_sleep_minutes=prediction["rem_sleep_minutes"],
        sleep_debt_minutes=prediction["sleep_debt_minutes"],
        fatigue_risk=prediction["fatigue_risk"],
        stress_impact=prediction["stress_impact"],
        overall_wellness_score=prediction["overall_wellness_score"],
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    return {
        "id": entry.id,
        "date": entry.date,
        "data": entry.data,
        "prediction": prediction,
    }


@router.get("/entries", response_model=List[schemas.SleepEntryOut])
def list_entries(
    limit: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entries = (
        db.query(SleepEntry)
        .filter(SleepEntry.user_id == current_user.id)
        .order_by(desc(SleepEntry.date))
        .limit(limit)
        .all()
    )
    result = []
    for e in entries:
        result.append(
            {
                "id": e.id,
                "date": e.date,
                "data": e.data,
                "prediction": {
                    "sleep_quality_score": e.sleep_quality_score,
                    "sleep_category": e.sleep_category,
                    "sleep_efficiency": e.sleep_efficiency,
                    "deep_sleep_minutes": e.deep_sleep_minutes,
                    "rem_sleep_minutes": e.rem_sleep_minutes,
                    "sleep_debt_minutes": e.sleep_debt_minutes,
                    "fatigue_risk": e.fatigue_risk,
                    "stress_impact": e.stress_impact,
                    "overall_wellness_score": e.overall_wellness_score,
                    "key_factors": [],
                },
            }
        )
    return result


@router.get("/entries/{entry_id}/recommendations", response_model=schemas.RecommendationOutput)
def get_entry_recommendations(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = (
        db.query(SleepEntry)
        .filter(SleepEntry.id == entry_id, SleepEntry.user_id == current_user.id)
        .first()
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    prediction = {
        "sleep_quality_score": entry.sleep_quality_score,
        "sleep_category": entry.sleep_category,
    }
    return recommender.get_recommendations(entry.data, prediction)


@router.post("/coach")
def ask_coach(
    payload: schemas.CoachQuestion,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    latest = (
        db.query(SleepEntry)
        .filter(SleepEntry.user_id == current_user.id)
        .order_by(desc(SleepEntry.date))
        .first()
    )
    entry_data = latest.data if latest else {}
    prediction = (
        {"sleep_quality_score": latest.sleep_quality_score, "sleep_category": latest.sleep_category}
        if latest
        else {}
    )
    answer = recommender.ai_coach_answer(payload.question, entry_data, prediction)
    return {"answer": answer}
