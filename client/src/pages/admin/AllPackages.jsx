import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiEdit2, FiTrash2, FiPackage } from "react-icons/fi";
import { LuBadgePercent } from "react-icons/lu";
import { FaStar } from "react-icons/fa";

const FILTERS = [
  { id: "all",    label: "All" },
  { id: "offer",  label: "On Sale" },
  { id: "latest", label: "Latest" },
  { id: "top",    label: "Top Rated" },
];

const AllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const getPackages = async () => {
    setPackages([]);
    try {
      setLoading(true);
      const url =
        filter === "offer"  ? `/api/package/get-packages?searchTerm=${search}&offer=true` :
        filter === "latest" ? `/api/package/get-packages?searchTerm=${search}&sort=createdAt` :
        filter === "top"    ? `/api/package/get-packages?searchTerm=${search}&sort=packageRating` :
                              `/api/package/get-packages?searchTerm=${search}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.success) {
        setPackages(data?.packages);
        setShowMoreBtn(data?.packages?.length > 8);
      } else {
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onShowMore = async () => {
    const startIndex = packages.length;
    const url =
      filter === "offer"  ? `/api/package/get-packages?searchTerm=${search}&offer=true&startIndex=${startIndex}` :
      filter === "latest" ? `/api/package/get-packages?searchTerm=${search}&sort=createdAt&startIndex=${startIndex}` :
      filter === "top"    ? `/api/package/get-packages?searchTerm=${search}&sort=packageRating&startIndex=${startIndex}` :
                            `/api/package/get-packages?searchTerm=${search}&startIndex=${startIndex}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data?.packages?.length < 9) setShowMoreBtn(false);
    setPackages([...packages, ...data?.packages]);
  };

  const handleDelete = async (packageId) => {
    if (!confirm("Delete this package permanently?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/package/delete-package/${packageId}`, { method: "DELETE" });
      const data = await res.json();
      alert(data?.message);
      getPackages();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getPackages(); }, [filter, search]);

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Packages", value: packages.length, icon: <FiPackage size={24} />, color: "from-amber-400 to-orange-500", shadow: "shadow-orange-500/20" },
          { label: "Active Offers", value: packages.filter(p => p.offer).length, icon: <LuBadgePercent size={24} />, color: "from-rose-400 to-pink-500", shadow: "shadow-pink-500/20" },
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

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm w-full">
          <FiSearch className="absolute left-3 top-3 text-slate-400" size={15} />
          <input
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                filter === id
                  ? "text-white border-transparent shadow-md"
                  : "text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
              style={filter === id ? { background: "linear-gradient(90deg,#6366f1,#8b5cf6)" } : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
          </div>
        )}

        {!loading && packages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FiPackage size={40} className="mb-3 opacity-30" />
            <p className="font-semibold">No packages found</p>
          </div>
        )}

        {!loading && packages.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Package</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {packages.map((pack, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <Link to={`/package/${pack._id}`} className="flex items-center gap-3 group">
                        <img src={pack?.packageImages[0]} alt="pkg"
                          className="w-12 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0" />
                        <span className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-1 max-w-[200px]">
                          {pack?.packageName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-800">${pack.packageDiscountPrice || pack.packagePrice}</span>
                      {pack.offer && pack.packageDiscountPrice && (
                        <span className="ml-1 text-xs line-through text-slate-400">${pack.packagePrice}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <FaStar size={12} className="text-amber-400" />
                        <span className="font-medium text-slate-700">{pack.packageRating?.toFixed(1) || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {pack.offer ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100">
                          <LuBadgePercent size={12} /> Sale
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/profile/admin/update-package/${pack._id}`}>
                          <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100">
                            <FiEdit2 size={12} /> Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(pack?._id)}
                          disabled={loading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                        >
                          <FiTrash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showMoreBtn && !loading && (
          <div className="px-5 py-4 border-t border-slate-100">
            <button onClick={onShowMore}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              + Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPackages;
