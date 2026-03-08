import { Link, useNavigate } from "react-router-dom";
import {
  loadingEnd,
  signInFailure,
  signInStart,
  signInSuccess,
  clearError,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../../components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { FaCarSide, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaStar, FaQuoteLeft, FaShieldAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Floating particle
const Particle = ({ style }) => (
  <motion.div
    className="absolute rounded-full bg-emerald-400/20"
    style={style}
    animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
    transition={{ duration: style.duration, repeat: Infinity, ease: "easeInOut", delay: style.delay }}
  />
);
const particles = [
  { width: 8, height: 8, top: "12%", left: "12%", duration: 3.2, delay: 0 },
  { width: 5, height: 5, top: "30%", left: "78%", duration: 4.1, delay: 0.6 },
  { width: 10, height: 10, top: "65%", left: "18%", duration: 3.6, delay: 1.1 },
  { width: 6, height: 6, top: "78%", left: "72%", duration: 5.2, delay: 0.3 },
  { width: 7, height: 7, top: "45%", left: "88%", duration: 2.9, delay: 1.6 },
  { width: 9, height: 9, top: "20%", left: "50%", duration: 3.9, delay: 0.4 },
];

// Animated left panel for SignIn
const SignInLeftPanel = () => (
  <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-[#060a0f] items-center justify-center min-h-full">

    {/* Animated gradient mesh */}
    <motion.div
      className="absolute inset-0"
      style={{ background: "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(16,185,129,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 70%, rgba(99,102,241,0.08) 0%, transparent 60%)" }}
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[500px] h-[500px] rounded-full"
      style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", top: "-20%", left: "-20%" }}
      animate={{ x: [0, 50, 0], y: [0, 35, 0] }}
      transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full"
      style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", bottom: "-10%", right: "-10%" }}
      animate={{ x: [0, -40, 0], y: [0, -25, 0] }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
    />

    {/* Dot grid */}
    <div className="absolute inset-0"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(16,185,129,0.15) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)"
      }}
    />

    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-10 py-16 gap-8">

      {/* Logo — pinned top-left */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-7 left-8 flex items-center gap-2.5 z-20"
      >
        <motion.div
          className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center"
          animate={{ boxShadow: ["0 0 16px rgba(16,185,129,0.4)", "0 0 32px rgba(16,185,129,0.7)", "0 0 16px rgba(16,185,129,0.4)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FaCarSide size={16} className="text-white" />
        </motion.div>
        <span className="text-lg font-extrabold text-white tracking-tight">
          Rent<span className="text-emerald-400">aRide</span>
        </span>
      </motion.div>

      {/* Central orb with car */}
      <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
        <motion.div className="absolute rounded-full border border-emerald-500/15"
          style={{ width: 220, height: 220 }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div className="absolute rounded-full border border-emerald-500/25"
          style={{ width: 165, height: 165 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div className="absolute rounded-full"
          style={{ width: 115, height: 115, border: "1px dashed rgba(16,185,129,0.3)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />

        {/* Orbiting stats */}
        {[{ value: "50K+", label: "Riders", angle: 0 }, { value: "4.9★", label: "Rating", angle: 120 }, { value: "150+", label: "Hubs", angle: 240 }].map((stat, i) => {
          const r = 105; const rad = ((stat.angle - 90) * Math.PI) / 180;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.2, duration: 0.5 }}
              style={{ position: "absolute", left: `calc(50% + ${r * Math.cos(rad)}px - 28px)`, top: `calc(50% + ${r * Math.sin(rad)}px - 28px)` }}
            >
              <motion.div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(16,185,129,0.25)" }}
                whileHover={{ scale: 1.15, background: "rgba(16,185,129,0.12)" }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              >
                <span className="text-emerald-400 font-extrabold text-xs leading-none">{stat.value}</span>
                <span className="text-gray-500 text-[9px] mt-0.5">{stat.label}</span>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Central car */}
        <motion.div className="absolute w-18 h-18 rounded-2xl flex items-center justify-center"
          style={{ width: 72, height: 72, background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))", border: "1px solid rgba(16,185,129,0.3)" }}
          animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 28px rgba(16,185,129,0.4)", "0 0 0px rgba(16,185,129,0)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
            <FaCarSide size={32} className="text-emerald-400" />
          </motion.div>
        </motion.div>

        {/* Road */}
        <div className="absolute overflow-hidden" style={{ bottom: 24, width: 72, height: 4, borderRadius: 2 }}>
          <motion.div className="flex gap-2 h-full items-center"
            animate={{ x: [0, -36] }} transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}>
            {Array(8).fill(0).map((_, i) => <div key={i} className="w-5 h-0.5 rounded-full flex-shrink-0 bg-emerald-500/40" />)}
          </motion.div>
        </div>
      </div>

      {/* Headline */}
      <div className="text-center -mt-2">
        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl font-extrabold text-white tracking-tight leading-snug"
        >
          Welcome back,<br />
          <motion.span className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg, #34d399, #10b981, #6ee7b7, #34d399)", backgroundSize: "300%" }}
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            road warrior
          </motion.span>
        </motion.h2>
      </div>

      {/* Testimonial card with shimmer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl p-5 overflow-hidden w-full max-w-[300px]"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <motion.div className="absolute inset-0 rounded-2xl"
          style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.12), transparent)", backgroundSize: "200%" }}
          animate={{ backgroundPosition: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10">
          <div className="flex gap-0.5 mb-3">
            {[1,2,3,4,5].map(i => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.08 }}>
                <FaStar size={11} className="text-yellow-400" />
              </motion.div>
            ))}
          </div>
          <FaQuoteLeft size={12} className="text-emerald-400 mb-2" />
          <p className="text-gray-400 text-xs leading-relaxed italic">
            "Booked a Fortuner for our Rajasthan trip — seamless pickup, clean car, and ₹0 surprise charges."
          </p>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">P</div>
            <div>
              <p className="text-white font-bold text-xs">Priya Sharma</p>
              <p className="text-gray-600 text-[10px]">Bangalore → Jaipur</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <FaShieldAlt size={10} className="text-emerald-500" />
              <span className="text-[9px] text-emerald-500 font-bold">Verified</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .refine((value) => /\S+@\S+\.\S+/.test(value), {
      message: "Please enter a valid email",
    }),
  password: z.string().min(1, { message: "Password is required" }),
});

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { isLoading, isError } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok === false || data.success === false) {
        dispatch(signInFailure(data.message || "Invalid credentials. Please try again."));
        toast.error(data.message || "Invalid credentials. Please try again.");
        return;
      }

      if (data?.accessToken) {
        localStorage.removeItem("accessToken");
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data?.refreshToken) {
        localStorage.removeItem("refreshToken");
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      toast.success("Welcome back!");
      if (data.isAdmin) {
        dispatch(signInSuccess(data));
        navigate("/adminDashboard");
      } else if (data.isUser) {
        dispatch(signInSuccess(data));
        navigate("/");
      } else {
        dispatch(signInFailure("Unauthorized access."));
        toast.error("Unauthorized access.");
      }
    } catch (error) {
      dispatch(signInFailure("Network error. Please try again."));
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">

      {/* Left decorative panel — animated */}
      <SignInLeftPanel />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8 sm:p-10">

            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-[0_4px_14px_rgba(34,197,94,0.35)]">
                  <FaCarSide size={18} className="text-white" />
                </div>
                <span className="text-xl font-extrabold text-gray-900">
                  Rent<span className="text-emerald-600">aRide</span>
                </span>
              </Link>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Sign in to your account</h1>
              <p className="text-sm text-gray-400 mt-1">Access your bookings and profile</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Error Banner */}
              <AnimatePresence>
                {isError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 mb-2">
                       <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 flex-shrink-0">!</span>
                       {typeof isError === 'string' ? isError : "Invalid credentials. Please try again."}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">Email</label>
                <div className="relative">
                  <FaEnvelope size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" id="email" placeholder="you@email.com" {...register("email")}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700">Password</label>
                  <button type="button" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <FaLock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? "text" : "password"} id="password" placeholder="••••••••" {...register("password")}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-11 text-sm text-gray-900 placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
              </div>

              <motion.button type="submit" disabled={isLoading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-sm font-bold text-white shadow-[0_4px_16px_rgba(34,197,94,0.35)] transition-all hover:from-emerald-600 hover:to-green-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {isLoading ? (
                  <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Signing in…</>
                ) : "Sign In"}
              </motion.button>
            </form>

            <OAuth />


            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Create one free</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SignIn;
