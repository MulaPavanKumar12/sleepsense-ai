import React, { useState } from "react";
import api from "../api/client";

const defaultForm = {
  sleep_duration_hours: 7,
  time_to_fall_asleep_min: 15,
  awakenings: 0,
  sleep_consistency: "consistent",
  daily_exercise_min: 20,
  daily_steps: 6000,
  screen_time_before_bed_min: 30,
  blue_light_filter: false,
  coffee_cups: 1,
  tea_cups: 0,
  water_intake_liters: 2.5,
  heavy_dinner: false,
  late_night_snacks: false,
  smoking: false,
  alcohol: false,
  stress_level: 5,
  anxiety_level: 4,
  meditation_min: 0,
  snoring: false,
  sleep_apnea: false,
  room_temperature_c: 22,
  noise_level: "low",
  light_level: "dark",
  mattress_comfort: 7,
  pillow_comfort: 7,
  humidity_percent: 50,
};

function ScoreRing({ score, category }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r="54" stroke="#212a5c" strokeWidth="10" fill="none" />
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="#F4C978"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl text-dusk-100">{score}</span>
        <span className="text-xs text-moon-300 uppercase tracking-wide">{category}</span>
      </div>
    </div>
  );
}

export default function LogSleep() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [key]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        sleep_duration_hours: Number(form.sleep_duration_hours),
        time_to_fall_asleep_min: Number(form.time_to_fall_asleep_min),
        awakenings: Number(form.awakenings),
        daily_exercise_min: Number(form.daily_exercise_min),
        daily_steps: Number(form.daily_steps),
        screen_time_before_bed_min: Number(form.screen_time_before_bed_min),
        coffee_cups: Number(form.coffee_cups),
        tea_cups: Number(form.tea_cups),
        water_intake_liters: Number(form.water_intake_liters),
        stress_level: Number(form.stress_level),
        anxiety_level: Number(form.anxiety_level),
        meditation_min: Number(form.meditation_min),
        room_temperature_c: Number(form.room_temperature_c),
        mattress_comfort: Number(form.mattress_comfort),
        pillow_comfort: Number(form.pillow_comfort),
        humidity_percent: Number(form.humidity_percent),
      };
      const res = await api.post("/sleep/entries", payload);
      setResult(res.data.prediction);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, children }) => (
    <div>
      <label className="label-text">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-dusk-100 mb-1">Log today's sleep</h1>
      <p className="text-dusk-400 mb-8 text-sm">
        Covers sleep tracking, lifestyle, screen use, food, mental health, and environment.
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 card p-6 space-y-6">
          <section>
            <h3 className="text-moon-300 font-display text-lg mb-3">Sleep</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Duration (hrs)">
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={form.sleep_duration_hours}
                  onChange={update("sleep_duration_hours")}
                />
              </Field>
              <Field label="Time to fall asleep (min)">
                <input
                  type="number"
                  className="input-field"
                  value={form.time_to_fall_asleep_min}
                  onChange={update("time_to_fall_asleep_min")}
                />
              </Field>
              <Field label="Awakenings">
                <input
                  type="number"
                  className="input-field"
                  value={form.awakenings}
                  onChange={update("awakenings")}
                />
              </Field>
              <Field label="Consistency">
                <select className="input-field" value={form.sleep_consistency} onChange={update("sleep_consistency")}>
                  <option value="consistent">Consistent</option>
                  <option value="inconsistent">Inconsistent</option>
                </select>
              </Field>
            </div>
          </section>

          <section>
            <h3 className="text-moon-300 font-display text-lg mb-3">Lifestyle & screen time</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Exercise (min/day)">
                <input
                  type="number"
                  className="input-field"
                  value={form.daily_exercise_min}
                  onChange={update("daily_exercise_min")}
                />
              </Field>
              <Field label="Steps/day">
                <input
                  type="number"
                  className="input-field"
                  value={form.daily_steps}
                  onChange={update("daily_steps")}
                />
              </Field>
              <Field label="Screen time before bed (min)">
                <input
                  type="number"
                  className="input-field"
                  value={form.screen_time_before_bed_min}
                  onChange={update("screen_time_before_bed_min")}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm mt-6">
                <input type="checkbox" checked={form.blue_light_filter} onChange={update("blue_light_filter")} />
                Blue light filter on
              </label>
            </div>
          </section>

          <section>
            <h3 className="text-moon-300 font-display text-lg mb-3">Food & drink</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Coffee cups">
                <input
                  type="number"
                  className="input-field"
                  value={form.coffee_cups}
                  onChange={update("coffee_cups")}
                />
              </Field>
              <Field label="Tea cups">
                <input type="number" className="input-field" value={form.tea_cups} onChange={update("tea_cups")} />
              </Field>
              <Field label="Water (litres)">
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={form.water_intake_liters}
                  onChange={update("water_intake_liters")}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm mt-6">
                <input type="checkbox" checked={form.heavy_dinner} onChange={update("heavy_dinner")} />
                Heavy dinner
              </label>
              <label className="flex items-center gap-2 text-sm mt-6">
                <input type="checkbox" checked={form.late_night_snacks} onChange={update("late_night_snacks")} />
                Late-night snacks
              </label>
              <label className="flex items-center gap-2 text-sm mt-6">
                <input type="checkbox" checked={form.alcohol} onChange={update("alcohol")} />
                Alcohol today
              </label>
              <label className="flex items-center gap-2 text-sm mt-6">
                <input type="checkbox" checked={form.smoking} onChange={update("smoking")} />
                Smoking today
              </label>
            </div>
          </section>

          <section>
            <h3 className="text-moon-300 font-display text-lg mb-3">Mental health</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label={`Stress level: ${form.stress_level}/10`}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.stress_level}
                  onChange={update("stress_level")}
                  className="w-full"
                />
              </Field>
              <Field label={`Anxiety level: ${form.anxiety_level}/10`}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.anxiety_level}
                  onChange={update("anxiety_level")}
                  className="w-full"
                />
              </Field>
              <Field label="Meditation (min)">
                <input
                  type="number"
                  className="input-field"
                  value={form.meditation_min}
                  onChange={update("meditation_min")}
                />
              </Field>
            </div>
          </section>

          <section>
            <h3 className="text-moon-300 font-display text-lg mb-3">Environment</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Room temperature (°C)">
                <input
                  type="number"
                  className="input-field"
                  value={form.room_temperature_c}
                  onChange={update("room_temperature_c")}
                />
              </Field>
              <Field label="Noise level">
                <select className="input-field" value={form.noise_level} onChange={update("noise_level")}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </Field>
              <Field label="Light level">
                <select className="input-field" value={form.light_level} onChange={update("light_level")}>
                  <option value="dark">Dark</option>
                  <option value="dim">Dim</option>
                  <option value="bright">Bright</option>
                </select>
              </Field>
              <label className="flex items-center gap-2 text-sm mt-6">
                <input type="checkbox" checked={form.snoring} onChange={update("snoring")} />
                Snoring
              </label>
            </div>
          </section>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Analyzing..." : "Predict sleep quality"}
          </button>
        </form>

        <div className="card p-6 h-fit sticky top-24">
          <h3 className="text-moon-300 font-display text-lg mb-4 text-center">Prediction</h3>
          {result ? (
            <>
              <ScoreRing score={result.sleep_quality_score} category={result.sleep_category} />
              <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
                <div>
                  <p className="text-dusk-400 text-xs">Efficiency</p>
                  <p className="text-dusk-100">{result.sleep_efficiency}%</p>
                </div>
                <div>
                  <p className="text-dusk-400 text-xs">Fatigue risk</p>
                  <p className="text-dusk-100">{result.fatigue_risk}</p>
                </div>
                <div>
                  <p className="text-dusk-400 text-xs">Deep sleep</p>
                  <p className="text-dusk-100">{result.deep_sleep_minutes} min</p>
                </div>
                <div>
                  <p className="text-dusk-400 text-xs">REM sleep</p>
                  <p className="text-dusk-100">{result.rem_sleep_minutes} min</p>
                </div>
                <div>
                  <p className="text-dusk-400 text-xs">Sleep debt</p>
                  <p className="text-dusk-100">{result.sleep_debt_minutes} min</p>
                </div>
                <div>
                  <p className="text-dusk-400 text-xs">Wellness score</p>
                  <p className="text-dusk-100">{result.overall_wellness_score}%</p>
                </div>
              </div>
              {result.key_factors?.length > 0 && (
                <div className="mt-6">
                  <p className="text-dusk-400 text-xs mb-2">Key factors</p>
                  <ul className="text-sm space-y-1">
                    {result.key_factors.map((f) => (
                      <li key={f} className="text-dusk-300">
                        • {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="text-dusk-400 text-sm text-center py-16">
              Fill in today's data and submit to see your predicted sleep quality.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
