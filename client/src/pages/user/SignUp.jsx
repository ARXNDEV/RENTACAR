import { useState } from "react";
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
import { FaCarSide, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { toast } from "sonner";
import { useEffect } from "react";

const stats = [
  { value: "150+", label: "Hubs", angle: 0 },
  { value: "50K+", label: "Riders", angle: 120 },
  { value: "4.9★", label: "Rating", angle: 240 },
];

const features = [
  { icon: <FaShieldAlt size={14} />, text: "100% insured vehicles on every trip" },
  { icon: <FaCheckCircle size={14} />, text: "Zero hidden fees — transparent pricing" },
  { icon: <FaMapMarkerAlt size={14} />, text: "150+ verified hubs across India" },
];

// Industry-grade animated left panel
const SignUpLeftPanel = () => (
  <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-[#060a0f] items-center justify-center min-h-full">

    {/* === ANIMATED GRADIENT MESH BACKGROUND === */}
    <motion.div
      className="absolute inset-0"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(16,185,129,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 70%, rgba(5,150,105,0.08) 0%, transparent 60%), radial-gradient(ellipse 100% 100% at 50% 50%, rgba(6,10,15,1) 0%, transparent 100%)"
      }}
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Moving gradient orb 1 */}
    <motion.div
      className="absolute w-[500px] h-[500px] rounded-full"
      style={{ background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", top: "-20%", left: "-20%" }}
      animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Moving gradient orb 2 */}
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full"
      style={{ background: "radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%)", bottom: "-10%", right: "-10%" }}
      animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
    />

    {/* Subtle dot grid */}
    <div className="absolute inset-0"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(16,185,129,0.15) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)"
      }}
    />

    {/* === CONTENT === */}
    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-10 py-16 gap-10">

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

      {/* === CENTRAL HERO: ORBITING CAR === */}
      <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>

        {/* Outer glow ring */}
        <motion.div
          className="absolute rounded-full border border-emerald-500/15"
          style={{ width: 240, height: 240 }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute rounded-full border border-emerald-500/25"
          style={{ width: 180, height: 180 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        {/* Dashed inner ring */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: 130, height: 130, border: "1px dashed rgba(16,185,129,0.35)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Orbiting stat bubbles */}
        {stats.map((stat, i) => {
          const radius = 115;
          const angleRad = ((stat.angle - 90) * Math.PI) / 180;
          const x = radius * Math.cos(angleRad);
          const y = radius * Math.sin(angleRad);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute", left: `calc(50% + ${x}px - 32px)`, top: `calc(50% + ${y}px - 32px)` }}
            >
              <motion.div
                className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm cursor-default"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(16,185,129,0.25)" }}
                whileHover={{ scale: 1.15, background: "rgba(16,185,129,0.12)" }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              >
                <span className="text-emerald-400 font-extrabold text-xs leading-none">{stat.value}</span>
                <span className="text-gray-500 text-[9px] mt-0.5 font-medium">{stat.label}</span>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Central car icon */}
        <motion.div
          className="absolute w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))", border: "1px solid rgba(16,185,129,0.3)" }}
          animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 30px rgba(16,185,129,0.4)", "0 0 0px rgba(16,185,129,0)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaCarSide size={36} className="text-emerald-400" />
          </motion.div>
        </motion.div>

        {/* Animated road beneath car */}
        <div className="absolute overflow-hidden" style={{ bottom: 28, width: 80, height: 4, borderRadius: 2 }}>
          <motion.div
            className="flex gap-2 h-full items-center"
            animate={{ x: [0, -40] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
          >
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="w-6 h-0.5 rounded-full flex-shrink-0 bg-emerald-500/40" />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Headline */}
      <div className="text-center -mt-4">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl font-extrabold text-white tracking-tight leading-snug"
        >
          Your next adventure
          <br />
          <span className="relative inline-block">
            <motion.span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #34d399, #10b981, #6ee7b7, #34d399)", backgroundSize: "300%" }}
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
              starts here
            </motion.span>
          </span>
        </motion.h2>
      </div>

      {/* Feature list */}
      <div className="flex flex-col gap-3 w-full max-w-[280px]">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 group cursor-default"
          >
            <div className="h-7 w-7 rounded-lg flex items-center justify-center text-emerald-400 flex-shrink-0 transition-all group-hover:scale-110"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              {f.icon}
            </div>
            <span className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors">{f.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const schema = z.object({
  username: z.string().min(3, { message: "Minimum 3 characters required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .refine((value) => /\S+@\S+\.\S+/.test(value), {
      message: "Please enter a valid email",
    }),
  phoneNumber: z
    .string()
    .min(10, { message: "Value must be at least 10" })
    .max(10, { message: "Value must be at most 10" }),
  password: z.string().min(4, { message: "Minimum 4 characters required" }),
});

const getPasswordStrength = (pw) => {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 4) score++;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { level: 2, label: "Fair", color: "bg-orange-400" };
  if (score <= 3) return { level: 3, label: "Good", color: "bg-yellow-400" };
  if (score <= 4) return { level: 4, label: "Strong", color: "bg-emerald-400" };
  return { level: 5, label: "Excellent", color: "bg-emerald-600" };
};

function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state.user);

  const [showPass, setShowPass] = useState(false);
  const watchedPassword = watch("password", "");
  const strength = getPasswordStrength(watchedPassword);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok === false || data.success === false) {
        dispatch(signInFailure(data.message || "Failed to sign up"));
        toast.error(data.message || "Failed to sign up");
        return;
      }
      dispatch(loadingEnd());
      toast.success("Account created successfully!");
      navigate("/signin");
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">

      {/* Left decorative panel — animated */}
      <SignUpLeftPanel />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8 sm:p-10">

            {/* Header — mobile only logo */}
            <div className="text-center mb-8">
              <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-[0_4px_14px_rgba(34,197,94,0.35)]">
                  <FaCarSide size={18} className="text-white" />
                </div>
                <span className="text-xl font-extrabold text-gray-900">
                  Rent<span className="text-emerald-600">aRide</span>
                </span>
              </Link>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create your account</h1>
              <p className="text-sm text-gray-400 mt-1">It only takes a minute</p>
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
                       {typeof isError === 'string' ? isError : "Failed to sign up. Please try again."}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <div className="relative">
                  <FaUser size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" id="username" placeholder="Arjun Mehta" {...register("username")}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
                {errors.username && <p className="text-xs text-red-500 font-medium">{errors.username.message}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">Email</label>
                <div className="relative">
                  <FaEnvelope size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" id="email" placeholder="you@email.com" {...register("email")}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                <div className="relative">
                  <FaPhoneAlt size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" id="phoneNumber" placeholder="9876543210" {...register("phoneNumber")}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
                {errors.phoneNumber && <p className="text-xs text-red-500 font-medium">{errors.phoneNumber.message}</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <div className="relative">
                  <FaLock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? "text" : "password"} id="password" placeholder="Min. 4 characters"
                    {...register("password")}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-11 text-sm text-gray-900 placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}

                {/* Strength meter */}
                {watchedPassword && (
                  <div className="mt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-gray-200"}`} />
                      ))}
                    </div>
                    <p className={`text-[10px] font-bold mt-1 ${strength.color.replace("bg-", "text-")}`}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              <motion.button type="submit" disabled={isLoading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-sm font-bold text-white shadow-[0_4px_16px_rgba(34,197,94,0.35)] transition-all hover:from-emerald-600 hover:to-green-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {isLoading ? (
                  <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Creating account…</>
                ) : "Create Account"}
              </motion.button>

              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                By signing up, you agree to our{" "}
                <a href="#" className="text-emerald-600 font-semibold hover:underline">Terms</a> and{" "}
                <a href="#" className="text-emerald-600 font-semibold hover:underline">Privacy Policy</a>.
              </p>
            </form>

            {/* Divider */}
            <OAuth />


            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/signin" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SignUp;
