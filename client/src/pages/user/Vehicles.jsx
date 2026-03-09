import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setVariants,
  setVehicleDetail,
  showVehicles,
} from "../../redux/user/listAllVehicleSlice";
import { setFilteredData } from "../../redux/user/sortfilterSlice";
import { FaCarSide } from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Filter from "../../components/Filter";
import Sort from "../../components/Sort";
import { signOut } from "../../redux/user/userSlice";
import Footers from "../../components/Footer";
import SkeletonLoader from "../../components/ui/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { isVehicleVisible } from "../../components/utils/vehicleFlags";

//use Custome hook in this case :)
export const onVehicleDetail = async (id, dispatch, navigate, isBooking = false) => {
  try {
    const res = await fetch("/api/user/showVehicleDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });
    
    const data = await res.json();

    if (!res.ok || data.success === false) {
      if (data.statusCode === 401 || data.statusCode === 403) {
        dispatch(signOut());
        navigate("/signin");
      }
      toast.error(data.message || "Mobility profile synchronization failed.");
      return;
    }
   
    dispatch(setVehicleDetail(data));
    if (isBooking) {
      navigate("/checkoutPage");
    } else {
      navigate("/vehicleDetails");
    }
  } catch (error) {
    console.error("Vehicle Detail Error:", error);
    toast.error("Handshake with mobility hub interrupted.");
  }
};

const Vehicles = () => {
  const { userAllVehicles } = useSelector((state) => state.userListVehicles);
  const { data, filterdData } = useSelector((state) => state.sortfilterSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading , setIsLoading] = useState(true)

  //allVariants are set to null when we enter AllVehicles from navbar

  let refreshToken = localStorage.getItem('refreshToken')
  let accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    dispatch(setVariants(null));
    dispatch(setFilteredData(null));
    const fetchData = async () => {
      try {
        const res = await fetch("/api/user/listAllVehicles", {
          headers: {
            'Authorization': `Bearer ${refreshToken},${accessToken}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          dispatch(showVehicles(data));
        } else {
          toast.error("Unable to load vehicles right now.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Unable to load vehicles right now.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, refreshToken, accessToken]);

  return (
    <>
    <div className="lg:grid lg:grid-cols-12 gap-x-10 lg:mx-28 justify-between">
      <div className="mt-10 col-span-3 lg:relative box-shadow-xl lg:drop-shadow-xl">
        <Filter />
      </div>
      <div className="col-span-9">
        <div className="mt-10 bg-blend-overlay backdrop-blur-xl opacity-1 box-shadow-xl top-5 z-40 drop-shadow-lg">
          <Sort />
        </div>
 
        {isLoading ? (
          <div className="mt-10">
            <SkeletonLoader />
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex sm:flex-row w-full lg:grid lg:max-w-[1000px] lg:grid-cols-3 justify-center items-center gap-6 flex-wrap mt-8 px-4 pb-20"
          >
            <AnimatePresence mode="popLayout">
              {(filterdData !== null ? filterdData : userAllVehicles)?.map((cur, idx) => (
                isVehicleVisible(cur) && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_50px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(34,197,94,0.15)] group transition-all duration-500 w-full max-w-[320px] border border-slate-50"
                    key={cur._id || idx}
                  >
                    <div className="relative h-64 overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                      <img
                        src={`${(cur.image && cur.image.length > 0) ? cur.image[0] : ''}`}
                        alt={cur.name}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-green-600 shadow-sm border border-green-50 uppercase tracking-widest">
                        {cur.car_type}
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-slate-800 capitalize leading-tight group-hover:text-green-600 transition-colors">
                            {cur.name}
                          </h2>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{cur.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-900 leading-none">₹{cur.price}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Per Day</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 rounded-2xl">
                          <MdAirlineSeatReclineNormal className="text-slate-400" size={18} />
                          <span className="text-xs font-bold text-slate-600">{cur.seats} Seats</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 rounded-2xl">
                          <BsFillFuelPumpFill className="text-slate-400" size={16} />
                          <span className="text-xs font-bold text-slate-600 capitalize">{cur.fuel_type}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 rounded-2xl col-span-2">
                          <FaCarSide className="text-slate-400" size={18} />
                          <span className="text-xs font-bold text-slate-600 capitalize">{cur.transmition} Transmission</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-green-100 transition-all text-xs active:scale-95"
                          onClick={() => onVehicleDetail(cur._id, dispatch, navigate, true)}
                        >
                          Book Ride
                        </button>
                        <button
                          className="px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all text-xs active:scale-95"
                          onClick={() => onVehicleDetail(cur._id, dispatch, navigate, false)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
            
            {filterdData && filterdData.length === 0 && (
              <div className="col-span-3 text-center py-20 w-full">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <FaCarSide size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">No vehicles matching your search</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">We couldn't find any cars in our fleet that match those specific filters.</p>
                <button 
                   onClick={() => dispatch(setFilteredData(null))}
                   className="mt-8 text-green-600 font-bold text-sm underline hover:text-green-700 decoration-2 underline-offset-4"
                >
                  View All Cars
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
    <Footers/>
    </>
  );
};

export default Vehicles;
