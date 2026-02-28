import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setEditData } from "../../../redux/adminSlices/actions";
import { Box, Avatar, Chip } from "@mui/material";
import { Header } from "../components";
import toast, { Toaster } from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import { LuPlus, LuSearch, LuExternalLink, LuTrendingUp } from "react-icons/lu";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { BiGasPump } from "react-icons/bi";
import { GiGearStickPattern } from "react-icons/gi";

import { showVehicles } from "../../../redux/user/listAllVehicleSlice";

function AllVehicles() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddVehicleClicked } = useSelector((state) => state.addVehicle);
  const [allVehicles, setVehicles] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/admin/showVehicles", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          setVehicles(data);
          dispatch(showVehicles(data));
        }
      } catch (error) {
        console.error("Fetch vehicles error:", error);
      }
    };
    fetchVehicles();
  }, [isAddVehicleClicked, dispatch]);

  const handleDelete = async (vehicle_id) => {
    try {
      setVehicles(prev => prev.filter((cur) => cur._id !== vehicle_id));
      const res = await fetch(`/api/admin/deleteVehicle/${vehicle_id}`, { method: "DELETE" });
      if (res.ok) toast.success("Vehicle deleted successfully");
    } catch (error) {
       toast.error("Error deleting vehicle");
    }
  };

  const handleEditVehicle = (vehicle_id) => {
    dispatch(setEditData({ _id: vehicle_id }));
    navigate(`/adminDashboard/editProducts?vehicle_id=${vehicle_id}`);
  };

  const columns = [
    {
      field: "vehicle",
      headerName: "Vehicle Details",
      width: 300,
      renderCell: (params) => (
        <div className="flex items-center gap-4 py-2">
          <Avatar 
            src={params.row.image} 
            variant="rounded" 
            sx={{ width: 60, height: 45, borderRadius: "12px", border: "1px solid #f1f5f9" }} 
          />
          <div className="flex flex-col">
            <span className="font-black text-slate-800 tracking-tight text-sm uppercase">{params.row.name}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{params.row.company} • {params.row.year}</span>
          </div>
        </div>
      )
    },
    { field: "registeration_number", headerName: "Reg. Number", width: 150 },
    { 
      field: "price", 
      headerName: "Pricing", 
      width: 140,
      renderCell: (params) => (
        <div className="flex flex-col">
          <span className="font-black text-emerald-600 text-sm">₹{params.value}</span>
          <span className="text-[10px] text-slate-400 font-bold">Standard Day</span>
        </div>
      )
    },
    {
       field: "specs",
       headerName: "Specifications",
       width: 250,
       renderCell: (params) => (
         <div className="flex gap-2">
           <Chip 
             icon={<BiGasPump size={12} />} 
             label={params.row.fuel_type} 
             size="small" 
             sx={{ background: "#f8fafc", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }} 
           />
           <Chip 
             icon={<GiGearStickPattern size={12} />} 
             label={params.row.transmission} 
             size="small" 
             sx={{ background: "#f8fafc", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }} 
           />
         </div>
       )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEditVehicle(params.row.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all active:scale-90"
          >
            <FiEdit2 size={18} />
          </button>
          <button 
            onClick={() => handleDelete(params.row.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
          >
            <FiTrash2 size={18} />
          </button>
          <button 
            className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all active:scale-90"
          >
            <LuExternalLink size={18} />
          </button>
        </div>
      )
    }
  ];

  const rows = allVehicles
    .filter(v => !v.isDeleted && v.isAdminApproved)
    .map(v => ({
      id: v._id,
      image: (v.image && v.image.length > 0) ? v.image[0] : "",
      registeration_number: v.registeration_number,
      company: v.company,
      name: v.name,
      year: v.year_made,
      price: v.price,
      transmission: v.transmition,
      fuel_type: v.fuel_type,
    }))
    .filter(row => {
      const s = searchText.toLowerCase();
      return (
        (row.name || "").toLowerCase().includes(s) ||
        (row.company || "").toLowerCase().includes(s) ||
        (row.registeration_number || "").toLowerCase().includes(s)
      );
    });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-10 space-y-10"
    >
      <Toaster position="top-right" />
      
      {/* Page Header Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-100">
        <div>
          <Header title="Fleet Management" />
          <p className="text-slate-500 font-medium text-sm mt-1 mx-5">Manage and track your primary vehicle inventory.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search ID, Name or Brand..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-11 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none w-[300px] shadow-sm transition-all shadow-slate-100"
            />
          </div>
          <button 
            onClick={() => navigate("/adminDashboard/addProduct")}
            className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <LuPlus size={18} />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Fleet</p>
               <h3 className="text-2xl font-black text-slate-900">{allVehicles.length}</h3>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 text-blue-500 group-hover:scale-110 transition-transform">
               <LuTrendingUp size={24} />
            </div>
         </div>
      </div>

      {/* Data Grid Section */}
      <Box sx={{ 
        height: 650, 
        width: "100%", 
        background: "white", 
        borderRadius: "32px", 
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        overflow: "hidden",
        p: 2
      }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={80}
          initialState={{ pagination: { paginationModel: { pageSize: 6 } } }}
          pageSizeOptions={[6, 12, 24]}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": { background: "#f8fafc", borderBottom: "none", borderRadius: "16px" },
            "& .MuiDataGrid-columnHeaderTitle": { fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b" },
            "& .MuiDataGrid-cell": { borderBottom: "1px solid #f8fafc", fontSize: "13px", fontWeight: "600", color: "#1e293b" },
            "& .MuiDataGrid-row:hover": { background: "#f8fafc" },
          }}
        />
      </Box>
    </motion.div>
  );
}

export default AllVehicles;
