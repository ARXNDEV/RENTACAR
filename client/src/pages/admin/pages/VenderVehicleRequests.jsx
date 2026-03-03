import { GrStatusGood } from "react-icons/gr";
import { MdOutlinePending } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Button, Box, Chip, Avatar, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import { setUpdateRequestTable, setVenodrVehilces, setadminVenodrRequest } from "../../../redux/vendor/vendorDashboardSlice";
import { Header } from "../components";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const VenderVehicleRequests = () => {
  const { adminVenodrRequest } = useSelector((state) => state.vendorDashboardSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVendorRequest = async () => {
      try {
        const res = await fetch(`/api/admin/fetchVendorVehilceRequests`);
        if (res.ok) {
          const data = await res.json();
          dispatch(setVenodrVehilces(data));
          dispatch(setadminVenodrRequest(data));
        }
      } catch (error) {
        console.error("Fetch requests error:", error);
      }
    };
    fetchVendorRequest();
  }, [dispatch]);

  const handleApproveRequest = async (id) => {
    try {
      const res = await fetch("/api/admin/approveVendorVehicleRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (res.ok) {
        toast.success("Vehicle approved and listed!", { icon: '🚀' });
        dispatch(setUpdateRequestTable(id));
      }
    } catch (error) {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch("/api/admin/rejectVendorVehicleRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (res.ok) {
        toast.success("Request rejected");
        dispatch(setUpdateRequestTable(id));
      }
    } catch (error) {
      toast.error("Rejection failed");
    }
  };

  const columns = [
    {
      field: "vehicle",
      headerName: "Vehicle",
      width: 250,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <Avatar 
            src={params.row.image} 
            variant="rounded" 
            sx={{ width: 50, height: 35, borderRadius: "8px" }} 
          />
          <div className="flex flex-col">
            <span className="font-bold text-slate-700 text-xs uppercase">{params.row.name}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{params.row.company}</span>
          </div>
        </div>
      ),
    },
    { field: "registeration_number", headerName: "Reg. Number", width: 150 },
    {
      field: "status",
      headerName: "Current Status",
      width: 150,
      renderCell: () => (
        <Chip 
          label="Pending Approval" 
          size="small" 
          icon={<MdOutlinePending />}
          sx={{ background: "#fff7ed", color: "#f97316", fontWeight: "900", fontSize: "10px", border: "1px solid #ffedd5" }} 
        />
      ),
    },
    {
      field: "actions",
      headerName: "Action Required",
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-3">
          <Tooltip title="Approve Vehicle">
            <button
              onClick={() => handleApproveRequest(params.row.id)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center gap-2"
            >
              <GrStatusGood />
              <span className="text-[10px] font-black uppercase">Approve</span>
            </button>
          </Tooltip>
          <Tooltip title="Reject Request">
            <button
              onClick={() => handleReject(params.row.id)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <IoIosCloseCircle size={24} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const rows = (adminVenodrRequest || [])
    .filter((v) => !v.isDeleted && !v.isAdminApproved && !v.isRejected)
    .map((v) => ({
      id: v._id,
      image: (v.image && v.image.length > 0) ? v.image[0] : "",
      registeration_number: v.registeration_number,
      company: v.company,
      name: v.name,
    }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-10 space-y-8"
    >
      <Toaster position="bottom-center" />
      <div className="flex justify-between items-end">
        <div>
          <Header title="Vendor Requests" />
          <p className="text-slate-500 font-medium text-sm mt-1 mx-5">Review and approve vehicles submitted by your vendor network.</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 px-6 py-3 rounded-[2rem] flex items-center gap-3">
           <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
           <span className="text-xs font-black text-amber-700 uppercase tracking-widest">{rows.length} Action Items</span>
        </div>
      </div>

      <Box sx={{ 
        height: 600, 
        width: "100%", 
        background: "white", 
        borderRadius: "32px", 
        p: 2,
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)"
      }}>
        <AnimatePresence mode="wait">
          {rows.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4"
            >
              <div className="p-6 bg-slate-50 rounded-full">
                 <GrStatusGood size={48} className="text-slate-200" />
              </div>
              <p className="font-bold uppercase tracking-widest text-[10px]">Everything Caught Up!</p>
            </motion.div>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              rowHeight={70}
              initialState={{ pagination: { paginationModel: { pageSize: 8 } } }}
              disableRowSelectionOnClick
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": { background: "#f8fafc", borderBottom: "none" },
                "& .MuiDataGrid-cell": { borderBottom: "1px solid #f8fafc" },
                "& .MuiDataGrid-row:hover": { background: "#fffbeb" },
              }}
            />
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
};

export default VenderVehicleRequests;
