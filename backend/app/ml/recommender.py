from typing import Dict, Any, List

FOODS_TO_EAT = {
    "Magnesium Rich": ["Almonds", "Pumpkin Seeds", "Cashews", "Spinach", "Avocado"],
    "Melatonin Rich": ["Tart Cherries", "Kiwi", "Walnuts", "Grapes", "Tomatoes"],
    "Tryptophan Rich": ["Milk", "Yogurt", "Eggs", "Turkey", "Chicken", "Cheese"],
    "Healthy Carbohydrates": ["Oatmeal", "Brown Rice", "Sweet Potato", "Whole Wheat Bread"],
    "Healthy Drinks": ["Warm Milk", "Chamomile Tea", "Lavender Tea", "Lemon Balm Tea"],
}

FOODS_TO_AVOID = {
    "Caffeine": ["Coffee", "Strong Tea", "Energy Drinks", "Cola"],
    "Sugary Foods": ["Chocolate", "Ice Cream", "Cake", "Candy"],
    "Heavy Foods": ["Pizza", "Burger", "Biryani", "Fried Chicken", "Fast Food"],
    "Spicy Foods": ["Chips", "Spicy Curry", "Hot Sauce"],
    "Alcohol": ["Beer", "Whisky", "Wine"],
    "Nicotine": ["Cigarettes", "Vapes"],
}


def get_recommendations(entry: Dict[str, Any], prediction: Dict[str, Any]) -> Dict[str, Any]:
    tips: List[str] = []

    if entry.get("bedtime"):
        tips.append("Try to keep a consistent bedtime, ideally before 10:30 PM.")
    if entry.get("screen_time_before_bed_min", 0) > 30:
        tips.append("Reduce screen time to under 30 minutes before bed, or use a blue-light filter.")
    if entry.get("daily_steps", 0) < 8000:
        tips.append("Aim for 8,000+ steps a day to improve sleep depth.")
    if entry.get("daily_exercise_min", 0) < 20:
        tips.append("Add 30-45 minutes of moderate exercise, earlier in the day rather than right before bed.")
    if entry.get("water_intake_liters", 2) < 2.5:
        tips.append("Increase water intake to 2.5-3 litres a day (but taper off close to bedtime).")
    if entry.get("meditation_min", 0) < 10:
        tips.append("Try 10-15 minutes of meditation or deep breathing before bed.")
    if entry.get("coffee_cups", 0) + entry.get("tea_cups", 0) > 2:
        tips.append("Avoid caffeine after 3 PM.")
    if entry.get("heavy_dinner", False) or entry.get("late_night_snacks", False):
        tips.append("Eat dinner at least 2-3 hours before bedtime and avoid heavy or late-night snacks.")
    if entry.get("noise_level") == "high" or entry.get("light_level") == "bright":
        tips.append("Maintain a cool, dark, and quiet bedroom.")
    if entry.get("stress_level", 5) > 6:
        tips.append("Your stress levels look high - consider journaling or a short wind-down routine before bed.")

    if not tips:
        tips.append("Great job! Keep maintaining your current healthy sleep habits.")

    return {
        "foods_to_eat": FOODS_TO_EAT,
        "foods_to_avoid": FOODS_TO_AVOID,
        "lifestyle_tips": tips,
    }


def ai_coach_answer(question: str, entry: Dict[str, Any] = None, prediction: Dict[str, Any] = None) -> str:
    """
    Simple rule-based Q&A. Swap this out for a call to the Anthropic API
    (or any LLM) for richer, conversational answers - just pass the user's
    recent entries + prediction as context in the prompt.
    """
    q = question.lower()
    entry = entry or {}
    prediction = prediction or {}

    if "deep sleep" in q:
        return (
            "Deep sleep is usually reduced by late caffeine, alcohol, irregular bedtimes, "
            "and screen exposure before bed. Try shifting your last coffee earlier in the day "
            "and dimming lights an hour before sleep."
        )
    if "fall asleep" in q or "sleep faster" in q:
        return (
            "To fall asleep faster: keep a consistent bedtime, avoid screens 30-60 minutes "
            "before bed, keep your room cool and dark, and try a short breathing or meditation "
            "routine to calm your nervous system."
        )
    if "food" in q:
        return (
            "Foods rich in magnesium (almonds, spinach), melatonin (tart cherries, kiwi), and "
            "tryptophan (milk, turkey, eggs) can support better sleep. Avoid caffeine, alcohol, "
            "and heavy/spicy meals close to bedtime."
        )
    if "stress" in q:
        stress = entry.get("stress_level", 5)
        return (
            f"Your recent stress level is {stress}/10. Stress above 6 is strongly linked to "
            "lighter, more fragmented sleep. Meditation, journaling, and light exercise earlier "
            "in the day can help lower its impact."
        )
    if "3 am" in q or "wake up" in q or "waking" in q:
        return (
            "Waking at a consistent time overnight is often linked to alcohol, a heavy dinner, "
            "stress, or an uncomfortable sleep environment (noise, light, temperature). Check "
            "if any of these apply and try adjusting one at a time."
        )
    return (
        "I can help with questions about deep sleep, falling asleep faster, food choices, "
        "stress, or nighttime waking. Try asking about one of those, or log today's data for "
        "a personalized answer."
    )
