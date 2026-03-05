import { useDispatch, useSelector } from "react-redux";
import { LuCalendar, LuMapPin, LuTimer, LuUser, LuArrowLeft, LuCreditCard, LuZap, LuShieldCheck, LuCheckCircle2, LuMail, LuPhone } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { setPageLoading } from "../../redux/user/userSlice";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { displayStripeCheckout } from "./stripeService";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { setSelectedData } from "../../redux/user/BookingDataSlice";

const schema = z.object({
  email: z.string().email("Valid email required"),
  phoneNumber: z.string().min(10, "10-digit number required"),
  adress: z.string().min(5, "Full address required"),
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { 
      email: "",
      phoneNumber: "",
      adress: ""
    },
  });

  const {
    pickup_district,
    pickup_location,
    dropoff_location,
    pickupDate,
    dropoffDate,
  } = useSelector((state) => state.bookingDataSlice);

  const currentUser = useSelector((state) => state.user.currentUser);
  const singleVehicleDetail = useSelector((state) => state.userListVehicles.singleVehicleDetail);
  const { isPageLoading } = useSelector((state) => state.user);

  const { price } = singleVehicleDetail || { price: 0 };
  const user_id = currentUser?._id;
  
  useEffect(() => {
    // Reset page loading state on mount to prevent stuck 'Processing' states
    dispatch(setPageLoading(false));
  }, [dispatch]);

  // Date and duration calculations
  const startDate = dayjs(pickupDate?.humanReadable || new Date());
  const endDate = dayjs(dropoffDate?.humanReadable || startDate.add(1, 'day'));
  const durationDays = endDate.diff(startDate, 'day') || 1;

  const [isEditingDates, setIsEditingDates] = useState(false);
  const [editStartDate, setEditStartDate] = useState(startDate);
  const [editEndDate, setEditEndDate] = useState(endDate);

  const handleUpdateDates = () => {
    if (editEndDate.diff(editStartDate, 'hour') < 2) {
      toast.error("Rental duration must be at least 2 hours");
      return;
    }
    const updatedBookingData = {
      pickup_district,
      pickup_location,
      dropoff_location,
      pickuptime: editStartDate,
      dropofftime: editEndDate,
      pickupDate: {
        $d: editStartDate,
        humanReadable: editStartDate.format("MMM DD, YYYY - hh:mm A")
      },
      dropoffDate: {
        $d: editEndDate,
        humanReadable: editEndDate.format("MMM DD, YYYY - hh:mm A")
      }
    };
    dispatch(setSelectedData(updatedBookingData));
    setIsEditingDates(false);
    toast.success("Duration updated successfully!");
  };

  // Logic calculation fix
  const bookingFee = 50;
  const subTotal = price * durationDays;
  const totalPrice = subTotal + bookingFee;

  const onSubmit = async (values) => {
    if (!singleVehicleDetail) {
      toast.error("Vehicle details missing");
      return;
    }

    const orderData = {
      user_id,
      vehicle_id: singleVehicleDetail._id,
      vehicle_model: singleVehicleDetail.model,
      totalPrice,
      pickupDate: pickupDate?.humanReadable || startDate.format("MMM DD, YYYY - hh:mm A"),
      dropoffDate: dropoffDate?.humanReadable || endDate.format("MMM DD, YYYY - hh:mm A"),
      pickup_district: pickup_district || singleVehicleDetail.district,
      pickup_location: pickup_location || singleVehicleDetail.location,
      dropoff_location: dropoff_location || singleVehicleDetail.location,
      username: currentUser?.username,
      ...values
    };

    return orderData; // used by both payment handlers
  };

  const handleStripe = async (values) => {
    const orderData = await onSubmit(values);
    if (!orderData) return;
    await displayStripeCheckout(orderData, navigate, dispatch);
  };

  const muiStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '1.5rem',
      backgroundColor: '#f8fafc',
      fontFamily: 'inherit',
      fontWeight: 600,
      fontSize: '0.875rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '& fieldset': { 
        border: '2px solid transparent',
      },
      '&:hover': { 
        backgroundColor: '#f1f5f9',
        '& fieldset': {
          borderColor: '#e2e8f0',
        }
      },
      '&.Mui-focused': { 
        backgroundColor: '#fff', 
        boxShadow: '0 10px 25px -5px rgba(34,197,94,0.1)',
        '& fieldset': { 
          borderColor: '#22c55e',
          borderWidth: '2px',
        }
      },
      '&.Mui-error': {
        backgroundColor: '#fff1f2',
        '& fieldset': {
          borderColor: '#f43f5e',
        }
      }
    },
    '& .MuiInputBase-input': {
      padding: '1.25rem 1.5rem',
      '&::placeholder': {
        color: '#94a3b8',
        opacity: 1,
        fontWeight: 500,
      }
    },
    '& .MuiInputAdornment-root': {
      color: '#94a3b8',
      marginLeft: '1rem',
    }
  };

  if (!singleVehicleDetail) {
    return (
      <div className="min-h-screen bg-[#fbfcfd] flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.05)] p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mb-6">
            <LuArrowLeft size={28} className="rotate-45" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">Vehicle details unavailable</h1>
          <p className="text-slate-500 font-medium mb-8">
            Your checkout session no longer has the selected vehicle in memory. Return to the fleet and choose the car again.
          </p>
          <Link
            to="/availableVehicles"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-8 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all"
          >
            Back to Fleet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcfd] pt-12 pb-32 relative overflow-hidden">
      <Toaster position="top-center" richColors />
      
      {/* Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Link to="/availableVehicles" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest mb-10 group">
          <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Fleet
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Order Summary Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-12 xl:col-span-5 space-y-8"
          >
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden relative group">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Booking Summary</h2>
                <div className="bg-green-500/10 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 italic">
                  Premium Tier
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mb-10">
                <div className="w-full sm:w-48 h-32 rounded-3xl bg-slate-50 border border-slate-100 p-4 flex items-center justify-center relative overflow-hidden">
                   <img 
                      src={singleVehicleDetail.image[0]} 
                      alt="vehicle" 
                      className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
                    {singleVehicleDetail.model}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                       <LuZap size={12} className="text-green-500" /> {singleVehicleDetail.fuel_type}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                       <LuShieldCheck size={12} className="text-blue-500" /> {singleVehicleDetail.transmition}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                       <LuCheckCircle2 size={12} className="text-green-500" /> Insured
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Intelligence Grid */}
              <div className="grid grid-cols-2 gap-4 pt-10 border-t border-slate-50 relative">
                <div className="col-span-2 flex justify-end absolute right-0 -top-4 mt-2">
                  <button
                    onClick={() => {
                      if (isEditingDates) {
                        handleUpdateDates();
                      } else {
                        setIsEditingDates(true);
                      }
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
                  >
                    {isEditingDates ? "Save Dates" : "Edit Duration"}
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <LuMapPin size={12} className="text-green-500" /> Origin Hub
                  </span>
                  <p className="text-xs font-black text-slate-900 uppercase">{pickup_location || singleVehicleDetail?.location}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <LuCalendar size={12} className="text-green-500" /> Journey Date
                  </span>
                  {isEditingDates ? (
                    <div className="flex flex-col gap-2 mt-2">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          label="Pickup"
                          value={editStartDate}
                          onChange={(newValue) => setEditStartDate(newValue)}
                          minDate={dayjs()}
                          slotProps={{ textField: { size: 'small', sx: { '& .MuiInputBase-root': { fontSize: '10px' } } } }}
                        />
                        <DateTimePicker
                          label="Dropoff"
                          value={editEndDate}
                          onChange={(newValue) => setEditEndDate(newValue)}
                          minDate={editStartDate}
                          slotProps={{ textField: { size: 'small', sx: { '& .MuiInputBase-root': { fontSize: '10px' } } } }}
                        />
                      </LocalizationProvider>
                    </div>
                  ) : (
                    <p className="text-xs font-black text-slate-900 uppercase">
                      {startDate.format("DD MMM, YYYY")}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <LuTimer size={12} className="text-green-500" /> Duration
                  </span>
                  <p className="text-xs font-black text-slate-900 uppercase">{durationDays} Cycle Day</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <LuCreditCard size={12} className="text-green-500" /> Rate
                  </span>
                  <p className="text-xs font-black text-slate-900 uppercase">₹{price} / Day</p>
                </div>
              </div>

              <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative">
                <div className="relative z-10">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Due</p>
                   <div className="flex items-end gap-1">
                     <span className="text-3xl font-black">₹{totalPrice}</span>
                     <span className="text-[10px] font-bold text-white/30 mb-1.5">GST INCLUDED</span>
                   </div>
                </div>
                <div className="absolute bottom-[-20%] right-[-10%] w-32 h-32 bg-green-500/20 rounded-full blur-3xl" />
              </div>
            </div>
          </motion.div>

          {/* Secure Checkout Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-12 xl:col-span-7"
          >
            <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.05)] relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500" />
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-5 mb-12 relative z-10"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-200 group-hover:scale-110 transition-transform duration-500">
                   <LuUser size={28} className="animate-pulse" />
                </div>
                <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Security Credentials</h2>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                     Session: {currentUser?.username}
                   </p>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3"
                  >
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 flex items-center gap-2">
                       <LuMail size={12} className="text-emerald-500" /> Communication
                    </label>
                    <TextField 
                      {...register("email")}
                      placeholder="Email Address"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={muiStyles}
                      className="w-full"
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                  >
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 flex items-center gap-2">
                       <LuPhone size={12} className="text-emerald-500" /> Terminal Contact
                    </label>
                    <TextField 
                      {...register("phoneNumber")}
                      placeholder="Mobile Number"
                      type="number"
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber?.message}
                      sx={muiStyles}
                      className="w-full"
                    />
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-3"
                >
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 flex items-center gap-2">
                     <LuMapPin size={12} className="text-emerald-500" /> Physical Address
                  </label>
                  <TextField 
                    {...register("adress")}
                    placeholder="Residential Address / Hub Location"
                    multiline
                    rows={3}
                    error={!!errors.adress}
                    helperText={errors.adress?.message}
                    sx={muiStyles}
                    className="w-full"
                  />
                </motion.div>

                <div className="space-y-4 pt-6">
                  {/* Pay Button */}
                  <motion.button
                    type="button"
                    disabled={isPageLoading}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit(handleStripe)}
                    className="w-full h-[72px] rounded-3xl shadow-xl text-white font-black tracking-[0.2em] text-xs uppercase flex items-center justify-center gap-3 group disabled:opacity-50 transition-all bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                  >
                    {isPageLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        <span>💳</span>
                        Pay with Stripe (₹{totalPrice})
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-[10px] text-slate-400 font-bold">
                    You'll be redirected to Stripe's secure hosted payment page.
                  </p>
                </div>
              </form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-12 flex items-center justify-center gap-4 py-5 bg-emerald-50/50 rounded-2xl border border-dashed border-emerald-200"
              >
                <LuShieldCheck className="text-emerald-500 animate-pulse" size={20} />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.3em]">End-to-End Encryption Enabled</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
