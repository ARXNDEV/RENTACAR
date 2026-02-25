import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { links } from "../data/SidebarContents.jsx";
import { LuHome, LuLogOut, LuChevronLeft } from "react-icons/lu";
import { FaCarSide } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../../redux/user/userSlice.jsx";
import { showSidebarOrNot } from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice.jsx";
import { motion } from "framer-motion";

const SideBar = () => {
  const { activeMenu, screenSize } = useSelector(
    (state) => state.adminDashboardSlice
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeLink =
    "flex items-center gap-4 pl-4 pt-3 pb-3 rounded-2xl text-emerald-600 bg-emerald-50 font-bold text-sm transition-all duration-200 shadow-sm shadow-emerald-100/50";
  const normalLink =
    "flex items-center gap-4 pl-4 pt-3 pb-3 rounded-2xl text-sm text-slate-500 font-semibold hover:text-slate-900 hover:bg-slate-50 transition-all duration-200";

  //SignOut
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "GET",
      });
      if (res.ok) {
        dispatch(signOut());
        navigate("/signin");
      }
    } catch (error) {
      console.error("Signout error:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {activeMenu && (
        <>
          {/* Sidebar Header */}
          <div className="px-6 py-8 flex justify-between items-center">
            <Link
              to={`/adminDashboard`}
              className="flex items-center gap-3 group"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-200 transition-transform group-hover:scale-105">
                <FaCarSide size={20} className="text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">
                Rent<span className="text-emerald-600">aRide</span>
              </span>
            </Link>
            
            <button
              className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors lg:hidden"
              onClick={() => dispatch(showSidebarOrNot(false))}
            >
              <LuChevronLeft size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
            <div className="mb-6">
               <Link 
                 to="/"
                 className="flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100 shadow-sm"
               >
                 <LuHome size={18} />
                 <span>Main Website</span>
               </Link>
            </div>

            <div className="space-y-8">
              {links.map((cur, idx) => (
                <div key={idx}>
                  <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    {cur.title}
                  </p>
                  <div className="space-y-1">
                    {cur.links.map((link) => (
                      <NavLink
                        to={`/adminDashboard/${link.name}`}
                        key={link.name}
                        onClick={() => {
                          if (screenSize <= 900 && activeMenu) {
                            dispatch(showSidebarOrNot(false));
                          }
                        }}
                        className={({ isActive }) =>
                          isActive ? activeLink : normalLink
                        }
                      >
                        <span className="text-lg">{link.icon}</span>
                        <span className="capitalize">{link.name.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 mt-auto border-t border-slate-50">
            <button
              type="button"
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-200"
              onClick={handleSignout}
            >
              <LuLogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
