import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useGoogleLogin } from '@react-oauth/google';

/**
 * Premium OAuth Component
 * @param {string} role - 'user' or 'vendor'
 */
function OAuth({ role = "user" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Google Login Hook
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user info from Google API
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();

        const endpoint = role === "vendor" ? "/api/vendor/vendorgoogle" : "/api/auth/google";

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: userInfo.name,
            email: userInfo.email,
            photo: userInfo.picture,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          if (data?.accessToken) localStorage.setItem("accessToken", data.accessToken);
          if (data?.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
          
          dispatch(signInSuccess(data));

          if (data.isAdmin) {
            navigate("/adminDashboard");
          } else if (data.isVendor) {
            navigate("/vendorDashboard");
          } else {
            navigate("/");
          }
        } else {
          dispatch(signInFailure(data.message || "Failed to authenticate"));
        }
      } catch (error) {
        console.error("Google OAuth Error:", error);
        dispatch(signInFailure(error.message));
      }
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
      dispatch(signInFailure("Google Login Failed"));
    },
  });

  const handleProviderClick = async (providerName) => {
    if (providerName === "google") {
      return googleLogin();
    }
    return alert("This provider is coming soon!");
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-400 font-medium tracking-widest">
            or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Google Button */}
        <motion.button
          whileHover={{ y: -2, shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => handleProviderClick("google")}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:bg-gray-100"
        >
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </motion.button>
      </div>
      
      <p className="text-center text-[11px] text-gray-400 mt-2 px-6 leading-relaxed">
        Secure, one-click access using your social accounts. 
        We never post without your permission.
      </p>
    </div>
  );
}

export default OAuth;
