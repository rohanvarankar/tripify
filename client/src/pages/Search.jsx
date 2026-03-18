import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PackageCard from "./PackageCard";
import { FaSearch, FaFilter, FaSlidersH } from "react-icons/fa";
import { FiX } from "react-icons/fi";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sideBarSearchData, setSideBarSearchData] = useState({
    searchTerm: "",
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState([]);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (searchTermFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      setSideBarSearchData({
        searchTerm: searchTermFromUrl || "",
        offer: offerFromUrl === "true",
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchAllPackages = async () => {
      setLoading(true);
      setShowMoreBtn(false);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/package/get-packages?${searchQuery}`);
        const data = await res.json();
        setAllPackages(data?.packages || []);
        setShowMoreBtn((data?.packages || []).length > 8);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchAllPackages();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSideBarSearchData({ ...sideBarSearchData, searchTerm: e.target.value });
    }
    if (e.target.id === "offer") {
      setSideBarSearchData({ ...sideBarSearchData, offer: e.target.checked });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0];
      const order = e.target.value.split("_")[1];
      setSideBarSearchData({ ...sideBarSearchData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarSearchData.searchTerm);
    urlParams.set("offer", sideBarSearchData.offer);
    urlParams.set("sort", sideBarSearchData.sort);
    urlParams.set("order", sideBarSearchData.order);
    navigate(`/search?${urlParams.toString()}`);
    setMobileFiltersOpen(false);
  };

  const onShowMoreClick = async () => {
    const startIndex = allPackages.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const res = await fetch(`/api/package/get-packages?${urlParams.toString()}`);
    const data = await res.json();
    if ((data?.packages || []).length < 9) setShowMoreBtn(false);
    setAllPackages([...allPackages, ...(data?.packages || [])]);
  };

  const FilterPanel = () => (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {/* Search */}
      <div className="flex flex-col gap-2">
        <label className="form-label uppercase tracking-wider text-xs">Destination / Name</label>
        <div className="relative">
          <input
            type="text"
            id="searchTerm"
            placeholder="e.g. Paris, Bali..."
            className="input-field pl-10"
            value={sideBarSearchData.searchTerm}
            onChange={handleChange}
          />
          <FaSearch className="absolute left-3.5 top-3.5 text-slate-400" size={13} />
          {sideBarSearchData.searchTerm && (
            <button
              type="button"
              onClick={() => setSideBarSearchData({ ...sideBarSearchData, searchTerm: "" })}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <FiX size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Offers toggle */}
      <div className="bg-gradient-to-r from-brand-50 to-violet-50 p-4 rounded-2xl border border-brand/10">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              id="offer"
              className="peer sr-only"
              checked={sideBarSearchData.offer}
              onChange={handleChange}
            />
            <div className="w-11 h-6 bg-slate-200 peer-checked:bg-brand-gradient rounded-full transition-colors duration-300 border border-slate-300 peer-checked:border-brand" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5" />
          </div>
          <span className="font-semibold text-slate-800 text-sm">
            Special Offers Only <span className="text-orange-500">🔥</span>
          </span>
        </label>
      </div>

      {/* Sort */}
      <div className="flex flex-col gap-2">
        <label className="form-label uppercase tracking-wider text-xs">Sort Results</label>
        <div className="relative">
          <select
            onChange={handleChange}
            id="sort_order"
            className="input-field appearance-none pr-10 cursor-pointer"
            defaultValue={"createdAt_desc"}
          >
            <option value="packagePrice_desc">Price: High to Low</option>
            <option value="packagePrice_asc">Price: Low to High</option>
            <option value="packageRating_desc">Highest Rated</option>
            <option value="packageTotalRatings_desc">Most Popular</option>
            <option value="createdAt_desc">Newest First</option>
            <option value="createdAt_asc">Oldest First</option>
          </select>
          <FaSlidersH className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" size={14} />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-brand-gradient text-white rounded-xl font-bold shadow-brand hover:shadow-lg hover:-translate-y-0.5 transition-all text-base mt-1"
      >
        Apply Filters
      </button>
    </form>
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans">

      {/* Page Hero Banner */}
      <div className="relative w-full pt-24 pb-16 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)" }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand/20 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-brand-300 font-semibold uppercase tracking-widest text-sm mb-2" data-aos="fade-down">Browse All Packages</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight" data-aos="fade-up">
            Explore the World 🌏
          </h1>
          <p className="text-slate-300 text-lg max-w-xl" data-aos="fade-up" data-aos-delay="100">
            Filter, sort and discover your perfect getaway from hundreds of curated packages.
          </p>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 w-full leading-[0]">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="block w-full h-[40px]">
            <path d="M0,30 C300,60 900,0 1200,30 L1200,60 L0,60 Z" className="fill-slate-50" />
          </svg>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-gradient text-white rounded-xl font-semibold shadow-brand w-full justify-center"
        >
          <FaFilter size={14} /> Show Filters
          {(sideBarSearchData.offer || sideBarSearchData.searchTerm) && (
            <span className="ml-auto bg-white/30 text-white text-xs px-2 py-0.5 rounded-full">Active</span>
          )}
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><FaFilter className="text-brand" /> Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 rounded-xl hover:bg-slate-100"><FiX size={20} /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8 items-start">

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-[300px] flex-shrink-0 sticky top-28">
          <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                <FaFilter size={13} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Filters</h2>
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 w-full flex flex-col min-h-[500px]">

          {/* Result count badge */}
          {!loading && allPackages.length > 0 && (
            <div className="mb-5 flex items-center gap-3" data-aos="fade-in">
              <span className="text-slate-500 text-sm">
                Showing <span className="font-bold text-slate-800">{allPackages.length}</span> packages
              </span>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex justify-center items-center min-h-[300px]">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-brand/20 border-t-brand animate-spin" />
              </div>
            </div>
          )}

          {!loading && allPackages.length === 0 && (
            <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center" data-aos="fade-up">
              <div className="text-6xl mb-5">🏜️</div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">No Packages Found</h3>
              <p className="text-slate-500 max-w-xs">Try adjusting your filters or search term to discover new adventures.</p>
            </div>
          )}

          {!loading && allPackages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {allPackages.map((packageData, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={Math.min(i * 60, 300)}>
                  <PackageCard packageData={packageData} />
                </div>
              ))}
            </div>
          )}

          {showMoreBtn && !loading && (
            <div className="flex justify-center mt-12 pb-8">
              <button
                onClick={onShowMoreClick}
                className="px-10 py-3.5 bg-white border-2 border-brand text-brand font-bold rounded-2xl hover:bg-brand hover:text-white transition-all shadow-md hover:shadow-brand/30 hover:-translate-y-0.5 flex items-center gap-2"
              >
                Load More Results <span className="text-lg">↓</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;