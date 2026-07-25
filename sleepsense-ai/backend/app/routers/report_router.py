import io
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from app.database import get_db
from app.db_models import User, SleepEntry
from app.auth import get_current_user
from app.ml import recommender

router = APIRouter(prefix="/api/report", tags=["report"])


@router.get("/pdf")
def generate_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entries = (
        db.query(SleepEntry)
        .filter(SleepEntry.user_id == current_user.id)
        .order_by(desc(SleepEntry.date))
        .limit(7)
        .all()
    )
    if not entries:
        raise HTTPException(status_code=404, detail="No sleep entries found yet")

    latest = entries[0]
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=2 * cm, bottomMargin=2 * cm)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("TitleBig", parent=styles["Title"], textColor=colors.HexColor("#4338CA"))

    elements = [
        Paragraph("SleepSense AI - Health Report", title_style),
        Paragraph(f"Generated for {current_user.name} on {datetime.now().strftime('%d %b %Y')}", styles["Normal"]),
        Spacer(1, 16),
        Paragraph("Latest Sleep Quality Summary", styles["Heading2"]),
    ]

    summary_data = [
        ["Metric", "Value"],
        ["Sleep Quality Score", f"{latest.sleep_quality_score} / 100"],
        ["Sleep Category", latest.sleep_category],
        ["Sleep Efficiency", f"{latest.sleep_efficiency}%"],
        ["Deep Sleep", f"{int(latest.deep_sleep_minutes)} min"],
        ["REM Sleep", f"{int(latest.rem_sleep_minutes)} min"],
        ["Sleep Debt", f"{int(latest.sleep_debt_minutes)} min"],
        ["Fatigue Risk", latest.fatigue_risk],
        ["Stress Impact", f"{latest.stress_impact}%"],
        ["Overall Wellness Score", f"{latest.overall_wellness_score}%"],
    ]
    table = Table(summary_data, colWidths=[8 * cm, 8 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4338CA")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F3F4F6")]),
            ]
        )
    )
    elements.append(table)
    elements.append(Spacer(1, 16))

    elements.append(Paragraph("Weekly Progress (last entries)", styles["Heading2"]))
    weekly_data = [["Date", "Score", "Category"]]
    for e in reversed(entries):
        weekly_data.append([e.date.strftime("%d %b"), str(e.sleep_quality_score), e.sleep_category])
    weekly_table = Table(weekly_data, colWidths=[5 * cm, 5 * cm, 6 * cm])
    weekly_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#6366F1")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
            ]
        )
    )
    elements.append(weekly_table)
    elements.append(Spacer(1, 16))

    recs = recommender.get_recommendations(latest.data, {})
    elements.append(Paragraph("Personalized Recommendations", styles["Heading2"]))
    for tip in recs["lifestyle_tips"]:
        elements.append(Paragraph(f"- {tip}", styles["Normal"]))

    doc.build(elements)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=sleepsense_report.pdf"},
    )
