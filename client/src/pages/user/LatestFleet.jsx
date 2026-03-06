import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuCar, LuZap, LuShieldCheck, LuArrowRight, LuMapPin, LuCalendar } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onVehicleDetail } from "./Vehicles";

const LatestFleet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/user/listAllVehicles");
        if (res.ok) {
          const data = await res.json();
          setVehicles(data.slice(0, 6)); // Show latest 6
        }
      } catch (error) {
        console.error("Failed to fetch latest fleet:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="h-4 w-32 bg-slate-100 rounded-full animate-pulse" />
        <div className="h-12 w-64 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-[450px] bg-slate-50 rounded-[3rem] animate-pulse border border-slate-100" />
        ))}
      </div>
    </div>
  );

  if (vehicles.length === 0) return null;

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col items-center text-center mb-16">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-green-100 mb-6 inline-block"
        >
          Latest Arrivals
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6"
        >
          Our <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-emerald-600">Premium Fleet</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 font-medium max-w-xl text-lg"
        >
          Experience the latest in automotive engineering. Our fleet is constantly updated with brand-new vehicles for your ultimate comfort.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {vehicles.map((vehicle, idx) => (
            <motion.div
              key={vehicle._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.1)] transition-all duration-700 relative overflow-hidden"
            >
              <div className="relative h-64 bg-slate-50 flex items-center justify-center p-8 overflow-hidden">
                <img 
                  src={vehicle.image[0]} 
                  alt={vehicle.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 relative z-10" 
                />
                <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-green-600 shadow-sm border border-green-50 uppercase tracking-widest z-20">
                   {vehicle.car_type}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
              </div>

              <div className="p-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">{vehicle.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{vehicle.company}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">₹{vehicle.price}</span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">/ Day</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                   <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100/50">
                      <LuZap size={16} className="text-green-500" />
                      <span className="text-xs font-black text-slate-600 uppercase">{vehicle.fuel_type}</span>
                   </div>
                   <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100/50">
                      <LuShieldCheck size={16} className="text-blue-500" />
                      <span className="text-xs font-black text-slate-600 uppercase">{vehicle.transmition}</span>
                   </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onVehicleDetail(vehicle._id, dispatch, navigate, true)}
                    className="flex-1 bg-green-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100 flex items-center justify-center gap-2 group/btn transition-colors hover:bg-green-600"
                  >
                    Reserve Now
                    <LuArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onVehicleDetail(vehicle._id, dispatch, navigate, false)}
                    className="px-6 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 transition-colors hover:bg-slate-800"
                  >
                    Specs
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-20 flex justify-center">
        <Link to="/vehicles">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-slate-900 px-10 py-6 rounded-[2rem] border-2 border-slate-100 font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 flex items-center gap-4 group hover:bg-slate-50 transition-all"
          >
            Explore Full Fleet
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-green-500 transition-colors">
              <LuArrowRight size={20} />
            </div>
          </motion.button>
        </Link>
      </div>
    </section>
  );
};

export default LatestFleet;
