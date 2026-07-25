import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    occupation: "",
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register({
        ...form,
        age: form.age ? Number(form.age) : null,
        height_cm: form.height_cm ? Number(form.height_cm) : null,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <div className="card p-8">
        <h1 className="font-display text-2xl text-dusk-100 mb-1">Create your profile</h1>
        <p className="text-dusk-400 text-sm mb-6">Module 1 - a few details to personalize your predictions.</p>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label-text">Full name</label>
            <input required className="input-field" value={form.name} onChange={update("name")} />
          </div>
          <div className="col-span-2">
            <label className="label-text">Email</label>
            <input type="email" required className="input-field" value={form.email} onChange={update("email")} />
          </div>
          <div className="col-span-2">
            <label className="label-text">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={form.password}
              onChange={update("password")}
            />
          </div>
          <div>
            <label className="label-text">Age</label>
            <input type="number" className="input-field" value={form.age} onChange={update("age")} />
          </div>
          <div>
            <label className="label-text">Gender</label>
            <select className="input-field" value={form.gender} onChange={update("gender")}>
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label-text">Height (cm)</label>
            <input type="number" className="input-field" value={form.height_cm} onChange={update("height_cm")} />
          </div>
          <div>
            <label className="label-text">Weight (kg)</label>
            <input type="number" className="input-field" value={form.weight_kg} onChange={update("weight_kg")} />
          </div>
          <div className="col-span-2">
            <label className="label-text">Occupation</label>
            <input className="input-field" value={form.occupation} onChange={update("occupation")} />
          </div>
          {error && <p className="text-red-400 text-sm col-span-2">{error}</p>}
          <button type="submit" className="btn-primary col-span-2 mt-2">
            Create account
          </button>
        </form>
        <p className="text-sm text-dusk-400 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-moon-300 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
