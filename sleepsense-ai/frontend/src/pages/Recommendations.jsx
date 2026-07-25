import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function Recommendations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    api
      .get("/sleep/entries?limit=1")
      .then(async (res) => {
        if (res.data.length === 0) {
          setEmpty(true);
          return;
        }
        const entryId = res.data[0].id;
        const recRes = await api.get(`/sleep/entries/${entryId}/recommendations`);
        setData(recRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-dusk-400">Loading...</div>;

  if (empty) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center card p-10">
        <h2 className="font-display text-2xl text-dusk-100 mb-3">Nothing to recommend yet</h2>
        <p className="text-dusk-400 mb-6">Log a sleep entry first to get personalized recommendations.</p>
        <Link to="/log" className="btn-primary">
          Log sleep now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-dusk-100 mb-8">Personalized recommendations</h1>

      <div className="card p-6 mb-8">
        <h3 className="font-display text-lg text-moon-300 mb-4">Lifestyle tips</h3>
        <ul className="space-y-2">
          {data.lifestyle_tips.map((tip) => (
            <li key={tip} className="text-dusk-300 text-sm flex gap-2">
              <span className="text-aurora-500">✓</span> {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display text-lg text-aurora-500 mb-4">Foods that help</h3>
          {Object.entries(data.foods_to_eat).map(([group, items]) => (
            <div key={group} className="mb-4">
              <p className="text-xs uppercase tracking-wide text-dusk-400 mb-1">{group}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="text-xs bg-aurora-500/10 text-aurora-500 px-2 py-1 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6">
          <h3 className="font-display text-lg text-red-300 mb-4">Foods to avoid</h3>
          {Object.entries(data.foods_to_avoid).map(([group, items]) => (
            <div key={group} className="mb-4">
              <p className="text-xs uppercase tracking-wide text-dusk-400 mb-1">{group}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="text-xs bg-red-400/10 text-red-300 px-2 py-1 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
