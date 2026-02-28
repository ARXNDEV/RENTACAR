import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, Avatar } from "@mui/material";
import { Header } from "../components";
import { motion } from "framer-motion";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/allUsers");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    {
      field: "profilePicture",
      headerName: "User",
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <Avatar src={params.value} sx={{ width: 32, height: 32 }} />
          <span className="font-medium text-slate-700">{params.row.username}</span>
        </div>
      ),
    },
    { field: "email", headerName: "Email", width: 250 },
    { 
      field: "phoneNumber", 
      headerName: "Phone", 
      width: 150,
      valueGetter: (params) => params.value || "N/A"
    },
    {
      field: "isUser",
      headerName: "Role",
      width: 120,
      renderCell: () => (
        <Chip label="User" size="small" sx={{ background: "#eff6ff", color: "#3b82f6", fontWeight: "bold" }} />
      ),
    },
    {
      field: "createdAt",
      headerName: "Member Since",
      width: 180,
      valueGetter: (params) => new Date(params.row.createdAt || Date.now()).toLocaleDateString()
    }
  ];

  const rows = users.map((user) => ({
    id: user._id,
    ...user
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-10"
    >
      <Header title="All Users" />
      <Box sx={{ height: 600, width: "100%", mt: 4, background: "white", borderRadius: "20px", p: 4, shadow: "sm" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 8 },
            },
          }}
          pageSizeOptions={[8]}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnSeparator": { display: "none" },
            "& .MuiDataGrid-row:hover": { background: "#f8fafc" },
          }}
        />
      </Box>
    </motion.div>
  );
};

export default AllUsers;