import { useDispatch, useSelector } from "react-redux";
import { toggleNavbarPage } from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../../redux/user/userSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "GET" });
      if (res.ok) {
        dispatch(signOut());
        navigate("/signin");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="absolute top-16 right-5 w-72 bg-white rounded-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-slate-100 p-6 z-50 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <p className="font-black text-slate-900 text-lg tracking-tight">Admin Profile</p>
        <button 
          className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          onClick={() => dispatch(toggleNavbarPage('userProfile'))}
        >
          ✕
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <img 
          src={currentUser?.profilePicture} 
          alt="profile" 
          className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-100" 
        />
        <div>
          <p className="font-black text-slate-900 leading-tight">{currentUser?.username}</p>
          <p className="text-xs font-bold text-slate-400">{currentUser?.email}</p>
        </div>
      </div>

      <div className="space-y-2 mt-4 pt-4 border-t border-slate-50">
        <button 
          onClick={() => {
            dispatch(toggleNavbarPage('userProfile'));
            navigate("/adminDashboard/profile");
          }}
          className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-green-600 transition-all"
        >
          My Personal Dashboard
        </button>
        <button 
          onClick={handleSignout}
          className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
