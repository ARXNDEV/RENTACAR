import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LuMapPin, 
  LuCalendar, 
  LuTimer, 
  LuArrowRight, 
  LuCheckCircle2, 
  LuZap,
  LuNavigation,
  LuCompass
} from "react-icons/lu";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem, TextField, Switch, FormControlLabel, CircularProgress, Autocomplete } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { setSelectedData } from "../../redux/user/BookingDataSlice";
import { setAvailableCars } from "../../redux/user/selectRideSlice";
import { setDistrictData, setLocationData, setStateData, setWholeData } from "../../redux/adminSlices/adminDashboardSlice/CarModelDataSlice";
import { toast } from "sonner";
import { isVehicleVisible } from "../../components/utils/vehicleFlags";
import { buildMasterDataLookups, getDistrictOptions, getLocationOptions } from "../../components/utils/masterDataUtils";

const schema = z.object({
  state: z.string().min(1, "Required"),
  district: z.string().min(1, "Required"),
  pickupHub: z.string().min(1, "Required"),
  dropoffHub: z.string().min(1, "Required"),
  pickupDate: z.any(),
  dropoffDate: z.any(),
  sameHub: z.boolean(),
}).refine((data) => {
  return dayjs(data.dropoffDate).isAfter(dayjs(data.pickupDate));
}, {
  message: "Drop-off must be after Pick-up",
  path: ["dropoffDate"],
});

const CarSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [availableCount, setAvailableCount] = useState(0);
  
  const { stateData, wholeData } = useSelector((state) => state.modelDataSlice);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      state: "",
      district: "",
      pickupHub: "",
      dropoffHub: "",
      pickupDate: dayjs().add(1, 'hour'),
      dropoffDate: dayjs().add(25, 'hour'),
      sameHub: true,
    }
  });

  const selectedState = watch("state");
  const selectedDistrict = watch("district");
  const selectedPickupHub = watch("pickupHub");
  const sameHub = watch("sameHub");
  const pickupDate = watch("pickupDate");
  const dropoffDate = watch("dropoffDate");

  const filteredDistricts = getDistrictOptions(wholeData, selectedState);
  const filteredLocations = getLocationOptions(wholeData, {
    state: selectedState,
    district: selectedDistrict,
  });

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const res = await fetch("/api/admin/getVehicleModels");
        if (res.ok) {
          const data = await res.json();
          const { states, districts, locations, locationRows } = buildMasterDataLookups(data);
          dispatch(setStateData(states));
          dispatch(setDistrictData(districts));
          dispatch(setLocationData(locations));
          dispatch(setWholeData(locationRows));
        }
      } catch (error) {
        console.error("Master data fetch error:", error);
      }
    };
    fetchMasterData();
  }, [dispatch]);

  useEffect(() => {
    setValue("district", "");
    setValue("pickupHub", "");
    setValue("dropoffHub", "");
  }, [selectedState, setValue]);

  useEffect(() => {
    setValue("pickupHub", "");
    setValue("dropoffHub", "");
  }, [selectedDistrict, setValue]);

  useEffect(() => {
    if (sameHub && selectedPickupHub) {
      setValue("dropoffHub", selectedPickupHub);
    }
  }, [sameHub, selectedPickupHub, setValue]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`/api/user/listAllVehicles`);
        if (res.ok) {
          const data = await res.json();
          let availableVehicles = data.filter((v) => !v.isBooked && isVehicleVisible(v));
          
          if (selectedDistrict) {
            availableVehicles = availableVehicles.filter(v => v.district === selectedDistrict);
          }

          if (selectedPickupHub) {
            availableVehicles = availableVehicles.filter(v => v.location === selectedPickupHub);
          }
          
          setAvailableCount(availableVehicles.length);
        }
      } catch (error) {
        console.error("Count fetch error", error);
      }
    };
    fetchCount();
  }, [selectedDistrict, selectedPickupHub, pickupDate, dropoffDate]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      const searchPayload = {
        pickup_state: data.state,
        pickup_district: data.district,
        pickup_location: data.pickupHub,
        dropoff_location: data.sameHub ? data.pickupHub : data.dropoffHub,
        pickuptime: data.pickupDate,
        dropofftime: data.dropoffDate,
      };

      const res = await fetch("/api/user/searchCar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchPayload)
      });

      const results = await res.json();

      if (res.ok) {
        // Prepare data for BookingDataSlice with human readable dates
        const bookingData = {
          ...searchPayload,
          pickupDate: {
            $d: data.pickupDate,
            humanReadable: dayjs(data.pickupDate).format("MMM DD, YYYY - hh:mm A")
          },
          dropoffDate: {
            $d: data.dropoffDate,
            humanReadable: dayjs(data.dropoffDate).format("MMM DD, YYYY - hh:mm A")
          }
        };

        dispatch(setSelectedData(bookingData));
        dispatch(setAvailableCars(results));
        
        toast.success(`Found ${results.length} vehicles matching your criteria`);
        navigate("/availableVehicles");
      } else {
        toast.error(results.message || "No vehicles available for these dates");
      }
    } catch (error) {
      console.error("Search failure:", error);
      toast.error("Could not connect to mobility network");
    } finally {
      setIsLoading(false);
    }
  };

  const InputLabel = ({ icon: Icon, label }) => (
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 flex items-center gap-2">
      <Icon className="text-emerald-500" size={14} />
      {label}
    </label>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-full max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white/70 backdrop-blur-3xl border border-white/40 rounded-[3rem] p-10 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.1)] overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100/50 blur-[80px] rounded-full -ml-32 -mb-32 pointer-events-none" />

          {/* Header Section */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl shadow-slate-900/20 group">
                <LuCompass size={32} className="group-hover:rotate-45 transition-transform duration-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter sm:text-4xl">Book Your Journey</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Premium Mobility Solutions</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-emerald-500/10 px-8 py-4 rounded-[2rem] border border-emerald-500/20">
              <div>
                <span className="block text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Live Status</span>
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  <span className="text-emerald-500">{availableCount}</span> Available Fleet
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <LuZap className="text-emerald-500 animate-bounce" size={18} />
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8">
              
              <div className="group">
                <InputLabel icon={LuCompass} label="State" />
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={stateData || []}
                      onChange={(_, newValue) => field.onChange(newValue || "")}
                      value={field.value || null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select State"
                          error={!!errors.state}
                          sx={customMuiStyles}
                        />
                      )}
                    />
                  )}
                />
              </div>
              
              <div className="group">
                <InputLabel icon={LuNavigation} label="Region" />
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={filteredDistricts || []}
                      disabled={!selectedState}
                      onChange={(_, newValue) => field.onChange(newValue || "")}
                      value={field.value || null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={selectedState ? "Select Region" : "Select State First"}
                          error={!!errors.district}
                          sx={customMuiStyles}
                        />
                      )}
                    />
                  )}
                />
              </div>

              <div className="group">
                <InputLabel icon={LuMapPin} label="Pick-up Hub" />
                <Controller
                  name="pickupHub"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={filteredLocations || []}
                      disabled={!selectedDistrict}
                      onChange={(_, newValue) => field.onChange(newValue || "")}
                      value={field.value || null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={selectedDistrict ? "Select Hub" : "Select Region First"}
                          error={!!errors.pickupHub}
                          sx={customMuiStyles}
                        />
                      )}
                    />
                  )}
                />
              </div>

              <div className="group">
                <InputLabel icon={LuCalendar} label="Departure" />
                <Controller
                  name="pickupDate"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      {...field}
                      minDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: customMuiStyles,
                          error: !!errors.pickupDate
                        }
                      }}
                    />
                  )}
                />
              </div>

              <div className="group">
                <InputLabel icon={LuTimer} label="Return" />
                <Controller
                  name="dropoffDate"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      {...field}
                      minDate={pickupDate || dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: customMuiStyles,
                          error: !!errors.dropoffDate,
                          helperText: errors.dropoffDate?.message
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-10 border-t border-slate-100/50">
              <div className="flex flex-col sm:flex-row items-center gap-10">
                <Controller
                  name="sameHub"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <div className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${field.value ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out shadow-sm ${field.value ? 'transform translate-x-6' : ''}`}></div>
                      </div>
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest transition-colors group-hover:text-slate-900">
                        Same Location Return
                      </span>
                    </label>
                  )}
                />

                <AnimatePresence>
                  {!sameHub && (
                    <motion.div
                      initial={{ opacity: 0, x: -20, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: 'auto' }}
                      exit={{ opacity: 0, x: -20, width: 0 }}
                      className="overflow-hidden min-w-[240px]"
                    >
                      <InputLabel icon={LuMapPin} label="Drop-off Hub" />
                      <Controller
                        name="dropoffHub"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            options={filteredLocations || []}
                            onChange={(_, newValue) => field.onChange(newValue || "")}
                            value={field.value || null}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Drop-off Hub"
                                error={!!errors.dropoffHub}
                                helperText={errors.dropoffHub?.message}
                                sx={customMuiStyles}
                              />
                            )}
                          />
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full lg:w-auto px-16 h-20 rounded-[2rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-black transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" thickness={6} />
                ) : (
                  <>
                    Scan Available Fleet
                    <LuArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Confidence Indicators */}
        <div className="flex flex-wrap justify-center gap-12 mt-12 opacity-60">
           <div className="flex items-center gap-3">
              <LuCheckCircle2 className="text-emerald-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verified Fleet</span>
           </div>
           <div className="flex items-center gap-3">
              <LuCheckCircle2 className="text-emerald-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Insurance</span>
           </div>
           <div className="flex items-center gap-3">
              <LuCheckCircle2 className="text-emerald-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">24/7 Concierge</span>
           </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

const customMuiStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '1.5rem',
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    fontFamily: 'inherit',
    fontWeight: 800,
    fontSize: '0.85rem',
    letterSpacing: '0.025em',
    color: '#0f172a',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '2px solid transparent',
    '& fieldset': { border: 'none' },
    '&:hover': {
      backgroundColor: '#fff',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
      transform: 'translateY(-2px)'
    },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 15px 40px -12px rgba(16, 185, 129, 0.15)',
      border: '2px solid #10b981',
      transform: 'translateY(-2px)'
    },
    '&.Mui-disabled': {
      backgroundColor: 'rgba(241, 245, 249, 0.5)',
      opacity: 0.6
    }
  },
  '& .MuiInputBase-input': { 
    padding: '1.25rem 1.5rem',
    '&::placeholder': { color: '#94a3b8', opacity: 1 }
  }
};

const menuItemStyles = {
  fontFamily: 'inherit',
  fontWeight: 700,
  fontSize: '0.85rem',
  padding: '12px 20px',
  color: '#334155',
  '&:hover': { backgroundColor: '#f0fdf4', color: '#10b981' },
  '&.Mui-selected': { backgroundColor: '#10b981 !important', color: '#fff !important' }
};


export default CarSearch;
