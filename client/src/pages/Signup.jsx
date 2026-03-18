import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiPhone, FiMapPin } from "react-icons/fi";
import { FaPlane } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "", address: "", phone: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`/api/auth/signup`, formData);
      if (res?.data?.success) {
        alert(res?.data?.message);
        navigate("/login");
      } else {
        alert(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ id, label, type = "text", placeholder, icon: Icon, required = false, children }) => (
    <div>
      <label htmlFor={id} className="form-label">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-3.5 text-slate-400">
          <Icon size={16} />
        </span>
        {children || (
          <input
            type={type}
            id={id}
            className="input-field pl-10"
            placeholder={placeholder}
            onChange={handleChange}
            required={required}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex font-sans">

      {/* Left panel – brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end p-12"
        style={{ background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #7c3aed 80%, #db2777 100%)" }}>

        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
          alt="Beach destination"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-25"
        />
        <div className="absolute top-24 right-8 w-56 h-56 bg-pink-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-brand/40 rounded-full blur-3xl" />

        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <FaPlane className="text-white text-xl -rotate-45" />
            </div>
            <span className="text-2xl font-extrabold">Tripify</span>
          </div>

          {/* Perks list */}
          <div className="space-y-3 mb-8">
            {[
              "✈️  Access 500+ exclusive destinations",
              "💰  Best-price guaranteed packages",
              "⭐  Personalised recommendations",
              "🛡️  Fully insured & trusted bookings",
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-3 text-white/90 text-sm font-medium bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                {perk}
              </div>
            ))}
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
            Join 12,000+<br />Happy Explorers
          </h2>
          <p className="text-white/60 text-base">
            Create your Tripify account and start planning your next unforgettable adventure today.
          </p>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center">
              <FaPlane className="text-white -rotate-45" />
            </div>
            <span className="text-xl font-extrabold text-brand">Tripify</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-800 mb-1">Create your account 🚀</h1>
          <p className="text-slate-500 mb-8 text-sm">Start your adventure — it only takes a minute.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Row 1: username + email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField id="username" label="Username" icon={FiUser} placeholder="johndoe" required />
              <InputField id="email" label="Email" type="email" icon={FiMail} placeholder="you@example.com" required />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-400"><FiLock size={16} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input-field pl-10 pr-10"
                  placeholder="Min. 6 characters"
                  onChange={handleChange}
                  required
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Phone */}
            <InputField id="phone" label="Phone (Optional)" icon={FiPhone} placeholder="+1 234 567 890" />

            {/* Address */}
            <div>
              <label htmlFor="address" className="form-label">Address (Optional)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-400"><FiMapPin size={16} /></span>
                <textarea
                  id="address"
                  maxLength={200}
                  className="input-field pl-10 resize-none"
                  placeholder="Your home address..."
                  onChange={handleChange}
                  rows={2}
                />
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-slate-400">
              By signing up you agree to our{" "}
              <span className="text-brand font-semibold cursor-pointer">Terms of Service</span> and{" "}
              <span className="text-brand font-semibold cursor-pointer">Privacy Policy</span>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-gradient text-white rounded-xl font-bold text-base shadow-brand hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating Account...
                </span>
              ) : "Create Account →"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-brand font-semibold hover:text-brand-dark transition-colors">
                Sign in →
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;