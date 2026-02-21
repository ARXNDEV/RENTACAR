import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Avatar, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { LuCalendar, LuMapPin, LuTrendingUp } from "react-icons/lu";

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/allBookings");
      const data = await res.json();
      if (data) setBookings(data);
    } catch (error) {
      console.error("Fetch bookings error:", error);
    }
  };

  const handleStatusChange = async (e, params) => {
    const newStatus = e.target.value;
    const bookingId = params.id;
    try {
      const res = await fetch("/api/admin/changeStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });
      if (res.ok) fetchBookings();
    } catch (error) {
      console.error("Status change error:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      tripCompleted: { bg: "#ecfdf5", text: "#10b981" },
      canceled: { bg: "#fef2f2", text: "#ef4444" },
      overDue: { bg: "#fff1f2", text: "#e11d48" },
      onTrip: { bg: "#eff6ff", text: "#3b82f6" },
      booked: { bg: "#fefce8", text: "#ca8a04" },
      default: { bg: "#f8fafc", text: "#64748b" }
    };
    return colors[status] || colors.default;
  };

  const columns = [
    {
      field: "image",
      headerName: "Vehicle",
      width: 250,
      renderCell: (params) => (
        <div className="flex items-center gap-3 py-2">
          <Avatar 
            src={params.value} 
            variant="rounded" 
            sx={{ width: 60, height: 40, borderRadius: "8px", border: "1px solid #f1f5f9" }} 
          />
          <div className="flex flex-col">
            <span className="font-bold text-slate-700 text-xs uppercase truncate w-32">{params.row.vehicleName}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: {params.row.id.slice(-6)}</span>
          </div>
        </div>
      ),
    },
    {
      field: "Trip",
      headerName: "Trip Details",
      width: 300,
      renderCell: (params) => (
        <div className="flex flex-col gap-1 py-2">
          <div className="flex items-center gap-2 text-slate-600">
            <LuMapPin size={12} className="text-slate-400" />
            <span className="text-[11px] font-bold">{params.row.Pickup_Location} → {params.row.Dropoff_Location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <LuCalendar size={12} />
            <span className="text-[10px] font-medium">{params.row.Pickup_Date.toLocaleDateString()} - {params.row.Dropoff_Date.toLocaleDateString()}</span>
          </div>
        </div>
      )
    },
    {
      field: "Vehicle_Status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        const colors = getStatusColor(params.value);
        return (
          <Chip 
            label={params.value} 
            size="small" 
            sx={{ 
              background: colors.bg, 
              color: colors.text, 
              fontWeight: "900", 
              fontSize: "10px", 
              textTransform: "uppercase" 
            }} 
          />
        );
      },
    },
    {
      field: "Change_Status",
      headerName: "Update Status",
      width: 180,
      renderCell: (params) => (
        <select
          className="bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-600 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200 transition-all cursor-pointer w-full"
          value={params.row.Vehicle_Status}
          onChange={(e) => handleStatusChange(e, params)}
        >
          {params.value.map((cur, idx) => (
            <option key={idx} value={cur}>
              {cur.replace(/([A-Z])/g, ' $1').trim()}
            </option>
          ))}
        </select>
      )
    },
  ];

  const rows = bookings?.map((cur) => ({
    id: cur._id,
    vehicleName: cur.vehicleDetails?.name || "Unknown",
    image: cur.vehicleDetails?.image?.[0] || "",
    Pickup_Location: cur.pickUpLocation,
    Pickup_Date: new Date(cur.pickupDate),
    Dropoff_Location: cur.dropOffLocation,
    Dropoff_Date: new Date(cur.dropOffDate),
    Vehicle_Status: cur.status,
    Change_Status: [
      "notBooked", "booked", "onTrip", "notPicked", "canceled", "overDue", "tripCompleted"
    ],
  })) || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden"
    >
      <Box sx={{ height: 600, width: "100%", p: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={80}
          initialState={{ pagination: { paginationModel: { pageSize: 8 } } }}
          pageSizeOptions={[8]}
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
    </motion.div>
  );
};

export default BookingsTable;
