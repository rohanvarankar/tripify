import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiMenu, FiX } from "react-icons/fi";
import { FaPlane } from "react-icons/fa";
import defaultProfileImg from "../../assets/images/profile.png";

const navLinks = [
  { label: "Home",     to: "/" },
  { label: "Packages", to: "/search" },
  { label: "About",    to: "/about" },
];

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-400 ${
          scrolled
            ? "bg-white/90 backdrop-blur-lg shadow-lg shadow-slate-200/50 py-3"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Tripify Home">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand group-hover:scale-110 transition-transform duration-300">
              <FaPlane className="text-white text-lg -rotate-45" />
            </div>
            <span
              className={`text-xl font-extrabold tracking-tight transition-colors duration-300 ${
                scrolled ? "text-brand" : "text-white drop-shadow-md"
              }`}
              style={{
                background: scrolled
                  ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                  : undefined,
                WebkitBackgroundClip: scrolled ? "text" : undefined,
                WebkitTextFillColor: scrolled ? "transparent" : undefined,
              }}
            >
              Tripify
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className={`flex items-center gap-8 font-medium text-sm ${scrolled ? "text-slate-600" : "text-white/90"}`}>
              {navLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`nav-link ${isActive(to) ? "active !text-brand" : ""} ${
                      scrolled ? "hover:text-brand" : "hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth */}
            {currentUser ? (
              <Link
                to={`/profile/${currentUser.user_role === 1 ? "admin" : "user"}`}
                className="flex items-center gap-2 group"
              >
                <img
                  src={currentUser.avatar || defaultProfileImg}
                  alt={currentUser.username}
                  className="w-9 h-9 rounded-full object-cover border-2 border-brand/40 hover:border-brand hover:scale-110 transition-all shadow-md"
                />
              </Link>
            ) : (
              <Link
                to="/login"
                className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  scrolled
                    ? "bg-brand-gradient text-white shadow-brand hover:shadow-lg hover:-translate-y-0.5"
                    : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
                }`}
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/20"
            }`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <span className="font-extrabold text-xl text-brand">Tripify</span>
            <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
              <FiX size={22} className="text-slate-600" />
            </button>
          </div>

          {/* Drawer links */}
          <nav className="flex-1 overflow-y-auto p-5 flex flex-col gap-1">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                  isActive(to)
                    ? "bg-brand/10 text-brand"
                    : "text-slate-700 hover:bg-slate-50 hover:text-brand"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Drawer footer (auth) */}
          <div className="p-5 border-t border-slate-100">
            {currentUser ? (
              <Link
                to={`/profile/${currentUser.user_role === 1 ? "admin" : "user"}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <img
                  src={currentUser.avatar || defaultProfileImg}
                  alt={currentUser.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-brand/30"
                />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{currentUser.username}</p>
                  <p className="text-xs text-slate-400">View Profile</p>
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center py-3 bg-brand-gradient text-white rounded-xl font-semibold shadow-brand hover:shadow-lg transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;