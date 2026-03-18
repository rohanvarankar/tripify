import React, { useCallback, useEffect, useState } from "react";
import { FaCalendar, FaStar, FaSearch, FaShieldAlt, FaHeadset, FaThumbsUp } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import { FiArrowRight } from "react-icons/fi";
import PackageCard from "./PackageCard";
import { useNavigate } from "react-router";

// Stats displayed in the strip
const stats = [
  { value: "500+",  label: "Destinations" },
  { value: "12K+",  label: "Happy Travelers" },
  { value: "4.9★",  label: "Avg Rating" },
  { value: "50+",   label: "Countries" },
];

// Why Choose Us cards
const features = [
  {
    icon: <FaShieldAlt size={24} />,
    color: "from-indigo-500 to-blue-500",
    bg:    "bg-indigo-50",
    title: "Safe & Trusted",
    desc:  "Every package is vetted and insured. Travel worry-free with full support from our team.",
  },
  {
    icon: <FaThumbsUp size={24} />,
    color: "from-violet-500 to-purple-500",
    bg:    "bg-violet-50",
    title: "Best-Price Guarantee",
    desc:  "We match or beat any competitor's price. Get the most value out of every adventure.",
  },
  {
    icon: <FaHeadset size={24} />,
    color: "from-pink-500 to-rose-500",
    bg:    "bg-pink-50",
    title: "24/7 Expert Support",
    desc:  "Our travel specialists are always available to help you plan or resolve any issue.",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    location: "New York, USA",
    rating: 5,
    text: "Tripify made our honeymoon absolutely magical. Seamless booking, flawless experience!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    name: "James K.",
    location: "London, UK",
    rating: 5,
    text: "I've used many travel apps. Tripify is on another level — the curated packages exceeded all expectations.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
  {
    name: "Priya R.",
    location: "Mumbai, India",
    rating: 5,
    text: "The Bali package was breathtaking. Every detail was arranged perfectly. Highly recommend Tripify!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [topPackages, setTopPackages] = useState([]);
  const [latestPackages, setLatestPackages] = useState([]);
  const [offerPackages, setOfferPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentHeroImg, setCurrentHeroImg] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop", // Mountains
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop", // Paris / City
    "https://images.unsplash.com/photo-1512453979436-5a50f3c92286?q=80&w=2053&auto=format&fit=crop", // Dubai
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop", // Bali / Tropical
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImg((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const getTopPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/package/get-packages?sort=packageRating&limit=4");
      const data = await res.json();
      if (data?.success) setTopPackages(data?.packages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getLatestPackages = useCallback(async () => {
    try {
      const res = await fetch("/api/package/get-packages?sort=createdAt&limit=4");
      const data = await res.json();
      if (data?.success) setLatestPackages(data?.packages);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getOfferPackages = useCallback(async () => {
    try {
      const res = await fetch("/api/package/get-packages?sort=createdAt&offer=true&limit=4");
      const data = await res.json();
      if (data?.success) setOfferPackages(data?.packages);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getTopPackages();
    getLatestPackages();
    getOfferPackages();
  }, [getTopPackages, getLatestPackages, getOfferPackages]);

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans overflow-x-hidden">

      {/* ───────────── HERO ───────────── */}
      <div className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">

        {/* Background image slider */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          {heroImages.map((img, i) => (
            <img
              key={img}
              src={img}
              alt="Travel destination"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
                i === currentHeroImg ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          ))}
          {/* Multi-layer overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-900/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/20 via-transparent to-violet-900/30" />
        </div>

        {/* Hero content */}
        <div className="relative z-30 px-4 flex flex-col items-center w-full max-w-4xl mx-auto pt-24 pb-24 md:pb-32">
          {/* Badge */}
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 text-sm font-medium mb-6 shadow-glass"
            data-aos="fade-down"
          >
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            ✈️ Explore the World with Tripify
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl leading-[1.1] tracking-tight"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Your Next{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ background: "linear-gradient(90deg, #a5b4fc, #c4b5fd, #f9a8d4)", WebkitBackgroundClip: "text" }}
            >
              Great Adventure
            </span>
            <br />Starts Here
          </h1>

          <p
            className="text-lg md:text-xl text-slate-200 max-w-2xl mb-10 leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Handpicked tours, exclusive deals, and unforgettable memories. Let Tripify take you to the places your soul has been dreaming of.
          </p>

          {/* Search bar */}
          <div
            className="w-full max-w-2xl flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-glass"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="pl-4 text-white/60">
              <FaSearch size={18} />
            </div>
            <input
              type="text"
              className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder:text-white/50 text-base"
              placeholder="Where do you want to go?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/search?searchTerm=${search}`)}
            />
            <button
              onClick={() => navigate(`/search?searchTerm=${search}`)}
              className="bg-brand-gradient text-white px-7 py-3 rounded-xl font-semibold hover:shadow-brand hover:-translate-y-0.5 transition-all shadow-lg flex items-center gap-2"
            >
              Search <FiArrowRight />
            </button>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-6" data-aos="fade-up" data-aos-delay="400">
            {["🏖️ Beach", "🏔️ Mountains", "🏙️ City Break", "🌴 Tropical", "🎡 Adventure"].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/search?searchTerm=${tag.split(" ")[1]}`)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full border border-white/20 backdrop-blur-sm transition-all hover:-translate-y-0.5"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 w-[150%] md:w-full z-20 leading-[0] -ml-[25%] md:ml-0">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="block w-full h-[50px] md:h-[100px]">
            <path
              d="M0,40 C150,80 350,0 600,50 C850,100 1050,20 1200,60 L1200,100 L0,100 Z"
              className="fill-slate-50"
            />
          </svg>
        </div>
      </div>

      {/* ───────────── STATS STRIP ───────────── */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 md:-mt-8 relative z-30 mb-8 md:mb-16">
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-100 overflow-hidden"
          data-aos="fade-up"
        >
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center py-5 md:py-8 px-2 md:px-4 text-center ${
                i % 2 === 0 ? "border-r border-slate-100 md:border-r-0" : ""
              } ${i < stats.length - 1 && i !== 1 ? "md:border-r border-slate-100" : ""} ${i >= 2 ? "border-t md:border-t-0 border-slate-100" : ""}`}
            >
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-600 mb-1">{value}</span>
              <span className="text-[10px] sm:text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────── FILTER BUTTONS ───────────── */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex flex-wrap justify-center gap-4 py-5 bg-white rounded-3xl shadow-card border border-slate-100 px-4" data-aos="fade-up">
          {[
            { icon: <LuBadgePercent size={20}/>, bg: "bg-orange-100", color: "text-orange-600", hoverBg: "group-hover:bg-orange-500", label: "Special Offers", to: "/search?offer=true" },
            { icon: <FaStar size={20}/>, bg: "bg-yellow-100", color: "text-yellow-600", hoverBg: "group-hover:bg-yellow-500", label: "Top Rated", to: "/search?sort=packageRating" },
            { icon: <FaCalendar size={20}/>, bg: "bg-blue-100", color: "text-blue-600", hoverBg: "group-hover:bg-blue-500", label: "Latest", to: "/search?sort=createdAt" },
            { icon: <FaRankingStar size={20}/>, bg: "bg-purple-100", color: "text-purple-600", hoverBg: "group-hover:bg-purple-500", label: "Popular", to: "/search?sort=packageTotalRatings" },
          ].map(({ icon, bg, color, hoverBg, label, to }, i, arr) => (
            <React.Fragment key={to}>
              <button onClick={() => navigate(to)} className="filter-btn group">
                <span className={`p-2 ${bg} ${color} rounded-full ${hoverBg} group-hover:text-white transition-colors duration-300`}>
                  {icon}
                </span>
                <span className="font-semibold text-slate-700 group-hover:text-brand transition-colors">{label}</span>
              </button>
              {i < arr.length - 1 && <div className="w-px h-10 bg-slate-100 hidden md:block self-center" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ───────────── PACKAGE SECTIONS ───────────── */}
      <div className="px-4 md:px-8 flex flex-col gap-20 max-w-7xl mx-auto pb-24">

        {loading && (
          <div className="flex justify-center items-center h-60">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-brand/20 border-t-brand animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-violet/20 border-b-violet animate-spin" style={{animationDirection:"reverse"}} />
              </div>
            </div>
          </div>
        )}

        {/* Top Rated */}
        {!loading && topPackages.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-8" data-aos="fade-up">
              <div>
                <p className="section-subtitle">★ Best of the Best</p>
                <h2 className="section-title">Top Rated Packages</h2>
              </div>
              <button
                className="hidden sm:flex items-center gap-2 text-brand font-semibold hover:text-brand-dark transition-colors group"
                onClick={() => navigate("/search?sort=packageRating")}
              >
                View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topPackages.map((pkg, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 80}>
                  <PackageCard packageData={pkg} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Latest */}
        {!loading && latestPackages.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-8" data-aos="fade-up">
              <div>
                <p className="section-subtitle">🆕 Just Added</p>
                <h2 className="section-title">Fresh Adventures</h2>
              </div>
              <button
                className="hidden sm:flex items-center gap-2 text-brand font-semibold hover:text-brand-dark transition-colors group"
                onClick={() => navigate("/search?sort=createdAt")}
              >
                View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestPackages.map((pkg, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 80}>
                  <PackageCard packageData={pkg} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Offers */}
        {!loading && offerPackages.length > 0 && (
          <section
            className="rounded-3xl p-6 md:p-10 -mx-4 md:mx-0"
            style={{ background: "linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%)" }}
          >
            <div className="flex justify-between items-end mb-8" data-aos="fade-up">
              <div>
                <p className="section-subtitle text-orange-600">🔥 Limited Time</p>
                <h2 className="section-title">Special Offers</h2>
              </div>
              <button
                className="hidden sm:flex items-center gap-2 text-brand font-semibold hover:text-brand-dark transition-colors group"
                onClick={() => navigate("/search?offer=true")}
              >
                View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {offerPackages.map((pkg, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 80}>
                  <PackageCard packageData={pkg} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ───────────── WHY CHOOSE US ───────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14" data-aos="fade-up">
            <p className="section-subtitle">💎 Our Promise</p>
            <h2 className="section-title">Why Travelers Love Tripify</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              We go the extra mile so your journey is smooth, memorable, and worth every penny.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon, color, bg, title, desc }, i) => (
              <div
                key={title}
                className="group card p-8 text-center hover:shadow-brand/20 cursor-default"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} mx-auto flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── TESTIMONIALS ───────────── */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14" data-aos="fade-up">
            <p className="section-subtitle">💬 Real Stories</p>
            <h2 className="section-title">What Our Travelers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, location, rating, text, avatar }, i) => (
              <div
                key={name}
                className="card p-7 relative"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                {/* Quote mark */}
                <span className="absolute top-5 right-6 text-5xl font-serif text-brand/10 leading-none select-none">"</span>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <FaStar key={j} size={14} className="text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200"
                  />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{name}</p>
                    <p className="text-xs text-slate-400">{location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── CTA BANNER ───────────── */}
      <section className="py-20 px-4 relative overflow-hidden" data-aos="fade-up">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #db2777 100%)" }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl pointer-events-none" />

          <p className="text-white/70 font-semibold uppercase tracking-widest text-sm mb-3">Ready to go?</p>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight">
            Start Your Journey<br />With Tripify Today
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
            Join thousands of happy explorers. Browse packages, compare deals, and book your dream trip in minutes.
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

export default Home;