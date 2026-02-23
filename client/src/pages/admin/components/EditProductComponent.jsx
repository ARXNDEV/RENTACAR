import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { MenuItem, TextField, Avatar, Paper } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { LuSave, LuArrowLeft, LuInfo, LuTrendingUp } from "react-icons/lu";

import { setadminEditVehicleSuccess } from "../../../redux/adminSlices/adminDashboardSlice/StatusSlice";
import { Header } from "../components";

export default function EditProductComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vehicle_id = queryParams.get("vehicle_id");

  const { register, handleSubmit, control, setValue } = useForm();
  const { userAllVehicles = [] } = useSelector((state) => state.userListVehicles);
  const { companyData = [] } = useSelector((state) => state.modelDataSlice);

  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState(null);

  const hydrateForm = (vehicleData) => {
    Object.keys(vehicleData).forEach((key) => {
      if (key === "fuel_type") setValue("fuelType", vehicleData[key]);
      else if (key === "transmition") setValue("transmitionType", vehicleData[key]);
      else if (key === "car_type") setValue("carType", vehicleData[key]);
      else if (key === "seats") setValue("Seats", vehicleData[key]);
      else if (key === "location") setValue("vehicleLocation", vehicleData[key]);
      else if (key === "district") setValue("vehicleDistrict", vehicleData[key]);
      else if (key === "car_title") setValue("title", vehicleData[key]);
      else if (key === "car_description") setValue("description", vehicleData[key]);
      else setValue(key, vehicleData[key]);
    });
  };

  useEffect(() => {
    const foundVehicle = userAllVehicles.find((v) => v._id === vehicle_id);
    if (foundVehicle) {
      setVehicle(foundVehicle);
      hydrateForm(foundVehicle);
    } else {
      const fetchOne = async () => {
        try {
          const res = await fetch("/api/admin/showVehicles");
          if (!res.ok) {
            return;
          }

          const all = await res.json();
          const target = all.find((v) => v._id === vehicle_id);
          if (target) {
            setVehicle(target);
            hydrateForm(target);
          }
        } catch (error) {
          toast.error("Unable to load vehicle details");
        }
      };

      fetchOne();
    }
  }, [vehicle_id, userAllVehicles, setValue]);

  const onEditSubmit = async (editData) => {
    setLoading(true);
    const toastId = toast.loading("Updating vehicle specifications...");
    try {
      const res = await fetch(`/api/admin/editVehicle/${vehicle_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: editData }),
      });

      if (res.ok) {
        toast.success("Vehicle updated successfully", { id: toastId });
        dispatch(setadminEditVehicleSuccess(true));
        setTimeout(() => navigate("/adminDashboard/allProduct"), 1000);
      } else {
        const err = await res.json();
        toast.error(err.message || "Update failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Internal Server Error", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return <div className="p-20 text-center font-bold text-slate-400">Loading Vehicle Data...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-10 max-w-[1200px] mx-auto space-y-8"
    >
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/adminDashboard/allProduct")}
            className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:shadow-md transition-all active:scale-90"
          >
            <LuArrowLeft size={20} />
          </button>
          <Header title="Edit Specifications" />
        </div>
        <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
           <Avatar src={vehicle.image?.[0]} variant="rounded" sx={{ width: 40, height: 30, borderRadius: "8px" }} />
           <div>
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">Editing Mode</span>
             <span className="text-xs font-bold text-slate-700">{vehicle.name}</span>
           </div>
        </div>
      </div>

      <Paper className="p-10 rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50">
        <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-4">
                <LuInfo size={16} className="text-emerald-500" />
                Identity & Tracking
              </h3>
              <TextField fullWidth label="Registration Number" {...register("registeration_number")} variant="filled" InputProps={{ disableUnderline: true, style: { borderRadius: 16 } }} />
              <TextField fullWidth label="VIN" {...register("vin")} variant="filled" InputProps={{ disableUnderline: true, style: { borderRadius: 16 } }} />
              <TextField fullWidth label="Mileage" type="number" {...register("mileage")} variant="filled" InputProps={{ disableUnderline: true, style: { borderRadius: 16 } }} />
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-4">
                <LuSave size={16} className="text-blue-500" />
                Technical Details
              </h3>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <TextField select fullWidth label="Manufacturer" {...field} variant="filled" InputProps={{ disableUnderline: true, style: { borderRadius: 16 } }}>
                    {companyData.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                )}
              />
              <TextField fullWidth label="Vehicle Name" {...register("name")} variant="filled" InputProps={{ disableUnderline: true, style: { borderRadius: 16 } }} />
              <Controller
                name="fuelType"
                control={control}
                render={({ field }) => (
                  <TextField select fullWidth label="Fuel Type" {...field} variant="filled" InputProps={{ disableUnderline: true, style: { borderRadius: 16 } }}>
                    <MenuItem value="petrol">Petrol</MenuItem>
                    <MenuItem value="diesel">Diesel</MenuItem>
                    <MenuItem value="electirc">Electric</MenuItem>
                    <MenuItem value="hybrid">Hybrid</MenuItem>
                  </TextField>
                )}
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-4">
                <LuTrendingUp size={16} className="text-amber-500" />
                Commercials & Type
              </h3>
              <TextField fullWidth label="Daily Pricing (₹)" type="number" {...register("price")} variant="filled" InputProps={{ disableUnderline: true, style: { borderRadius: 16 } }} />
              <Controller
                name="carType"
                control={control}
                render={({ field }) => (
                  <TextField select fullWidth label="Segment" {...field} variant="filled" InputProps={{ disableUnderline: true, style: { borderRadius: 16 } }}>
                    <MenuItem value="sedan">Sedan</MenuItem>
                    <MenuItem value="suv">SUV</MenuItem>
                    <MenuItem value="hatchback">Hatchback</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name="transmitionType"
                control={control}
                render={({ field }) => (
                  <TextField select fullWidth label="Transmission" {...field} variant="filled" InputProps={{ disableUnderline: true, style: { borderRadius: 16 } }}>
                    <MenuItem value="automatic">Automatic</MenuItem>
                    <MenuItem value="manual">Manual</MenuItem>
                  </TextField>
                )}
              />
            </div>
          </div>

          <div className="pt-10 border-t border-slate-50 flex justify-end gap-6">
            <button 
              type="button" 
              onClick={() => navigate("/adminDashboard/allProduct")}
              className="px-8 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all"
            >
              Cancel Changes
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-3"
            >
              <LuSave size={18} />
              {loading ? "Saving..." : "Update Specifications"}
            </button>
          </div>
        </form>
      </Paper>
    </motion.div>
  );
}
