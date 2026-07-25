import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import api from "../api/client";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/sleep/entries?limit=14")
      .then((res) => setEntries(res.data.reverse()))
      .finally(() => setLoading(false));
  }, []);

  const chartData = entries.map((e) => ({
    date: new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: e.prediction.sleep_quality_score,
    stress: e.data.stress_level,
    duration: e.data.sleep_duration_hours,
  }));

  const latest = entries[entries.length - 1];

  const StatCard = ({ label, value, sub }) => (
    <div className="card p-5">
      <p className="text-dusk-400 text-xs uppercase tracking-wide">{label}</p>
      <p className="font-display text-2xl text-dusk-100 mt-1">{value}</p>
      {sub && <p className="text-xs text-dusk-400 mt-1">{sub}</p>}
    </div>
  );

  if (loading) {
    return <div className="text-center py-20 text-dusk-400">Loading dashboard...</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center card p-10">
        <h2 className="font-display text-2xl text-dusk-100 mb-3">No sleep data yet</h2>
        <p className="text-dusk-400 mb-6">Log today's sleep to see your first prediction and analytics.</p>
        <Link to="/log" className="btn-primary">
          Log sleep now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-dusk-100">Your sleep dashboard</h1>
        <Link to="/log" className="btn-primary text-sm">
          + Log today
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Latest score" value={`${latest.prediction.sleep_quality_score}/100`} sub={latest.prediction.sleep_category} />
        <StatCard label="Sleep efficiency" value={`${latest.prediction.sleep_efficiency}%`} />
        <StatCard label="Fatigue risk" value={latest.prediction.fatigue_risk} />
        <StatCard label="Wellness score" value={`${latest.prediction.overall_wellness_score}%`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display text-lg text-moon-300 mb-4">Sleep quality trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#212a5c" />
              <XAxis dataKey="date" stroke="#8B8FCF" fontSize={12} />
              <YAxis stroke="#8B8FCF" fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#101538", border: "none", borderRadius: 8 }} />
              <Line type="monotone" dataKey="score" stroke="#F4C978" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-lg text-moon-300 mb-4">Sleep duration (hrs)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#212a5c" />
              <XAxis dataKey="date" stroke="#8B8FCF" fontSize={12} />
              <YAxis stroke="#8B8FCF" fontSize={12} />
              <Tooltip contentStyle={{ background: "#101538", border: "none", borderRadius: 8 }} />
              <Bar dataKey="duration" fill="#6DE1C6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h3 className="font-display text-lg text-moon-300 mb-4">Stress vs sleep score</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#212a5c" />
              <XAxis dataKey="date" stroke="#8B8FCF" fontSize={12} />
              <YAxis stroke="#8B8FCF" fontSize={12} />
              <Tooltip contentStyle={{ background: "#101538", border: "none", borderRadius: 8 }} />
              <Line type="monotone" dataKey="score" stroke="#F4C978" strokeWidth={2} name="Sleep score" />
              <Line type="monotone" dataKey="stress" stroke="#ABA9E8" strokeWidth={2} name="Stress level" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <a href="/api/report/pdf" className="btn-secondary text-sm" target="_blank" rel="noreferrer">
          Download AI health report (PDF)
        </a>
      </div>
    </div>
  );
}
