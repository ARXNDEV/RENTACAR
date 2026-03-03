import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, TextField, Button, Avatar, Chip, Paper } from "@mui/material";
import { Header } from "../components";
import { motion, AnimatePresence } from "framer-motion";
import { LuPlus, LuMapPin, LuTrash2, LuNavigation, LuInfo, LuDatabase, LuGlobe } from "react-icons/lu";
import toast, { Toaster } from "react-hot-toast";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [newState, setNewState] = useState("");
  const [newRegion, setNewRegion] = useState("");
  const [newHub, setNewHub] = useState("");
  const [loading, setLoading] = useState(false);
  const [seedingIndia, setSeedingIndia] = useState(false);

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/admin/getVehicleModels");
      if (res.ok) {
        const data = await res.json();
        setLocations(data.filter((item) => item.type === "location"));
      }
    } catch (error) {
      console.error("Fetch locations error:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newState || !newRegion || !newHub) return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/addMasterData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "location",
          state: newState,
          district: newRegion,
          location: newHub,
        }),
      });

      if (res.ok) {
        toast.success("New Pick-up Hub added!");
        setNewState("");
        setNewRegion("");
        setNewHub("");
        fetchLocations();
      } else {
        const result = await res.json();
        toast.error(result.message || "Failed to add location");
      }
    } catch (error) {
      toast.error("Failed to add location");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/deleteMasterData/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Location removed");
        fetchLocations();
      }
    } catch (error) {
      toast.error("Error deleting location");
    }
  };

  const handleSeedIndiaLocations = async () => {
    try {
      setSeedingIndia(true);
      const res = await fetch("/api/admin/seedIndiaLocations", {
        method: "POST",
      });
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "India location catalog imported");
        fetchLocations();
      } else {
        toast.error(result.message || "Could not import India location catalog");
      }
    } catch (error) {
      toast.error("Could not import India location catalog");
    } finally {
      setSeedingIndia(false);
    }
  };

  const columns = [
    {
      field: "state",
      headerName: "State",
      width: 240,
      renderCell: (params) => (
        <div className="flex items-center gap-3 py-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <LuGlobe size={18} />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">{params.value}</span>
        </div>
      ),
    },
    {
      field: "district",
      headerName: "Region",
      width: 250,
      renderCell: (params) => (
        <div className="flex items-center gap-3 py-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <LuNavigation size={18} />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">{params.value}</span>
        </div>
      ),
    },
    {
      field: "location",
      headerName: "Pick-up Hub",
      width: 350,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <LuMapPin size={16} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-600">{params.value}</span>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Delete",
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => handleDelete(params.row.id)}
          className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
        >
          <LuTrash2 size={18} />
        </button>
      ),
    },
  ];

  const rows = locations.map((loc, index) => ({
    id: loc.id || index,
    ...loc,
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-10 space-y-10"
    >
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-end">
        <div>
          <Header title="Region & Hubs" />
          <p className="text-slate-500 font-medium text-sm mt-1 mx-5">Define the operational zones and pick-up locations for your fleet.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSeedIndiaLocations}
            disabled={seedingIndia}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-[2rem] flex items-center gap-3 shadow-sm text-[10px] font-black uppercase tracking-widest disabled:opacity-60"
          >
            <LuDatabase size={16} />
            {seedingIndia ? "Importing..." : "Import India Districts"}
          </button>
          <div className="bg-white border border-slate-100 px-6 py-3 rounded-[2rem] flex items-center gap-3 shadow-sm">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rows.length} Active Hubs</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Add Location Form */}
        <div className="lg:col-span-1 space-y-6">
          <Paper className="p-8 rounded-[2rem] border-none shadow-xl shadow-slate-100">
             <h3 className="text-lg font-black text-slate-900 mb-6">Register New Hub</h3>
             <form onSubmit={handleAddLocation} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Karnataka"
                     value={newState}
                     onChange={(e) => setNewState(e.target.value)}
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-50 focus:bg-white outline-none transition-all shadow-inner"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Region (District)</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Kochi, Bangalore"
                     value={newRegion}
                     onChange={(e) => setNewRegion(e.target.value)}
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-50 focus:bg-white outline-none transition-all shadow-inner"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pick-up Hub Name</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Airport, Railway Station"
                     value={newHub}
                     onChange={(e) => setNewHub(e.target.value)}
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-50 focus:bg-white outline-none transition-all shadow-inner"
                   />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-3 mt-4"
                >
                  <LuPlus size={18} />
                  {loading ? "Registering..." : "Add Location"}
                </button>
             </form>
          </Paper>

          <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
             <LuNavigation size={120} className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform" />
             <h4 className="text-xl font-black mb-2 relative z-10">Smart Expansion</h4>
             <p className="text-emerald-100 text-xs font-medium relative z-10 leading-relaxed mb-6">Adding more regions increases your platform's availability and user engagement.</p>
             <div className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-emerald-700/30 w-fit px-3 py-1 rounded-full">
                <LuInfo size={12} />
                Import India Catalog
             </div>
          </div>
        </div>

        {/* Right: Hubs Table */}
        <div className="lg:col-span-2">
          <Paper className="p-2 rounded-[2rem] border-none shadow-xl shadow-slate-100 overflow-hidden">
             <Box sx={{ height: 600, width: "100%", p: 2 }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  rowHeight={70}
                  initialState={{ pagination: { paginationModel: { pageSize: 8 } } }}
                  disableRowSelectionOnClick
                  sx={{
                    border: "none",
                    "& .MuiDataGrid-columnHeaders": { background: "#f8fafc", borderBottom: "none", borderRadius: "16px" },
                    "& .MuiDataGrid-columnHeaderTitle": { fontSize: "10px", fontWeight: "900", textTransform: "uppercase", color: "#64748b" },
                    "& .MuiDataGrid-cell": { borderBottom: "1px solid #f8fafc" },
                    "& .MuiDataGrid-row:hover": { background: "#f8fafc" },
                  }}
                />
             </Box>
          </Paper>
        </div>
      </div>
    </motion.div>
  );
};

export default Locations;
