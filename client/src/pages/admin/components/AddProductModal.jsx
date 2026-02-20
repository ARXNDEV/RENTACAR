import { useDispatch, useSelector } from "react-redux";
import { addVehicleClicked } from "../../../redux/adminSlices/actions";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  setModelData,
  setCompanyData,
  setStateData,
  setLocationData,
  setDistrictData,
  setWholeData,
} from "../../../redux/adminSlices/adminDashboardSlice/CarModelDataSlice";
import { IoMdClose, IoMdCloudUpload } from "react-icons/io";
import { 
  RiCarLine, 
  RiSettings4Line, 
  RiMapPinLine, 
  RiFileTextLine 
} from "react-icons/ri";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { setLoading, setadminAddVehicleSuccess, setadminCrudError } from "../../../redux/adminSlices/adminDashboardSlice/StatusSlice";
import { motion } from "framer-motion";
import { buildMasterDataLookups, getDistrictOptions, getLocationOptions } from "../../../components/utils/masterDataUtils";

export const fetchModelData = async (dispatch) => {
  try {
    const res = await fetch("/api/admin/getVehicleModels", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      const { models, brands, states, districts, locations, locationRows } = buildMasterDataLookups(data);
      dispatch(setModelData(models));
      dispatch(setCompanyData(brands));
      dispatch(setStateData(states));
      dispatch(setLocationData(locations));
      dispatch(setDistrictData(districts));
      dispatch(setWholeData(locationRows));
    }
  } catch (error) {
    console.error(error);
  }
};

