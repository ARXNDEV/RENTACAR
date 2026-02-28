

import { useEffect, useState } from "react";
import { 
  LuUsers, 
  LuCar, 
  LuTrendingUp, 
  LuDollarSign, 
  LuClock, 
  LuCheckCircle, 
  LuAlertCircle,
  LuCalendar
} from "react-icons/lu";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AdminHomeMain = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalBookings: 0,
    revenue: 0,
    pendingRequests: 0,
    activeRentals: 0,
    recentBookings: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, vehiclesRes, bookingsRes] = await Promise.all([
          fetch("/api/admin/allUsers"),
          fetch("/api/admin/allVehicles"),
          fetch("/api/admin/latestbookings")
        ]);
        
        const users = await usersRes.json();
        const vehicles = await vehiclesRes.json();
        const bookings = await bookingsRes.json();

        setStats({
          totalUsers: users.length || 0,
          totalVehicles: vehicles.length || 0,
          totalBookings: bookings.length || 0,
          revenue: bookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0),
          pendingRequests: vehicles.filter(v => !v.isVerified).length,
          activeRentals: bookings.filter(b => b.status === "active").length,
          recentBookings: bookings.slice(0, 5)
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-transform group-hover:scale-110`}>
          <Icon className={`text-2xl ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-bold">
            <LuTrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-900">{value}</h3>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back! Here's what's happening with your fleet today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <button className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-lg shadow-slate-200">Real-time</button>
          <button className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Last 24h</button>
          <div className="h-4 w-px bg-slate-100 mx-1"></div>
          <button className="p-2 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
            <LuCalendar size={18} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.revenue.toLocaleString()}`} 
          icon={LuDollarSign} 
          color="bg-emerald-500"
          trend="+12.5%"
        />
        <StatCard 
          title="Active Users" 
          value={stats.totalUsers} 
          icon={LuUsers} 
          color="bg-blue-500"
          trend="+3.2%"
        />
        <StatCard 
          title="Fleet Size" 
          value={stats.totalVehicles} 
          icon={LuCar} 
          color="bg-indigo-500"
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.totalBookings} 
          icon={LuCheckCircle} 
          color="bg-amber-500"
          trend="+18%"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900">Recent Transactions</h3>
              <button 
                onClick={() => navigate('/adminDashboard/orders')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
               >
                 View All Reports
              </button>
            </div>
            <div className="p-0">
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {stats.recentBookings.length > 0 ? (
                      stats.recentBookings.map((b, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                                {b.user?.name ? b.user.name.charAt(0) : 'U'}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{b.user?.name || "Unknown User"}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Transaction #{b._id?.substring(0, 6)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                               {b.status || 'Success'}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-900">₹{b.totalPrice || 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-8 py-8 text-center text-slate-400 font-medium text-sm">
                          No recent transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
               </table>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
               <LuCar size={120} />
            </div>
            <h3 className="text-xl font-black mb-2 relative z-10">Fleet Health</h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10 font-medium">Your platform is performing 24% better than last month.</p>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 relative z-10">
              Run Diagnostics
            </button>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Add Car', icon: LuCar, color: 'text-emerald-500 bg-emerald-50' },
                 { label: 'Users', icon: LuUsers, color: 'text-blue-500 bg-blue-50' },
                 { label: 'Pending', icon: LuClock, color: 'text-amber-500 bg-amber-50' },
                 { label: 'Alerts', icon: LuAlertCircle, color: 'text-red-500 bg-red-50' }
               ].map((action, i) => (
                 <button 
                   key={i} 
                   className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white transition-all group border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 active:scale-95"
                   onClick={() => {
                     const navigateMap = {
                       'Add Car': '/adminDashboard/addProduct',
                       'Users': '/adminDashboard/allUsers',
                       'Pending': '/adminDashboard/vendorVehicleRequests'
                     };
                     if (navigateMap[action.label]) navigate(navigateMap[action.label]);
                   }}
                 >
                    <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                       <action.icon size={20} />
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{action.label}</span>
                 </button>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomeMain;
