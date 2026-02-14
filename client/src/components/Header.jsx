import { navLinks } from "../constants";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";
import { FaCarSide } from "react-icons/fa";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Detect scroll to switch navbar from transparent → frosted glass
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setNav(false); }, [location.pathname]);

  const renderAuthLinks = (isMobile = false) => {
    if (currentUser) {
      let dashboardPath = "/profile";
      if (currentUser.isAdmin) dashboardPath = "/adminDashboard";
      else if (currentUser.isVendor) dashboardPath = "/vendorDashboard";

      if (isMobile) {
        return (
          <Link
            to={dashboardPath}
            onClick={() => setNav(false)}
            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4"
          >
            <img
              src={currentUser.profilePicture}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-xl object-cover"
            />
            <div>
              <p className="text-sm font-bold text-gray-900">{currentUser.username}</p>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">
                {currentUser.isAdmin ? "Admin Panel" : currentUser.isVendor ? "Vendor Hub" : "View Profile"}
              </p>
            </div>
          </Link>
        );
      }

      return (
        <Link to={dashboardPath} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-1.5 shadow-sm hover:shadow-md transition-all duration-200">
          <img
            src={currentUser.profilePicture}
            alt="Profile"
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-lg object-cover"
          />
          <div className="flex flex-col items-start leading-tight">
            <span className="text-sm font-black text-gray-900">{currentUser.username?.split(" ")[0]}</span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              {currentUser.isAdmin ? "Admin" : currentUser.isVendor ? "Vendor" : "Member"}
            </span>
          </div>
        </Link>
      );
    }

    if (isMobile) {
      return (
        <div className="flex flex-col gap-3">
          <Link to="/signIn" onClick={() => setNav(false)}>
            <button className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:border-emerald-300 transition-colors">
              Sign In
            </button>
          </Link>
          <Link to="/signup" onClick={() => setNav(false)}>
            <button className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(34,197,94,0.3)]">
              Sign Up Free
            </button>
          </Link>
        </div>
      );
    }

    return (
      <>
        <Link to="/signIn">
          <button className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-[15px] font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:text-emerald-700 hover:shadow">
            Sign In
          </button>
        </Link>
        <Link to="/signup">
          <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(34,197,94,0.35)] transition-all duration-200 hover:from-emerald-600 hover:to-green-700 hover:shadow-[0_6px_20px_rgba(34,197,94,0.45)]">
            Sign Up
          </button>
        </Link>
      </>
    );
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-gray-100/60"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 lg:px-28 lg:py-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-[0_4px_14px_rgba(34,197,94,0.4)] transition-transform duration-300 group-hover:scale-105">
              <FaCarSide size={22} className="text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              Rent<span className="text-emerald-600">aRide</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.id}
                  to={link.path}
                  className={`relative px-5 py-2.5 text-[15px] font-semibold transition-colors duration-200 rounded-xl
                    ${isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/70"}`}
                >
                  {link.title}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-emerald-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {renderAuthLinks()}
          </div>

          <button
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white/80 text-gray-700 shadow-sm backdrop-blur transition hover:bg-gray-50"
            onClick={() => setNav(!nav)}
          >
            {nav ? <MdClose size={20} /> : <RxHamburgerMenu size={18} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {nav && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setNav(false)}
            />
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 z-50 h-full w-[78%] max-w-[360px] bg-white shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <Link to="/" onClick={() => setNav(false)} className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <FaCarSide size={14} className="text-white" />
                  </div>
                  <span className="text-lg font-extrabold text-gray-900">Rent<span className="text-emerald-600">aRide</span></span>
                </Link>
                <button onClick={() => setNav(false)} className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                  <MdClose size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-4 pt-6 flex-1">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setNav(false)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-semibold transition-colors duration-150
                          ${isActive ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        {link.title}
                        {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-gray-100">
                {renderAuthLinks(true)}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-[84px]" />
    </>
  );
}

export default Header;