const AddProductModal = () => {
  const { register, handleSubmit, control, reset, setValue, watch } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { modelData, companyData, stateData, wholeData = [] } = useSelector((state) => state.modelDataSlice);
  const { loading } = useSelector(state => state.statusSlice);
  
  const [isOtherBrand, setIsOtherBrand] = useState(false);
  const [isOtherModel, setIsOtherModel] = useState(false);
  const [previews, setPreviews] = useState({
    image: null
  });

  const selectedBrand = watch("company");
  const selectedModel = watch("model");
  const selectedState = watch("vehicleState");
  const selectedDistrict = watch("vehicleDistrict");

  const filteredDistricts = getDistrictOptions(wholeData, selectedState);
  const filteredLocations = getLocationOptions(wholeData, {
    state: selectedState,
    district: selectedDistrict,
  });

  useEffect(() => {
    fetchModelData(dispatch);
    dispatch(addVehicleClicked(true));
  }, [dispatch]);

  // Handle "Other" selection for Brand
  useEffect(() => {
    if (selectedBrand === "other") {
      setIsOtherBrand(true);
    } else {
      setIsOtherBrand(false);
    }
  }, [selectedBrand]);

  // Handle "Other" selection for Model
  useEffect(() => {
    if (selectedModel === "other") {
      setIsOtherModel(true);
    } else {
      setIsOtherModel(false);
    }
  }, [selectedModel]);

  useEffect(() => {
    setValue("vehicleDistrict", "");
    setValue("vehicleLocation", "");
  }, [selectedState, setValue]);

  useEffect(() => {
    setValue("vehicleLocation", "");
  }, [selectedDistrict, setValue]);

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (addData) => {
    try {
      const formData = new FormData();
      
      // Use manual values if "Other" was selected
      const finalBrand = addData.company === "other" ? addData.manual_company : addData.company;
      const finalModel = addData.model === "other" ? addData.manual_model : addData.model;

      // Basic Fields mapping
      const fields = {
        registeration_number: addData.registeration_number,
        vin: addData.vin,
        mileage: addData.mileage,
        engine: addData.engine,
        exterior_color: addData.exterior_color,
        drive_type: addData.drive_type,
        company: finalBrand,
        name: addData.name,
        model: finalModel,
        title: addData.title,
        price: addData.price,
        description: addData.description,
        year_made: addData.year_made,
        fuel_type: addData.fuelType,
        seat: addData.Seats,
        transmition_type: addData.transmitionType,
        location: addData.vehicleLocation,
        district: addData.vehicleDistrict
      };

      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });

      // Handle Files
      if (addData.image && addData.image.length > 0) {
        formData.append('image', addData.image[0]);
      }

      dispatch(setLoading(true));
      const toastId = toast.loading("Finalizing vehicle setup...");

      const res = await fetch("/api/admin/addProduct", {
        method: "POST",
        body: formData
      });

      const result = await res.json();
      toast.dismiss(toastId);

      if (res.ok) {
        dispatch(setadminAddVehicleSuccess(true));
        toast.success("New vehicle added to fleet!");
        reset();
        setPreviews({ image: null });
        navigate("/adminDashboard/allProduct");
      } else {
        toast.error(result.message || "Failed to add vehicle");
      }
    } catch (error) {
      dispatch(setadminCrudError(true));
      toast.error("Technical error during submission");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const InputWrapper = ({ label, children, icon: Icon, required }) => (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-bold text-slate-600 flex items-center gap-2 px-1">
        {Icon && <Icon className="text-emerald-500 text-lg" />}
        {label} {required && <span className="text-rose-500 font-black">*</span>}
      </label>
      {children}
    </div>
  );

  const SectionCard = ({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-emerald-50 rounded-2xl">
          <Icon className="text-2xl text-emerald-600" />
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );

  // Default common brands for immediate use
  const defaultBrands = ["Maruti Suzuki", "Toyota", "Honda", "Hyundai", "Tata Motors", "Mahindra", "Kia", "BMW", "Mercedes-Benz", "Audi"];
  const brandsToDisplay = companyData.length > 0 ? companyData : defaultBrands;

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 p-4 lg:p-10 font-sans">
      <Toaster position="bottom-right" richColors />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto flex justify-between items-center mb-10"
      >
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Fleet Registration</h1>
          <p className="text-slate-500 font-medium mt-1">Fill in the details to add a new premium ride.</p>
        </div>
        <button 
          onClick={() => navigate("/adminDashboard/allProduct")}
          className="p-4 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-3xl shadow-sm border border-slate-100 transition-all active:scale-95"
        >
          <IoMdClose size={24} />
        </button>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto space-y-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <SectionCard icon={RiCarLine} title="Vehicle Identity">
            <div className="space-y-6">
              <InputWrapper label="Brand" required>
                <div className="space-y-3">
                  <select {...register("company", { required: true })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                    <option value="">Select Brand</option>
                    {brandsToDisplay.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    <option value="other" className="text-emerald-600 font-bold">+ Other (Manual Entry)</option>
                  </select>
                  
                  {isOtherBrand && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <input 
                        {...register("manual_company", { required: isOtherBrand })} 
                        placeholder="Type Manufacturer Name..." 
                        className="w-full bg-emerald-50/30 border-2 border-emerald-100 rounded-2xl p-4 font-semibold text-emerald-800 outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-300"
                      />
                    </motion.div>
                  )}
                </div>
              </InputWrapper>
              
              <div className="grid grid-cols-2 gap-4">
                <InputWrapper label="Car Name" required>
                  <input {...register("name", { required: true })} placeholder="e.g. Innova" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-semibold outline-none focus:border-emerald-500 transition-all" />
                </InputWrapper>
                <InputWrapper label="Internal ID / Model" required>
                  <div className="space-y-3">
                    <select {...register("model", { required: true })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-semibold outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                      <option value="">Select ID</option>
                      {modelData.map((m, i) => <option key={i} value={m}>{m}</option>)}
                      <option value="other" className="text-emerald-600 font-bold">+ Other (Manual)</option>
                    </select>
                    
                    {isOtherModel && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <input 
                          {...register("manual_model", { required: isOtherModel })} 
                          placeholder="Type Model Name..." 
                          className="w-full bg-emerald-50/30 border-2 border-emerald-100 rounded-2xl p-4 font-semibold text-emerald-800 outline-none focus:border-emerald-500 transition-all"
                        />
                      </motion.div>
                    )}
                  </div>
                </InputWrapper>
              </div>

              <InputWrapper label="Public Catchphrase">
                <input {...register("title")} placeholder="Experience the Luxury" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-semibold outline-none focus:border-emerald-500 transition-all" />
              </InputWrapper>
            </div>
          </SectionCard>

          <SectionCard icon={RiSettings4Line} title="Technical Specs">
            <div className="grid grid-cols-2 gap-6">
              <InputWrapper label="Reg. Number" required>
                <input {...register("registeration_number", { required: true })} placeholder="KA-01-XXXX" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-semibold outline-none focus:border-emerald-500 transition-all uppercase" />
              </InputWrapper>
              <InputWrapper label="Model Year" required>
                <input type="number" {...register("year_made", { required: true })} placeholder="2024" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-semibold outline-none focus:border-emerald-500 transition-all" />
              </InputWrapper>
              <InputWrapper label="Fuel" required>
                <select {...register("fuelType", { required: true })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-semibold outline-none focus:border-emerald-500">
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </InputWrapper>
              <InputWrapper label="Transmission" required>
                <select {...register("transmitionType", { required: true })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-semibold outline-none focus:border-emerald-500">
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </InputWrapper>
            </div>
          </SectionCard>
        </div>

        <SectionCard icon={RiMapPinLine} title="Location & Pricing">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <InputWrapper label="Price / Day (₹)" required>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input type="number" {...register("price", { required: true })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-8 font-black text-emerald-600 outline-none focus:border-emerald-500 transition-all" />
              </div>
            </InputWrapper>
            <InputWrapper label="Seats" required>
              <select {...register("Seats", { required: true })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-semibold outline-none focus:border-emerald-500">
                <option value="5">5 Seats</option>
                <option value="7">7 Seats</option>
                <option value="8">8 Seats</option>
              </select>
            </InputWrapper>
            <InputWrapper label="State" required>
              <select {...register("vehicleState", { required: true })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-semibold outline-none focus:border-emerald-500">
                <option value="">Select State</option>
                {stateData.map((state, i) => <option key={i} value={state}>{state}</option>)}
              </select>
            </InputWrapper>
            <InputWrapper label="District" required>
              <select
                {...register("vehicleDistrict", { required: true })}
                disabled={!selectedState}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-semibold outline-none focus:border-emerald-500 disabled:opacity-60"
              >
                <option value="">{selectedState ? "Select District" : "Select State First"}</option>
                {filteredDistricts.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </InputWrapper>
            <InputWrapper label="Location" required>
              <select
                {...register("vehicleLocation", { required: true })}
                disabled={!selectedDistrict}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-semibold outline-none focus:border-emerald-500 disabled:opacity-60"
              >
                <option value="">{selectedDistrict ? "Select Pickup Hub" : "Select District First"}</option>
                {filteredLocations.map((l, i) => <option key={i} value={l}>{l}</option>)}
              </select>
            </InputWrapper>
          </div>
          <div className="mt-8">
            <InputWrapper label="Vehicle Overview">
              <textarea {...register("description")} rows={4} placeholder="Briefly describe the vehicle condition and highlights..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 font-medium outline-none focus:border-emerald-500 transition-all resize-none"></textarea>
            </InputWrapper>
          </div>
        </SectionCard>

        <SectionCard icon={RiFileTextLine} title="Vehicle Photo">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: 'image', label: 'Cover Photo' }
            ].map((f) => {
              const { onChange, ...rest } = register(f.id);
              return (
                <div key={f.id} className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">{f.label}</span>
                  <label className="relative aspect-[4/3] rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50 group hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300 overflow-hidden cursor-pointer shadow-sm block">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      {...rest}
                      onChange={(e) => {
                        onChange(e); 
                        handleFileChange(e, f.id); 
                      }}
                    />
                    {previews[f.id] ? (
                      <img src={previews[f.id]} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-emerald-500 text-center p-4">
                        <IoMdCloudUpload size={36} className="group-hover:scale-110 mb-2 transition-all" />
                        <span className="text-[11px] font-black">UPLOAD</span>
                      </div>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
          <div className="bg-white/90 backdrop-blur-3xl p-4 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.2)] border border-white/50 flex gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[3] bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-[1.8rem] shadow-xl transition-all active:scale-95 disabled:opacity-50 tracking-wider"
            >
              {loading ? "SAVING..." : "DEPLOY TO FLEET"}
            </button>
            <button 
              type="button"
              onClick={() => {
                reset();
                setPreviews({ image: null });
              }}
              className="flex-1 bg-slate-900 text-white font-black py-5 rounded-[1.8rem] hover:bg-black transition-all active:scale-95"
            >
              RESET
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductModal;
