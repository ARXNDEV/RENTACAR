import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar, SideBar } from "../components/index.jsx";
import {
  AllVehicles,
  AllUsers,
  AllVendors,
  VenderVehicleRequests,
  Locations,
} from "../pages";
import { useSelector } from "react-redux";
import AdminHomeMain from "../pages/AdminHomeMain.jsx";
import UserProfileContent from "../../../components/UserProfileContent.jsx";
import Bookings from "../components/Bookings.jsx";
import { motion, AnimatePresence } from "framer-motion";
import AddProductModal from "../components/AddProductModal.jsx";
import EditProductComponent from "../components/EditProductComponent.jsx";

function AdminDashNew() {
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
              <SideBar />
            </motion.div>
          ) : (
            <div className="w-0 overflow-hidden">
              <SideBar />
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
                <Route path="/" element={<Navigate to="/adminDashboard/adminHome" replace />} />
                <Route path="/adminHome" element={<AdminHomeMain />} />
                <Route path="/profile" element={<UserProfileContent />} />
                <Route path="/allProduct" element={<AllVehicles />} />
                <Route path="/allUsers" element={<AllUsers />} />
                <Route path="/allVendors" element={<AllVendors />} />

                <Route path="/vendorVehicleRequests" element={<VenderVehicleRequests />} />
                <Route path="/orders" element={<Bookings />} />
                <Route path="/addProduct" element={<AddProductModal />} />
                <Route path="/editProducts" element={<EditProductComponent />} />
                <Route path="/locations" element={<Locations />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminDashNew;
