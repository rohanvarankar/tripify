import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiStar } from "react-icons/fi";

const RatingsReviews = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const getPackages = async () => {
    setPackages([]);
    try {
      setLoading(true);
      const url = filter === "most"
        ? `/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings`
        : `/api/package/get-packages?searchTerm=${search}&sort=packageRating`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.success) {
        setPackages(data?.packages);
        setShowMoreBtn(data?.packages?.length > 8);
      } else {
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) { console.log(error); } finally { setLoading(false); }
  };

  useEffect(() => { getPackages(); }, [filter, search]);

  const onShowMoreClick = async () => {
    const startIndex = packages.length;
    const url = filter === "most"
      ? `/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings&startIndex=${startIndex}`
      : `/api/package/get-packages?searchTerm=${search}&sort=packageRating&startIndex=${startIndex}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data?.packages?.length < 9) setShowMoreBtn(false);
    setPackages([...packages, ...(data?.packages || [])]);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Reviews", value: packages.reduce((sum, p) => sum + (p.packageTotalRatings || 0), 0), icon: <FiStar size={24} className="fill-white" />, color: "from-fuchsia-500 to-pink-500", shadow: "shadow-pink-500/20" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:scale-150 transition-transform duration-500 ease-out`} />
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadow} mb-4`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-sm font-semibold">{stat.label}</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-full sm:w-fit">
          <button onClick={() => setFilter("all")} className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-bold transition-all ${filter === "all" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}>
            Top Rated
          </button>
          <button onClick={() => setFilter("most")} className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-bold transition-all ${filter === "most" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}>
            Most Reviewed
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="relative max-w-sm">
            <FiSearch className="absolute left-3 top-3 text-slate-400" size={15} />
            <input type="text" className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Search by package name..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
          </div>
        )}

        {!loading && packages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FiStar size={40} className="mb-3 opacity-30" />
            <p className="font-semibold">No packages found</p>
          </div>
        )}

        {!loading && packages.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Package</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Rating Score</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Total Reviews</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {packages.map((pack, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <Link to={`/package/ratings/${pack._id}`} className="flex items-center gap-3 group">
                        <img src={pack?.packageImages[0]} alt="pkg" className="w-12 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0" />
                        <span className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-1 max-w-[250px]">{pack?.packageName}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Rating value={pack?.packageRating} precision={0.1} readOnly size="small" />
                        <span className="font-bold text-slate-700">{pack?.packageRating?.toFixed(1) || "0.0"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200">
                        {pack?.packageTotalRatings || 0}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right border-l-0">
                      <Link to={`/package/ratings/${pack._id}`}>
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100">
                           View Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {showMoreBtn && !loading && (
          <div className="px-5 py-4 border-t border-slate-100 text-center">
            <button onClick={onShowMoreClick} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingsReviews;
