import styles from "../../index";
import Herocar from "../../Assets/homepage_car_copy.jpeg";
import CarSearch from "./CarSearch";
import LatestFleet from "./LatestFleet";
import { HeroParallax } from "../../components/ui/Paralax";
import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { LuMapPin, LuCalendarCheck, LuCar, LuShieldCheck, LuArrowRight, LuUser, LuZap } from "react-icons/lu";
import { FaMapMarkedAlt, FaCalendarCheck, FaCarSide, FaCheckCircle, FaArrowRight } from "react-icons/fa";

import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsSweetAlert } from "../../redux/user/userSlice";
import Footers from "../../components/Footer";

function Home() {
  const ref = useRef(null);
  const heroRef = useRef(null);
  const { isSweetAlert } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

  useEffect(() => {
    if (isSweetAlert) {
      Swal.fire({
        title: "Booking Confirmed",
        text: "Your mobility session has been successfully locked.",
        icon: "success",
        showDenyButton: true,
        confirmButtonText: "Back to Home",
        confirmButtonColor: "#22c55e",
        denyButtonColor: 'black',
        denyButtonText: `View Orders`,
      }).then((result) => {
        if (result.isConfirmed) navigate('/');
        else if (result.isDenied) navigate('/profile/orders');
      });
      dispatch(setIsSweetAlert(false));
    }
  }, [isSweetAlert, dispatch, navigate]);

  const heroTextVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
  };
  
  const heroItemVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-[#fbfcfd] min-h-screen overflow-x-hidden">

      <div className="relative w-full mx-auto sm:max-w-[1500px]">
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative min-h-[90vh] flex items-center px-6 lg:px-28 pb-32 pt-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full z-10">
            <motion.div
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={heroItemVariant} className="flex items-center gap-2 mb-6">
                 <span className="bg-green-500/10 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-green-100 flex items-center gap-2">
                    <LuZap size={14} className="animate-pulse" /> Trending in 2026
                 </span>
              </motion.div>
              
              <motion.p variants={heroItemVariant} className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-4">
                Redefining Mobility
              </motion.p>
              
              <motion.h1
                variants={heroItemVariant}
                className="text-5xl md:text-7xl lg:text-[84px] font-black leading-[1.05] tracking-tighter text-slate-900 mb-8"
              >
                Save <motion.span 
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 bg-[length:200%_auto] bg-clip-text text-transparent"
                >big</motion.span> with our premium fleet
              </motion.h1>
              
              <motion.p variants={heroItemVariant} className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-12">
                Unbeatable prices meet ultimate luxury. Explore the road with absolute freedom and unmatched comfort.
              </motion.p>
              
              <motion.div variants={heroItemVariant} className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 flex items-center gap-3 group"
                >
                  Reserve Now
                  <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-green-500/10 blur-[120px] rounded-full scale-150 rotate-45 pointer-events-none" />
              <motion.img
                src={Herocar}
                alt="Elite Fleet"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-full drop-shadow-[0_50px_50px_rgba(0,0,0,0.15)]"
              />
            </motion.div>
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
        </motion.section>

        {/* Step Cards with refined glassmorphism */}
        <div className="relative z-30 px-6 lg:px-28 -mt-20 overflow-visible">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Select Hub", icon: <LuMapPin size={32} />, color: "from-green-500 to-emerald-600" },
              { step: "02", title: "Pick Date", icon: <LuCalendarCheck size={32} />, color: "from-slate-800 to-slate-900" },
              { step: "03", title: "Start Drive", icon: <LuCar size={32} />, color: "from-green-500 to-emerald-600" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="group p-8 bg-white rounded-[3rem] border border-slate-50 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.15)] transition-all duration-700 relative overflow-hidden"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                   {item.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">Experience the future of mobility with zero friction and total transparency.</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-200 group-hover:text-green-500/20 transition-colors uppercase tracking-[0.5em]">{item.step} PHASE</span>
                  <LuArrowRight className="text-slate-200 group-hover:text-slate-900 transition-all group-hover:translate-x-2" size={20} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search Results Summary (Optional trigger placeholder) */}
        
        {/* Booking Form with entrance */}
        <motion.div
          ref={ref}
          className="py-32 px-6"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <CarSearch />
        </motion.div>

        <LatestFleet />

        <HeroParallax />
      </div>



      <Footers />
    </div>
  );
}

export default Home;
