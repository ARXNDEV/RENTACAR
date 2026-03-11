import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navbar } from "../../admin/components";
import AdminHomeMain from "../../admin/pages/AdminHomeMain";
import VendorAllVehicles from "../pages/VendorAllVehicles";
import VendorSidebar from "../Components/VendorSidebar";
import VendorBookings from "../Components/VendorBookings";
import { motion, AnimatePresence } from "framer-motion";

function VendorDashboard() {
  const { activeMenu } = useSelector((state) => state.adminDashboardSlice);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <div className="flex relative">
        
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {activeMenu ? (
            <motion.div 
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-72 fixed sidebar z-[100] bg-white border-r border-slate-100 h-screen shadow-[20px_0_50px_rgba(0,0,0,0.02)]"
            >
              <VendorSidebar />
            </motion.div>
          ) : (
            <div className="w-0 overflow-hidden">
              <VendorSidebar />
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div
          className={`bg-[#f8fafc] min-h-screen w-full transition-all duration-300 ease-in-out ${
            activeMenu ? "pl-72" : "pl-0"
          }`}
        >
          {/* Top Navigation */}
          <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
            <Navbar />
          </div>

          {/* Page Content */}
          <main className="p-6 lg:p-10 max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Navigate to="/vendorDashboard/adminHome" replace />} />
                <Route path="/adminHome" element={<AdminHomeMain />} />
                <Route path="/vendorAllVeihcles" element={<VendorAllVehicles />} />
                <Route path="/bookings" element={<VendorBookings />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
