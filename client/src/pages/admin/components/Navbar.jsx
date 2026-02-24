import { useDispatch, useSelector } from "react-redux";
import {
  openPages,
  setScreenSize,
  showSidebarOrNot,
  toggleSidebar,
} from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice";
import { LuMenu, LuMessageSquare, LuBell, LuChevronDown, LuSearch } from "react-icons/lu";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import {  Chat, Notification, UserProfile } from ".";
import { useEffect } from "react";
import PropTypes from "prop-types";

const Navbar = () => {
  const dispatch = useDispatch();
  const {  chat, notification, userProfile, screenSize } = useSelector(
    (state) => state.adminDashboardSlice
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const handleResize = () => dispatch(setScreenSize(window.innerWidth));
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      dispatch(showSidebarOrNot(false));
    } else {
      dispatch(showSidebarOrNot(true));
    }
  }, [screenSize]);

  const NavButton = ({ title, customFunc, icon, dotColor }) => (
    <TooltipComponent content={title} position={"BottomCenter"}>
      <button
        type="button"
        onClick={customFunc}
        className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 active:scale-95"
      >
        {dotColor && (
          <span
            className={`absolute inline-flex rounded-full right-2.5 top-2.5 h-2 w-2 border-2 border-white ${dotColor}`}
          ></span>
        )}
        <span className="text-xl">{icon}</span>
      </button>
    </TooltipComponent>
  );

  return (
    <div className="flex justify-between items-center px-6 py-3 relative">
      <div className="flex items-center gap-4">
        <NavButton
          title="Toggle Sidebar"
          customFunc={() => dispatch(toggleSidebar())}
          icon={<LuMenu />}
        />
        
        <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl w-80 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
          <LuSearch className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search analytics..." 
            className="bg-transparent border-none text-sm font-medium focus:ring-0 w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NavButton
          title="Messages"
          customFunc={() => dispatch(openPages("chat"))}
          dotColor="bg-emerald-500"
          icon={<LuMessageSquare />}
        />

        <NavButton
          title="Notifications"
          customFunc={() => dispatch(openPages("notification"))}
          dotColor="bg-amber-500"
          icon={<LuBell />}
        />

        <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block"></div>

        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-50 rounded-2xl transition-all group"
            onClick={() => dispatch(openPages("userProfile"))}
          >
            <div className="relative">
              <img
                className="rounded-xl h-9 w-9 object-cover border-2 border-white shadow-sm"
                src={currentUser?.profilePicture}
                alt="admin-profile"
              />
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-black text-slate-900 leading-none mb-1">
                {currentUser?.username}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Master Admin
              </p>
            </div>
            <LuChevronDown className="text-slate-400 group-hover:text-slate-900 transition-colors hidden sm:block" />
          </div>
        </TooltipComponent>

        {chat && <Chat />}
        {notification && <Notification />}
        {userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
