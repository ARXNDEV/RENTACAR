import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { FaCarSide } from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { LuCalendar, LuMapPin, LuTimer, LuZap, LuArrowRight } from "react-icons/lu";
import CarNotFound from "./CarNotFound";
import { useNavigate } from "react-router-dom";
import { setVariants } from "../../redux/user/listAllVehicleSlice";
import { setFilteredData } from "../../redux/user/sortfilterSlice";

import { toast } from "sonner";
import { isVehicleVisible } from "../../components/utils/vehicleFlags";

import { onVehicleDetail } from "./Vehicles";

const AvailableVehiclesAfterSearch = () => {
  const { availableCars } = useSelector((state) => state.selectRideSlice);
  const { pickup_district, pickup_location, pickupDate, dropoffDate } =
    useSelector((state) => state.bookingDataSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showVarients = async (model) => {
    try {
      if (!pickupDate || !dropoffDate) {
        toast.error("Timeline data missing. Please scan from home.");
        return;
      }
      const datas = {
        pickUpDistrict: pickup_district,
        pickUpLocation: pickup_location,
        pickupDate: pickupDate.humanReadable,
        dropOffDate: dropoffDate.humanReadable,
        model,
      };
      const res = await fetch("/api/user/getVehiclesWithoutBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datas),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Model variants currently locked.");
        return;
      }

      dispatch(setVariants(data));
      dispatch(setFilteredData(data));
      navigate("/allVariants");
    } catch (error) {
      console.error("Variant Sync Error:", error);
      toast.error("Handshake with mobility hub failed.");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#fbfcfd] pb-32 pt-10"
    >
      {/* Search Summary Header */}
      <div className="sticky top-4 z-40 px-6 mb-16">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] p-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-6 px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                <LuMapPin size={18} />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-tight">Location</p>
                <p className="text-[10px] font-bold text-white truncate max-w-[100px]">{pickup_location}</p>
              </div>
            </div>
            
            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <LuCalendar size={18} />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-tight">Timeline</p>
                <p className="text-[10px] font-bold text-white whitespace-nowrap">
                   {typeof pickupDate?.humanReadable === 'string' ? pickupDate.humanReadable.split(',')[0].substring(0,10) : 'N/A'} - {typeof dropoffDate?.humanReadable === 'string' ? dropoffDate.humanReadable.split(',')[0].substring(0,10) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl px-5 py-2.5 flex items-center gap-3 mr-1">
             <LuTimer className="text-slate-400" size={16} />
             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">3 Days Trip</span>
          </div>
        </motion.div>
      </div>

      <div className="text-center mb-16 px-6">
        <motion.span 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-green-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block"
        >
          Select Your Fleet
        </motion.span>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
           Available at {pickup_district}
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto font-medium text-sm">
          Precision selection at your fingertips. Choose a base model to explore all variations and custom specs.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {availableCars && availableCars.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-8"
          >
            {availableCars.map((cur, idx) => (
              isVehicleVisible(cur) && (
                <motion.div
                  variants={item}
                  key={cur._id || idx}
                  className="group bg-white rounded-[3rem] border border-slate-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.12)] transition-all duration-500 relative overflow-hidden"
                >
                  {/* Hover Shine Effect */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-20" />

                  <div className="relative h-64 bg-slate-50/50 flex items-center justify-center p-8">
                    <img
                      src={`${cur.image[0]}`}
                      alt={cur.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6">
                       <span className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full flex items-center gap-2">
                         <LuZap size={10} className="text-green-400" /> Instant
                       </span>
                    </div>
                  </div>

                  <div className="p-8 pb-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-green-600 transition-colors uppercase leading-tight">
                          {cur.name}
                        </h2>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{cur.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-slate-900 leading-none">₹{cur.price}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Per Day</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-8 border-t border-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl text-slate-500">
                            <MdAirlineSeatReclineNormal size={18} />
                            <span className="text-xs font-bold">{cur.seats} Seats</span>
                          </div>
                          <div className="h-4 w-px bg-slate-100" />
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{cur.car_type}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => showVarients(cur.model)}
                          className="h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all font-bold text-xs uppercase tracking-widest"
                        >
                          View Variants
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (!cur._id) return toast.error("Vehicle ID missing");
                            onVehicleDetail(cur._id, dispatch, navigate, true);
                          }}
                          className="h-12 rounded-xl bg-green-500 text-white shadow-lg shadow-green-100 flex items-center justify-center hover:bg-green-600 transition-all font-bold text-xs uppercase tracking-widest"
                        >
                          Checkout
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </motion.div>
        ) : (
          <div className="mt-20">
            <CarNotFound />
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default AvailableVehiclesAfterSearch;
