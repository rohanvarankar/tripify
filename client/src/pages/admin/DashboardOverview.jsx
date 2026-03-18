import React, { useEffect, useState } from "react";
import { FiUsers, FiPackage, FiCreditCard, FiTrendingUp } from "react-icons/fi";
import Chart from "../components/Chart";
import { Link } from "react-router-dom";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    users: 0,
    packages: 0,
    revenue: 0,
    bookingsCount: 0,
    recentBookings: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, packagesRes, bookingsRes] = await Promise.all([
          fetch("/api/user/getAllUsers"),
          fetch("/api/package/get-packages"),
          fetch("/api/booking/get-allBookings"),
        ]);

        const usersData = await usersRes.json();
        const packagesData = await packagesRes.json();
        const bookingsData = await bookingsRes.json();

        // Safe arrays
        const users = Array.isArray(usersData) ? usersData : [];
        const packages = packagesData?.packages || [];
        const bookings = bookingsData?.bookings || [];

        const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        
        // Sorting to get latest
        const recentBookings = [...bookings].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
        const recentUsers = [...users].reverse().slice(0, 4);

        setStats({
          users: users.length,
          packages: packages.length,
          revenue: totalRevenue,
          bookingsCount: bookings.length,
          recentBookings,
          recentUsers,
          allBookingsData: bookings, // For chart
        });
      } catch (error) {
        console.log("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Welcome back, Admin!</h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening with Tripify today.</p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: <FiTrendingUp size={24}/>, color: "from-emerald-500 to-teal-400", shadow: "shadow-emerald-500/20" },
          { label: "Total Bookings", value: stats.bookingsCount, icon: <FiCreditCard size={24}/>, color: "from-indigo-500 to-violet-500", shadow: "shadow-indigo-500/20" },
          { label: "Active Packages", value: stats.packages, icon: <FiPackage size={24}/>, color: "from-amber-400 to-orange-500", shadow: "shadow-orange-500/20" },
          { label: "Registered Users", value: stats.users, icon: <FiUsers size={24}/>, color: "from-rose-400 to-pink-500", shadow: "shadow-pink-500/20" },
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <Chart data={stats.allBookingsData || []} />
        </div>

        {/* Recent Bookings & Users Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <span className="w-2 h-6 rounded-full bg-orange-500"></span>
              Recent Transactions
            </h3>
            <div className="space-y-4">
              {stats.recentBookings.length === 0 ? (
                <p className="text-sm text-slate-500">No recent bookings.</p>
              ) : (
                stats.recentBookings.map((booking, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={booking?.packageDetails?.packageImages[0] || "/placeholder.jpg"} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{booking?.packageDetails?.packageName}</p>
                      <p className="text-xs text-slate-500 truncate">{booking?.buyer?.username}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-emerald-600">+${booking?.totalPrice}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <span className="w-2 h-6 rounded-full bg-blue-500"></span>
              New Users
            </h3>
            <div className="space-y-4">
              {stats.recentUsers.length === 0 ? (
                <p className="text-sm text-slate-500">No recent users.</p>
              ) : (
                stats.recentUsers.map((user, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold font-sm">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.username}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
