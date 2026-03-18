import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginStart, loginSuccess, loginFailure } from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { FaPlane } from "react-icons/fa";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.success) {
        dispatch(loginSuccess(data?.user));
        navigate("/");
      } else {
        dispatch(loginFailure(data?.message));
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex font-sans">

      {/* Left panel – brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end p-12"
        style={{ background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #4f46e5 80%, #7c3aed 100%)" }}>

        {/* Background texture */}
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1931&auto=format&fit=crop"
          alt="Travel scene"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        {/* Blobs */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-violet-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-brand/40 rounded-full blur-3xl" />

        <div className="relative z-10 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <FaPlane className="text-white text-xl -rotate-45" />
            </div>
            <span className="text-2xl font-extrabold">Tripify</span>
          </div>

          {/* Floating card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-6 max-w-xs">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">Today's Highlight</p>
            <p className="text-white font-semibold text-lg leading-snug">Santorini, Greece</p>
            <p className="text-white/60 text-sm mt-1">7 Days • From $1,299</p>
            <div className="flex -space-x-2 mt-4">
              {["Alex", "Nia", "Sam"].map((name) => (
                <img
                  key={name}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                  alt={name}
                  className="w-8 h-8 rounded-full border-2 border-white/30 bg-white/20"
                />
              ))}
              <div className="w-8 h-8 rounded-full bg-brand/70 border-2 border-white/30 flex items-center justify-center text-white text-[10px] font-bold">
                +99
              </div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
            The World is<br />Waiting for You
          </h2>
          <p className="text-white/60 text-base">
            Sign in to access exclusive deals, manage bookings, and continue your journey.
          </p>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-6 py-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center">
              <FaPlane className="text-white -rotate-45" />
            </div>
            <span className="text-xl font-extrabold text-brand">Tripify</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-800 mb-1">Welcome back! 👋</h1>
          <p className="text-slate-500 mb-8 text-sm">Sign in to your Tripify account to continue exploring.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-400">
                  <FiMail size={16} />
                </span>
                <input
                  type="email"
                  id="email"
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-400">
                  <FiLock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-gradient text-white rounded-xl font-bold text-base shadow-brand hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing In...
                </span>
              ) : "Sign In"}
            </button>

            {/* Signup link */}
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-brand font-semibold hover:text-brand-dark transition-colors">
                Create one free →
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;