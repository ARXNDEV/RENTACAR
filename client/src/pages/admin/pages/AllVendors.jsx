import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, Avatar, Button } from "@mui/material";
import { Header } from "../components";
import { motion } from "framer-motion";
import { LuCheckCircle, LuXCircle } from "react-icons/lu";

const AllVendors = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch("/api/admin/allVendors");
        if (res.ok) {
          const data = await res.json();
          setVendors(data);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };
    fetchVendors();
  }, []);

  const columns = [
    {
      field: "profilePicture",
      headerName: "Vendor Name",
      width: 250,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <Avatar 
            src={params.value || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"} 
            sx={{ width: 40, height: 40, borderRadius: "12px" }} 
          />
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 tracking-tight">{params.row.username}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{params.row.email}</span>
          </div>
        </div>
      ),
    },
    { 
      field: "phoneNumber", 
      headerName: "Contact", 
      width: 150,
      valueGetter: (params) => params.value || "Not Provided"
    },
    {
      field: "address",
      headerName: "Location",
      width: 200,
      valueGetter: (params) => params.row.district || "Pending Verification"
    },
    {
      field: "isVendor",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Chip 
          label="Verified" 
          icon={<LuCheckCircle size={14} />}
          size="small" 
          sx={{ 
            background: "#ecfdf5", 
            color: "#10b981", 
            fontWeight: "900",
            fontSize: "10px",
            textTransform: "uppercase",
            border: "1px solid #d1fae5"
          }} 
        />
      ),
    },
    {
       field: "actions",
       headerName: "Management",
       width: 150,
       renderCell: (params) => (
         <div className="flex items-center gap-2">
           <Button 
             variant="text" 
             size="small"
             sx={{ color: "#64748b", "&:hover": { background: "#f1f5f9" } }}
           >
             Details
           </Button>
           <Button 
             variant="text" 
             size="small"
             sx={{ color: "#ef4444", "&:hover": { background: "#fef2f2" } }}
           >
             Disable
           </Button>
         </div>
       )
    }
  ];

  const rows = vendors.map((vendor) => ({
    id: vendor._id,
    ...vendor
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-10 space-y-8"
    >
      <div className="flex justify-between items-end">
        <Header title="All Vendors" />
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Vendors</span>
            <span className="text-xl font-black text-emerald-600">{vendors.length}</span>
          </div>
        </div>
      </div>

      <Box sx={{ 
        height: 600, 
        width: "100%", 
        background: "white", 
        borderRadius: "32px", 
        p: 4, 
        shadow: "sm",
        border: "1px solid #f1f5f9",
        overflow: "hidden"
      }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 8 } },
          }}
          pageSizeOptions={[8]}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeader": { background: "#f8fafc", borderBottom: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "1px solid #f8fafc" },
            "& .MuiDataGrid-row:hover": { background: "#f8fafc" },
          }}
        />
      </Box>
    </motion.div>
  );
};

export default AllVendors;