import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaShieldAlt, FaLeaf, FaStar, FaHeadset, FaGlobe } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

const values = [
  {
    icon: <FaGlobe size={22} />,
    color: "from-brand to-violet",
    title: "Global Reach",
    desc: "We partner with top travel operators in 50+ countries to bring you handpicked, verified experiences.",
  },
  {
    icon: <FaShieldAlt size={22} />,
    color: "from-blue-500 to-cyan-400",
    title: "Safe & Insured",
    desc: "All bookings are fully insured and backed by our 24/7 support team for peace of mind.",
  },
  {
    icon: <FaLeaf size={22} />,
    color: "from-emerald-500 to-teal-400",
    title: "Eco-Conscious",
    desc: "We promote responsible tourism with packages that respect and preserve the natural environment.",
  },
  {
    icon: <FaStar size={22} />,
    color: "from-amber-500 to-orange-400",
    title: "Premium Quality",
    desc: "Only the best-rated tours make it onto Tripify — because you deserve extraordinary every time.",
  },
  {
    icon: <FaHeadset size={22} />,
    color: "from-rose-500 to-pink-400",
    title: "Expert Guides",
    desc: "Local experts and seasoned professionals guide every tour, giving you authentic insider experiences.",
  },
  {
    icon: <FaPlane size={22} />,
    color: "from-purple-500 to-indigo-400",
    title: "Seamless Booking",
    desc: "From browsing to boarding — our platform makes planning and booking your trip effortlessly simple.",
  },
];

const team = [
  { name: "Aria Chen",     role: "Founder & CEO",       seed: "Aria" },
  { name: "Marcus Lee",    role: "Head of Travel Ops",   seed: "Marcus" },
  { name: "Sofia Patel",   role: "Lead Experience Designer", seed: "Sofia" },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans">

      {/* ─── HERO BANNER ─── */}
      <div
        className="relative w-full pt-32 pb-24 px-4 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
          alt="Travel world"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6" data-aos="fade-down">
            <span className="w-2 h-2 rounded-full bg-brand-300 animate-pulse" />
            About Tripify
          </div>
          <h1
            className="text-4xl md:text-6xl font-extrabold leading-tight mb-5"
            data-aos="fade-up"
          >
            We're Passionate<br />About Travel ✈️
          </h1>
          <p
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Tripify was born from a simple belief: everyone deserves to experience the world's wonders without the stress. We make extraordinary journeys accessible, memorable, and safe.
          </p>
        </div>

        {/* Wave at bottom */}
        <div className="absolute bottom-0 left-0 w-full leading-[0]">
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="block w-full h-[50px]">
            <path d="M0,40 C200,80 400,0 600,40 C800,80 1000,20 1200,50 L1200,80 L0,80 Z" className="fill-slate-50" />
          </svg>
        </div>
      </div>

      {/* ─── MISSION + VISION ─── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              emoji: "🎯",
              title: "Our Mission",
              color: "from-brand-50 to-violet-50 border-brand/10",
              iconColor: "text-brand",
              text: "To democratize travel by offering expertly curated packages that make extraordinary experiences accessible to everyone — safely, sustainably, and affordably.",
            },
            {
              emoji: "🌍",
              title: "Our Vision",
              color: "from-emerald-50 to-teal-50 border-emerald-100",
              iconColor: "text-emerald-600",
              text: "A world where every person can explore freely, connect with different cultures, and return home with stories that enrich their lives and inspire others.",
            },
          ].map(({ emoji, title, color, text }, i) => (
            <div
              key={title}
              className={`bg-gradient-to-br ${color} border rounded-3xl p-8`}
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="text-4xl mb-4">{emoji}</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">{title}</h2>
              <p className="text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── OUR VALUES ─── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14" data-aos="fade-up">
            <p className="section-subtitle">💎 What We Stand For</p>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon, color, title, desc }, i) => (
              <div
                key={title}
                className="group card p-7 hover:shadow-xl cursor-default"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {icon}
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14" data-aos="fade-up">
            <p className="section-subtitle">👥 The People Behind Tripify</p>
            <h2 className="section-title">Meet Our Team</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map(({ name, role, seed }, i) => (
              <div
                key={name}
                className="card p-8 text-center w-60 group cursor-default"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                  alt={name}
                  className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-slate-100 group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="font-bold text-slate-800 text-base">{name}</h3>
                <p className="text-brand text-sm font-medium mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-4" data-aos="fade-up">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #db2777 100%)" }}
        >
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl" />

          <p className="text-white/70 font-semibold uppercase tracking-widest text-sm mb-3">Ready to explore?</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5">
            Your Dream Trip is<br />One Click Away
          </h2>
          <p className="text-white/80 max-w-md mx-auto mb-8">
            Browse hundreds of curated packages, compare prices, and book your perfect adventure with Tripify today.
          </p>
          <button
            onClick={() => navigate("/search")}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-brand font-bold rounded-2xl text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Explore Packages <FiArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;