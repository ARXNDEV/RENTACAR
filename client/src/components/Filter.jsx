import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import { GoPlus } from "react-icons/go";
import { setFilteredData } from "../redux/user/sortfilterSlice";

const Filter = () => {
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      SUV: false,
      Sedan: false,
      Hatchback: false,
      automatic: false,
      manual: false
    }
  });
  
  const { userAllVehicles, allVariants } = useSelector((state) => state.userListVehicles);
  const { variantMode } = useSelector((state) => state.sortfilterSlice);
  const [filterOpen, setFilterOpen] = useState(true); // Default open for better desktop UX
  const [isFiltering, setIsFiltering] = useState(false);
  const dispatch = useDispatch();
  const watchedValues = watch();

  useEffect(() => {
    handleData(watchedValues);
  }, [JSON.stringify(watchedValues)]);

  const handleData = async (data) => {
    setIsFiltering(true);
    const typeMapping = {
      SUV: "car_type",
      Sedan: "car_type",
      Hatchback: "car_type",
      automatic: "transmition",
      manual: "transmition",
    };

    const transformedData = Object.entries(data)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => ({ [key]: value, type: typeMapping[key] }));

    if (transformedData.length <= 0) {
      dispatch(setFilteredData(null));
      setIsFiltering(false);
    } else {
      try {
        const res = await fetch(`/api/user/filterVehicles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transformedData),
        });

        if (res.ok) {
          const result = await res.json();
          const filtData = result.data.filteredVehicles;

          if (allVariants) {
            const filteredData = filtData.filter((d) =>
              allVariants.some((variant) => variant._id === d._id)
            );
            dispatch(setFilteredData(filteredData));
            return;
          }
          dispatch(setFilteredData(filtData));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsFiltering(false);
      }
    }
  };

  const clearFilters = () => {
    reset();
    dispatch(setFilteredData(userAllVehicles));
  };

  const containerVariants = {
    open: { 
      height: "auto", 
      opacity: 1,
      transition: { 
        height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.25, delay: 0.05 },
        staggerChildren: 0.1
      }
    },
    closed: { 
      height: 0, 
      opacity: 0,
      transition: { 
        height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.2 }
      }
    }
  };

  const itemVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -20, opacity: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white sticky top-5 rounded-[2.5rem] border border-slate-50 overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] pb-4"
    >
      <div className="flex flex-col">
        <div 
          className="flex items-center justify-between px-8 py-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-green-500 rounded-full" />
             <h2 className="text-xl font-bold text-slate-900 tracking-tight">Refine Fleet</h2>
          </div>
          <motion.div
            animate={{ rotate: filterOpen ? 45 : 0 }}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400"
          >
            <GoPlus size={22} />
          </motion.div>
        </div>

        <AnimatePresence initial={false}>
          {filterOpen && (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="overflow-hidden"
            >
              <div className="px-8 pb-8 pt-2">
                <form onSubmit={handleSubmit(handleData)}>
                  <motion.div variants={itemVariants} className="mb-10">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">01.</span>
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Body Style</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {['SUV', 'Sedan', 'Hatchback'].map((type) => (
                        <div key={type} className="group flex items-center hover:translate-x-1 transition-transform">
                          <Controller
                            name={type}
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                {...field}
                                checked={field.value ?? false}
                                sx={{ 
                                  padding: '8px',
                                  color: '#e2e8f0', 
                                  '&.Mui-checked': { color: '#22c55e' },
                                  '&:hover': { backgroundColor: '#f8fafc' }
                                }}
                              />
                            )}
                          />
                          <span className="text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors">{type}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-10 pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">02.</span>
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Control Type</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {['automatic', 'manual'].map((trans) => (
                        <div key={trans} className="group flex items-center hover:translate-x-1 transition-transform">
                          <Controller
                            name={trans}
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                {...field}
                                checked={field.value ?? false}
                                sx={{ 
                                  padding: '8px',
                                  color: '#e2e8f0', 
                                  '&.Mui-checked': { color: '#22c55e' },
                                  '&:hover': { backgroundColor: '#f8fafc' }
                                }}
                              />
                            )}
                          />
                          <span className="text-sm font-bold text-slate-500 group-hover:text-slate-800 capitalize transition-colors">{trans}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-3xl font-black text-xs uppercase tracking-widest transition-all text-slate-600 active:scale-95"
                    >
                      Reset all filters
                    </button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Filter;
