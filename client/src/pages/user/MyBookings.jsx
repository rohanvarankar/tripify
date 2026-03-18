import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiSearch, FiCalendar, FiUser, FiMail, FiXCircle } from "react-icons/fi";

const MyBookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllBookings = async () => {
    setCurrentBookings([]);
    try {
      setLoading(true);
      const res = await fetch(`/api/booking/get-UserCurrentBookings/${currentUser?._id}?searchTerm=${searchTerm}`);
      const data = await res.json();
      if (data?.success) {
        setCurrentBookings(data?.bookings);
        setError(false);
      } else setError(data?.message);
    } catch (error) { console.log(error); } finally { setLoading(false); }
  };

  useEffect(() => { if (currentUser?._id) getAllBookings(); }, [searchTerm, currentUser]);

  const handleCancel = async (id) => {
    if(!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/booking/cancel-booking/${id}/${currentUser._id}`, { method: "POST" });
      const data = await res.json();
      alert(data?.message);
      if (data?.success) getAllBookings();
    } catch (error) { console.log(error); } finally { setLoading(false); }
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Active Bookings</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage your upcoming adventures</p>
        </div>
        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            type="text"
            placeholder="Search by destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div></div>}
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center font-semibold mb-6 border border-red-100">{error}</div>}

      {!loading && currentBookings.length === 0 && (
        <div className="text-center py-20 px-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiSearch className="text-slate-400 text-2xl" /></div>
          <p className="text-lg font-bold text-slate-700">No active bookings found.</p>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">Looks like you don't have any upcoming trips. Start exploring our packages today!</p>
          <Link to="/" className="inline-block mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">Explore Packages</Link>
        </div>
      )}

      {/* Booking List */}
      <div className="space-y-4">
        {!loading && currentBookings.map((booking, i) => (
          <div key={i} className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg hover:border-indigo-100 transition-all group">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full xl:w-auto">
              <Link to={`/package/${booking?.packageDetails?._id}`} className="shrink-0 relative overflow-hidden rounded-xl shadow-sm border border-slate-100">
                <img src={booking?.packageDetails?.packageImages?.[0] || "https://placehold.co/600x400/png?text=Not+Found"} alt="Package" className="w-full sm:w-32 h-44 sm:h-28 object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
              <div className="flex flex-col gap-1.5 w-full">
                <Link to={`/package/${booking?.packageDetails?._id}`} className="font-extrabold text-lg text-slate-800 hover:text-indigo-600 transition-colors capitalize line-clamp-1">
                  {booking?.packageDetails?.packageName || "Unknown Package"}
                </Link>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><FiCalendar className="text-indigo-500"/> {booking?.date}</span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><FiUser className="text-indigo-500"/> {booking?.buyer?.username}</span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><FiMail className="text-indigo-500"/> {booking?.buyer?.email}</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-md w-max">Confirmed</div>
              </div>
            </div>
            
            <button onClick={() => handleCancel(booking._id)} className="w-full xl:w-auto shrink-0 px-6 py-3 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-500 hover:text-white hover:border-rose-500 font-bold transition-all shadow-sm flex justify-center items-center gap-2">
              <FiXCircle size={18} /> Cancel Trip
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyBookings;