import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Chart from "../components/Chart";
import { FiSearch, FiXCircle, FiPackage } from "react-icons/fi";
import { FaCalendarAlt } from "react-icons/fa";

const AllBookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllBookings = async () => {
    setCurrentBookings([]);
    try {
      setLoading(true);
      const res = await fetch(`/api/booking/get-currentBookings?searchTerm=${searchTerm}`);
      const data = await res.json();
      if (data?.success) {
        setCurrentBookings(data?.bookings);
        setError(false);
      } else {
        setError(data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getAllBookings(); }, [searchTerm]);

  const handleCancel = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/booking/cancel-booking/${id}/${currentUser._id}`, { method: "POST" });
      const data = await res.json();
      alert(data?.message);
      getAllBookings();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Active Bookings", value: currentBookings.length, icon: <FiPackage size={24}/>, color: "from-indigo-500 to-violet-500", shadow: "shadow-indigo-500/20" },
          { label: "Total Revenue", value: `$${currentBookings.reduce((s, b) => s + (b.totalPrice || 0), 0).toLocaleString()}`, icon: <FaCalendarAlt size={22}/>, color: "from-emerald-500 to-teal-400", shadow: "shadow-emerald-500/20" },
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

      {/* Chart */}
      {currentBookings.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Booking Overview</h3>
          <Chart data={currentBookings} />
        </div>
      )}

      {/* Search + Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="relative max-w-sm">
            <FiSearch className="absolute left-3 top-3 text-slate-400" size={15} />
            <input
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
          </div>
        )}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}

        {!loading && currentBookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FiPackage size={40} className="mb-3 opacity-30" />
            <p className="font-semibold">No bookings found</p>
          </div>
        )}

        {!loading && currentBookings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Package</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentBookings.map((booking, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <Link to={`/package/${booking?.packageDetails?._id}`} className="flex items-center gap-3 group">
                        <img
                          className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                          src={booking?.packageDetails?.packageImages[0]}
                          alt="pkg"
                        />
                        <span className="font-medium text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-1 max-w-[160px]">
                          {booking?.packageDetails?.packageName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-700">{booking?.buyer?.username}</p>
                      <p className="text-slate-400 text-xs">{booking?.buyer?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{booking?.date}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                      >
                        <FiXCircle size={13} /> Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBookings;
