import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { MdCurrencyRupee } from "react-icons/md";
import { LuCalendar, LuMapPin, LuPackageOpen, LuChevronRight, LuClock } from "react-icons/lu";
import UserOrderDetailsModal from "../../components/UserOrderDetailsModal";
import {
  setIsOrderModalOpen,
  setSingleOrderDetails,
} from "../../redux/user/userSlice";

const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: "bg-green-50 text-green-600 border-green-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    cancelled: "bg-red-50 text-red-500 border-red-100",
    completed: "bg-blue-50 text-blue-600 border-blue-100",
  };
  const s = (status || "confirmed").toLowerCase();
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${styles[s] || styles.confirmed}`}>
      {status || "Confirmed"}
    </span>
  );
};

export default function Orders() {
  const { _id } = useSelector((state) => state.user.currentUser);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/findBookingsOfUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: _id }),
      });
      const data = await res.json();
      if (data) setBookings(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleDetailsModal = (bookingDetails, vehicleDetails) => {
    dispatch(setIsOrderModalOpen(true));
    dispatch(setSingleOrderDetails(bookingDetails, vehicleDetails));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading bookings...</p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[520px] py-20 px-6">
        <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 mb-6 shadow-inner">
          <LuPackageOpen size={44} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2 text-center">No Bookings Yet</h3>
        <p className="text-sm text-slate-400 font-semibold text-center max-w-xs leading-relaxed">
          Your upcoming and past rides will appear here once you make your first booking.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 md:px-10 py-8">
      <UserOrderDetailsModal />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Bookings</h1>
          <p className="text-sm text-slate-400 font-semibold mt-1">{bookings.length} booking{bookings.length !== 1 ? "s" : ""} found</p>
        </div>
        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
          All Trips
        </div>
      </div>

      {/* Booking Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {bookings.map((cur, idx) => {
            const pickupDateStr = cur.bookingDetails.pickupDate;
            const dropoffDateStr = cur.bookingDetails.dropOffDate;
            const vehicleImage = cur.vehicleDetails.image?.length > 0 ? cur.vehicleDetails.image[0] : null;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100 transition-all duration-400"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Vehicle Image */}
                  <div className="relative sm:w-44 h-36 sm:h-auto bg-gradient-to-br from-slate-50 to-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {vehicleImage ? (
                      <img
                        src={vehicleImage}
                        alt={cur.vehicleDetails.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <LuPackageOpen size={36} className="text-slate-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/0 sm:to-white/5" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-5 flex flex-col gap-4">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-black text-slate-900 text-base leading-tight">{cur.vehicleDetails.name || "Vehicle"}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          ID: {cur.bookingDetails._id?.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={cur.bookingDetails.status} />
                        <div className="flex items-center gap-1 font-black text-slate-900 text-lg">
                          <MdCurrencyRupee size={18} className="text-green-500" />
                          {cur.bookingDetails.totalPrice?.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Trip Route */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-2xl p-3.5">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <LuMapPin size={10} /> Pick Up
                        </p>
                        <p className="text-xs font-bold text-slate-700 capitalize leading-snug">
                          {cur.bookingDetails.pickUpLocation || "—"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1.5 flex items-center gap-1">
                          <LuCalendar size={10} /> {pickupDateStr}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-3.5">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <LuMapPin size={10} /> Drop Off
                        </p>
                        <p className="text-xs font-bold text-slate-700 capitalize leading-snug">
                          {cur.bookingDetails.dropOffLocation || "—"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1.5 flex items-center gap-1">
                          <LuCalendar size={10} /> {dropoffDateStr}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                        <LuClock size={12} />
                        Booked
                      </div>
                      <motion.button
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDetailsModal(cur.bookingDetails, cur.vehicleDetails)}
                        className="flex items-center gap-2 text-sm font-black text-slate-900 hover:text-green-600 transition-colors"
                      >
                        View Details <LuChevronRight size={15} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
