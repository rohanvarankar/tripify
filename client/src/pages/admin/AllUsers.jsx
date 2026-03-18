import React, { useEffect, useState } from "react";
import { FiSearch, FiTrash2, FiUsers } from "react-icons/fi";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/getAllUsers?searchTerm=${search}`);
      const data = await res.json();
      if (data?.success === false) {
        setError(data?.message);
      } else {
        setAllUsers(data);
        setError(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getUsers(); }, [search]);

  const handleUserDelete = async (userId) => {
    if (!confirm("Are you sure? This account will be permanently deleted!")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/user/delete-user/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (!data?.success) { alert("Something went wrong!"); return; }
      alert(data?.message);
      getUsers();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Stat card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: allUser.length, icon: <FiUsers size={24}/>, color: "from-indigo-500 to-violet-500", shadow: "shadow-indigo-500/20" },
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

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="relative max-w-sm">
            <FiSearch className="absolute left-3 top-3 text-slate-400" size={15} />
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
              placeholder="Search name, email or phone..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
          </div>
        )}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}

        {!loading && allUser.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FiUsers size={40} className="mb-3 opacity-30" />
            <p className="font-semibold">No users found</p>
          </div>
        )}

        {!loading && allUser.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allUser.map((user, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                        {user._id.slice(-8)}...
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                          {user.username?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-700">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{user.email}</td>
                    <td className="px-5 py-4 text-slate-500">{user.phone || "—"}</td>
                    <td className="px-5 py-4 text-slate-500 max-w-[140px] truncate">{user.address || "—"}</td>
                    <td className="px-5 py-4">
                      <button
                        disabled={loading}
                        onClick={() => handleUserDelete(user._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                      >
                        <FiTrash2 size={12} /> Delete
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

export default AllUsers;
