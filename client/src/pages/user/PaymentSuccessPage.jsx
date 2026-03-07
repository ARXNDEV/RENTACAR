import React from 'react';
import { motion } from 'framer-motion';
import { LuCheckCircle2, LuMapPin, LuArrowRight, LuCalendar, LuCar } from 'react-icons/lu';
import { Link, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const bookingData = location.state?.bookingData;

  return (
    <div className="min-h-screen bg-[#fbfcfd] pt-12 pb-32 relative overflow-hidden flex items-center justify-center">
      <Toaster position="top-center" richColors />
      
      {/* Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl w-full px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.05)] text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200"
          >
            <LuCheckCircle2 size={48} />
          </motion.div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4 uppercase">
            Payment Successful
          </h1>
          <p className="text-slate-500 font-medium text-lg mb-12">
            Your mobility session has been successfully reserved.
          </p>

          <div className="bg-slate-50 rounded-[2.5rem] p-8 mb-12 border border-slate-100 space-y-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                <LuMapPin size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pick-up Instruction</p>
                <h3 className="text-lg font-black text-slate-900 leading-tight uppercase">
                  Please pick up your vehicle from the nearest location.
                </h3>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  Our team at the {bookingData?.pickup_location || 'hub'} is ready for your arrival.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <LuCar size={12} className="text-emerald-500" /> Vehicle Model
                </p>
                <p className="text-sm font-black text-slate-900 uppercase">{bookingData?.vehicle_model || 'Premium Fleet'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <LuCalendar size={12} className="text-emerald-500" /> Start Date
                </p>
                <p className="text-sm font-black text-slate-900 uppercase">{bookingData?.pickupDate || 'Scheduled'}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/profile/orders" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl"
              >
                View My Orders
                <LuArrowRight size={16} />
              </motion.button>
            </Link>
            <Link to="/" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-16 rounded-2xl bg-white text-slate-900 border-2 border-slate-100 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50"
              >
                Back to Home
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
