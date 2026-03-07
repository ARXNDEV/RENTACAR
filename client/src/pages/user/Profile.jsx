import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import UserProfileSidebar from "../../components/UserProfileSidebar";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Orders from "./Orders";
import UserProfileContent from "../../components/UserProfileContent";
import Favorites from "./Favorites";
import { LuArrowLeft, LuMenu } from "react-icons/lu";
import { showSidebarOrNot } from "../../redux/adminSlices/adminDashboardSlice/DashboardSlice";

function Profile() {
  const { isError } = useSelector((state) => state.user);
  const { activeMenu } = useSelector((state) => state.adminDashboardSlice);
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%)' }}>

      {/* Ambient background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] bg-green-400/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <div className="w-9 h-9 rounded-2xl border border-slate-100 bg-white flex items-center justify-center shadow-sm group-hover:border-slate-300 group-hover:shadow transition-all">
                <LuArrowLeft size={17} className="group-hover:-translate-x-0.5 transition-transform" />
              </div>
            </Link>

            <div className="h-5 w-px bg-slate-100 mx-1" />

            <div className="hidden md:block">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none mb-1">Member Portal</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Session</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {isError && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 px-4 py-2 rounded-xl border border-red-100"
                >
                  {isError.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile menu toggle */}
            <button
              onClick={() => dispatch(showSidebarOrNot(!activeMenu))}
              className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-slate-800 transition-all active:scale-90"
            >
              <LuMenu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 relative z-10 max-w-screen-2xl mx-auto w-full">

        {/* Desktop Sidebar — always visible */}
        <aside className="hidden md:flex flex-col w-[268px] flex-shrink-0 sticky top-[57px] self-start h-[calc(100vh-57px)] bg-white border-r border-slate-100 shadow-sm overflow-y-auto">
          <UserProfileSidebar />
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {activeMenu && (
            <>
              <motion.aside
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 280 }}
                className="fixed top-[57px] left-0 h-[calc(100vh-57px)] w-[268px] bg-white border-r border-slate-100 z-50 overflow-y-auto shadow-2xl md:hidden"
              >
                <UserProfileSidebar />
              </motion.aside>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-[57px] bg-slate-900/30 backdrop-blur-sm z-40 md:hidden"
                onClick={() => dispatch(showSidebarOrNot(false))}
              />
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-w-0 py-6 px-4 md:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px]"
            >
              <Routes>
                <Route path="/" element={<UserProfileContent />} />
                <Route path="/profiles" element={<UserProfileContent />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default Profile;
