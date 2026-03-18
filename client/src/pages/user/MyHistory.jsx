import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiSearch, FiCalendar, FiUser, FiXCircle, FiCheckCircle, FiArchive } from "react-icons/fi";

const MyHistory = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/booking/get-allUserBookings/${currentUser?._id}?searchTerm=${search}`);
      const data = await res.json();
      if (data?.success) {
        setAllBookings(data?.bookings);
        setError(false);
      } else setError(data?.message);
    } catch (error) { console.log(error); } finally { setLoading(false); }
  };

  useEffect(() => { if (currentUser?._id) getAllBookings(); }, [search, currentUser]);

  const handleHistoryDelete = async (id) => {
    if(!confirm("Permenently delete this history log?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/booking/delete-booking-history/${id}/${currentUser._id}`, { method: "DELETE" });
      const data = await res.json();
      alert(data?.message);
      if (data?.success) getAllBookings();
    } catch (error) { console.log(error); } finally { setLoading(false); }
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Booking History</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Review past trips and cancellations</p>
        </div>
        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div></div>}
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center font-semibold mb-6 border border-red-100">{error}</div>}

      {!loading && allBookings.length === 0 && (
        <div className="text-center py-20 px-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiArchive className="text-slate-400 text-2xl" /></div>
          <p className="text-lg font-bold text-slate-700">No logs found.</p>
          <p className="text-sm text-slate-500 mt-2">Your completed or cancelled bookings will automatically appear here over time.</p>
        </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        {!loading && allBookings.map((booking, i) => {
          const isPast = new Date(booking?.date).getTime() < new Date().getTime();
          const isCancelled = booking?.status === "Cancelled";

          return (
            <div key={i} className={`flex flex-col md:flex-row md:items-center justify-between gap-6 border rounded-2xl p-5 transition-shadow ${isCancelled ? 'bg-rose-50/30 border-rose-100/50 hover:shadow-sm' : 'bg-slate-50 hover:bg-slate-100 border-slate-100 hover:shadow-sm'}`}>
              <div className="flex items-start sm:items-center gap-4 flex-1">
                <Link to={`/package/${booking?.packageDetails?._id}`} className={`shrink-0 rounded-xl overflow-hidden shadow-sm border border-slate-200 ${isCancelled ? 'grayscale opacity-70' : ''}`}>
                  <img src={booking?.packageDetails?.packageImages?.[0] || "https://placehold.co/400x400/png?text=Not+Found"} alt="Package" className="w-16 h-16 sm:w-24 sm:h-24 object-cover" />
                </Link>
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                    <Link to={`/package/${booking?.packageDetails?._id}`} className={`font-extrabold text-base sm:text-lg line-clamp-1 hover:underline ${isCancelled ? 'text-slate-600' : 'text-slate-800'}`}>
                      {booking?.packageDetails?.packageName || "Unknown Package"}
                    </Link>
                    {isCancelled && <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white bg-rose-500 px-2 py-0.5 rounded w-max"><FiXCircle/> Cancelled</span>}
                    {isPast && !isCancelled && <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded w-max"><FiCheckCircle/> Completed</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-500"><FiCalendar/> {booking?.date}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-500"><FiUser/> {booking?.buyer?.username}</span>
                  </div>
                </div>
              </div>

              {(isPast || isCancelled) && (
                <button onClick={() => handleHistoryDelete(booking._id)} className="shrink-0 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1.5 self-end md:self-auto py-2">
                  Delete Log
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MyHistory;