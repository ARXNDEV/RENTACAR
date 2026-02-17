import { useDispatch, useSelector } from "react-redux";
import ProfileEdit from "../pages/user/ProfileEdit";
import toast, { Toaster } from "react-hot-toast";
import { setUpdated } from "../redux/user/userSlice";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  LuMail, LuPhone, LuMapPin, LuShieldCheck,
  LuCar, LuStar, LuTrendingUp, LuCalendar,
  LuBadgeCheck, LuUser
} from "react-icons/lu";

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="group relative overflow-hidden bg-white rounded-3xl border border-slate-100 p-6 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/80 transition-all duration-500 cursor-default"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
    <p className="text-xl font-black text-slate-800 leading-tight truncate">{value}</p>
    <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-5 group-hover:opacity-10 transition-opacity" style={{ background: 'currentColor' }} />
  </motion.div>
);

const InfoRow = ({ icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="flex items-start gap-4 py-4 border-b border-slate-50 last:border-0 group"
  >
    <div className="w-9 h-9 rounded-2xl bg-slate-50 group-hover:bg-green-50 flex items-center justify-center text-slate-400 group-hover:text-green-500 transition-all duration-300 flex-shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-700 truncate">{value}</p>
    </div>
  </motion.div>
);

const UserProfileContent = () => {
  const { email, username, profilePicture, phoneNumber, adress } = useSelector(
    (state) => state.user.currentUser
  );
  const dispatch = useDispatch();
  const isUpdated = useSelector((state) => state.user.isUpdated);

  useEffect(() => {
    if (isUpdated) {
      toast.success("Profile updated successfully!", {
        style: { borderRadius: '16px', fontWeight: '700', fontSize: '14px' },
        iconTheme: { primary: '#22c55e', secondary: '#fff' },
      });
      dispatch(setUpdated(false));
    }
  }, [isUpdated, dispatch]);

  const completeness = [email, username, phoneNumber, adress, profilePicture].filter(Boolean).length;
  const completePct = Math.round((completeness / 5) * 100);

  return (
    <div className="w-full">
      <Toaster position="top-right" />

      {/* Hero Banner */}
      <div className="relative h-52 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f2027 100%)' }}>
        {/* Animated mesh */}
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] left-[-10%] w-[55%] h-[180%] bg-green-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[140%] bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />

        {/* Edit button */}
        <div className="absolute bottom-6 right-6 z-20">
          <ProfileEdit />
        </div>

        {/* Badge */}
        <div className="absolute top-6 right-6">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Verified Member
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-6 md:px-10 -mt-16 pb-10 relative z-10">

        {/* Avatar + Name Row */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-10">
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="relative flex-shrink-0"
          >
            <div className="w-32 h-32 rounded-[2rem] border-4 border-white shadow-2xl shadow-slate-200 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 group">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="profile"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <LuUser size={48} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-green-500 text-white flex items-center justify-center rounded-2xl shadow-xl border-4 border-white">
              <LuShieldCheck size={16} />
            </div>
          </motion.div>

          <div className="flex-1 pb-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col gap-2"
            >
              {/* Username on its own line */}
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {username || "Your Name"}
              </h1>

              {/* Role + Badge row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-500">Member</span>
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                  <LuBadgeCheck size={10} /> Elite
                </span>
              </div>

              {/* Email on its own line */}
              <p className="text-sm text-slate-400 font-semibold flex items-center gap-2">
                <LuMail size={13} />
                {email}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Profile Completeness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
          <div className="absolute -right-10 -top-10 w-36 h-36 bg-green-500/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <LuTrendingUp size={14} className="text-green-400" />
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Profile Strength</span>
              </div>
              <p className="text-white font-black text-lg">{completePct}% Complete</p>
              <p className="text-white/40 text-xs font-semibold mt-1">
                {completePct < 100 ? "Add more details to unlock exclusive benefits" : "Your profile is fully complete!"}
              </p>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completePct}%` }}
                  transition={{ duration: 1.2, ease: "circOut", delay: 0.4 }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #22c55e, #4ade80)' }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[9px] text-white/30 font-bold">Beginner</span>
                <span className="text-[9px] text-green-400 font-bold">{completePct}%</span>
                <span className="text-[9px] text-white/30 font-bold">Elite</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm"
          >
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Contact Information</h2>
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Personal</span>
            </div>
            <div className="px-6 pb-2">
              <InfoRow icon={<LuMail size={15} />} label="Email Address" value={email || "Not provided"} delay={0.3} />
              <InfoRow icon={<LuPhone size={15} />} label="Phone Number" value={phoneNumber || "No phone added yet"} delay={0.35} />
              <InfoRow icon={<LuMapPin size={15} />} label="Registered Address" value={adress || "No address added yet"} delay={0.4} />
              <InfoRow icon={<LuCalendar size={15} />} label="Member Since" value="2024" delay={0.45} />
            </div>
          </motion.div>

          {/* Stats Column */}
          <div className="flex flex-col gap-4">
            <StatCard
              icon={<LuCar size={20} className="text-blue-600" />}
              label="Total Rides"
              value="12 Completed"
              color="bg-blue-50"
              delay={0.3}
            />
            <StatCard
              icon={<LuStar size={20} className="text-amber-500" />}
              label="Loyalty Points"
              value="2,450 pts"
              color="bg-amber-50"
              delay={0.38}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46, duration: 0.5 }}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-5 relative overflow-hidden shadow-xl shadow-green-100"
            >
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
              <div className="relative z-10">
                <LuShieldCheck size={22} className="text-white/80 mb-3" />
                <p className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-1">Total Savings</p>
                <p className="text-white text-2xl font-black">₹2,450</p>
                <p className="text-white/50 text-[10px] font-bold mt-1">Across all bookings</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileContent;
