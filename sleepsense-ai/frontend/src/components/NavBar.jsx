import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/log", label: "Log Sleep" },
  { to: "/recommendations", label: "Recommendations" },
  { to: "/coach", label: "AI Coach" },
];

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-white/5 sticky top-0 z-20 bg-midnight-950/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-moon-400 text-xl">🌙</span>
          <span className="font-display text-lg text-dusk-100 tracking-wide">SleepSense AI</span>
        </Link>
        {user && (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-moon-300 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-dusk-400 hidden sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-secondary text-xs py-1.5 px-3">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
