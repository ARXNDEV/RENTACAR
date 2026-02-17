import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
} from "../redux/user/userSlice";
import { links } from "./UserSidebarContent";
import { showSidebarOrNot } from "../redux/adminSlices/adminDashboardSlice/DashboardSlice";
import { LuLogOut, LuTrash2, LuUser, LuChevronRight } from "react-icons/lu";

const UserProfileSidebar = () => {
  const { screenSize } = useSelector((state) => state.adminDashboardSlice);
  const { currentUser, isLoading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/user/signout`, { method: "GET", credentials: 'include' });
      if (res.ok) {
        localStorage.clear();
        dispatch(signOut());
        navigate("/signin");
      }
    } catch (error) {
      localStorage.clear();
      dispatch(signOut());
      navigate("/signin");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* User Identity Header */}
      <div className="px-5 pt-7 pb-5">
        <div className="flex items-center gap-3.5 bg-slate-50 rounded-2xl p-3.5">
          <div className="relative flex-shrink-0">
            {currentUser?.profilePicture ? (
              <img
                src={currentUser.profilePicture}
                alt="avatar"
                className="w-11 h-11 rounded-xl object-cover"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-100">
                <LuUser size={21} />
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-900 truncate leading-tight">
              {currentUser?.username || "Guest User"}
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Verified Member</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-slate-100 mb-5" />

      {/* Navigation Links */}
      <div className="flex-1 px-4 overflow-y-auto space-y-6">
        {links.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {group.title && (
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em] px-3 mb-2">
                {group.title}
              </p>
            )}
            {group.links.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 + i * 0.05 }}
              >
                <NavLink
                  to={`/profile/${link.name}`}
                  onClick={() => {
                    if (screenSize <= 900) dispatch(showSidebarOrNot(false));
                  }}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-200 group
                    ${isActive
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  <span className="text-[18px] flex-shrink-0">{link.icon}</span>
                  <span className="text-sm font-bold capitalize flex-1">{link.name}</span>
                  <LuChevronRight
                    size={14}
                    className="opacity-0 group-hover:opacity-40 transition-opacity -translate-x-1 group-hover:translate-x-0 transition-transform"
                  />
                </NavLink>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="px-4 pt-4 pb-6 mt-4 border-t border-slate-100 space-y-1">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em] px-3 mb-2">Account</p>

        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSignout}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all font-bold text-sm"
        >
          <LuLogOut size={18} />
          <span>Sign Out</span>
        </motion.button>

        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDelete}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-red-300 hover:bg-red-50 hover:text-red-400 transition-all font-bold text-sm"
        >
          <LuTrash2 size={18} />
          <span>{isLoading ? "Deleting..." : "Delete Account"}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default UserProfileSidebar;
