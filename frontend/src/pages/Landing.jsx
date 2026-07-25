import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 text-center">
      <p className="text-moon-400 tracking-[0.3em] text-xs uppercase mb-6">Sleep Quality, Decoded</p>
      <h1 className="font-display text-5xl md:text-6xl text-dusk-100 leading-tight mb-6">
        Understand the night <br className="hidden md:block" /> that shapes your day
      </h1>
      <p className="text-dusk-400 max-w-2xl mx-auto mb-10 text-lg">
        SleepSense AI turns your lifestyle, environment, and habits into a clear sleep quality
        score, with personalized food and wellness recommendations to help you rest better.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link to="/register" className="btn-primary">
          Get started
        </Link>
        <Link to="/login" className="btn-secondary">
          Sign in
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-24 text-left">
        {[
          { title: "Predict", desc: "A daily sleep quality score from 10 modules of lifestyle and health data." },
          { title: "Understand", desc: "See exactly which habits are helping or hurting your sleep." },
          { title: "Improve", desc: "Get food and lifestyle recommendations tailored to your data." },
        ].map((f) => (
          <div key={f.title} className="card p-6">
            <h3 className="font-display text-xl text-moon-300 mb-2">{f.title}</h3>
            <p className="text-dusk-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
