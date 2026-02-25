import { useDispatch } from "react-redux";
import { toggleNavbarPage } from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice";
import { FaCar, FaRegEnvelopeOpen, FaRegBell } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { MdOutlineClose } from "react-icons/md";

const Notification = () => {
  const dispatch = useDispatch();

  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg absolute top-2 right-4 w-[320px] md:w-[500px] bg-white rounded-xl shadow-sm border border-slate-200 p-6 z-50">
      {/* Top Header & Title */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            Notifications
          </h2>
          <p className="text-xs text-gray-500 mt-1">Stay updated with your rental alerts.</p>
        </div>
        <button
          className="text-gray-500 hover:bg-slate-100 dark:hover:bg-gray-700 p-1.5 rounded-md transition-colors"
          onClick={() => dispatch(toggleNavbarPage('notification'))}
        >
          <MdOutlineClose size={18} />
        </button>
      </div>

      {/* Streamlined Stats - Compact Horizontal Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-800 p-2 border border-slate-100 dark:border-gray-700 rounded-md">
          <FaRegBell className="text-blue-600" size={14} />
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Total</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight">0</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-800 p-2 border border-slate-100 dark:border-gray-700 rounded-md">
          <FaRegEnvelopeOpen className="text-blue-600" size={14} />
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Unread</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight">0</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-800 p-2 border border-slate-100 dark:border-gray-700 rounded-md">
          <FaRegBell className="text-gray-400" size={14} />
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Read</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight">0</p>
          </div>
        </div>
      </div>

      {/* Horizontal Filter Bar */}
      <div className="flex flex-row items-center gap-3 mb-6 bg-slate-50 dark:bg-gray-800 p-3 rounded-lg border border-slate-200 dark:border-gray-700">
        <FiFilter className="text-gray-400 flex-shrink-0" size={16} />
        <div className="grid grid-cols-3 gap-3 w-full">
          <select className="w-full bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-xs rounded p-1.5 focus:outline-none focus:border-blue-500 transition-colors">
            <option value="all">All Types</option>
            <option value="booking">Booking Updates</option>
            <option value="maintenance">Vehicle Maintenance</option>
            <option value="payment">Payment Receipts</option>
            <option value="late">Late Returns</option>
          </select>
          <select className="w-full bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-xs rounded p-1.5 focus:outline-none focus:border-blue-500 transition-colors">
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <input
            type="text"
            placeholder="Vehicle ID..."
            className="w-full bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-xs rounded p-1.5 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-400"
          />
        </div>
      </div>

      {/* Notification History - Empty State */}
      <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-200 dark:border-gray-700 rounded-lg bg-slate-50 dark:bg-gray-800/50">
        <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
          <FaCar className="text-blue-500 dark:text-blue-400" size={24} />
        </div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">No alerts yet</p>
        <p className="text-xs text-gray-500 mt-1">Your rental alerts will appear here.</p>
      </div>
      
      {/* Bottom Action */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-gray-700 text-center">
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          Mark all as read
        </button>
      </div>
    </div>
  );
};

export default Notification;
