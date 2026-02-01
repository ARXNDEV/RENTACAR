import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/user/Home";
import SignUp from "./pages/user/SignUp";
import SignIn from "./pages/user/SignIn";
import Vehicles from "./pages/user/Vehicles";
import Profile from "./pages/user/Profile";
import With_nav from "./components/Layout/WithNav";
import PrivateRoute from "./components/PrivateRoute";
import { PrivateSignin } from "./components/PrivateRoute";

import AdminPrivateRoutes from "./components/AdminPrivateRoutes";
import Contact from "./pages/user/Contact";
import VendorSignin from "./pages/vendor/pages/VendorSignin";
import VendorSignup from "./pages/vendor/pages/VendorSignup";
import VendorPrivateRoute from "./components/VendorPrivateRoute";
import VendorDashboard from "./pages/vendor/Dashboard/VendorDashboard";

import Layout from "./pages/admin/layouts/Layout";
// import AddProductForm from "./pages/admin/dashboard/AddProductForm";
import AdminDashNew from "./pages/admin/dashboard/AdminDashNew";
import VehicleDetails from "./pages/user/VehicleDetails";
import EditProductComponent from "./pages/admin/components/EditProductComponent";
import Orders from "./pages/user/Orders";
import AvailableVehicles from "./pages/user/AvailableVehiclesAfterSearch";
import VendorEditProductComponent from "./pages/vendor/Components/VendorEditProductComponent";
import VendorDeleteVehicleModal from "./pages/vendor/Components/VendorDeleteVehicleModal";
import CheckoutPage from "./pages/user/CheckoutPage";
import Razorpay from "./pages/user/Razorpay";
import PaymentSuccessPage from "./pages/user/PaymentSuccessPage";
import AllVehiclesofSameModel from "./pages/user/AllVehiclesofSameModel";
import AddProductModal from "./pages/admin/components/AddProductModal";
import VendorAddProductModal from "./pages/vendor/Components/VendorAddVehilceModal";
import CarNotFound from "./pages/user/CarNotFound";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendBookingDetailsEmail } from "./components/utils/bookingUtils";
import { setisPaymentDone } from "./redux/user/LatestBookingsSlice";

function App() {
  const dispatch = useDispatch();
  const { data, paymentDone } = useSelector((state) => state.latestBookingsSlice);
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (paymentDone && data && currentUser?.email) {
      const sendEmail = async () => {
        try {
          await sendBookingDetailsEmail(currentUser.email, data, dispatch);
        } catch (error) {
          console.error("Email sync failure:", error);
        } finally {
          dispatch(setisPaymentDone(false));
        }
      };
      sendEmail();
    }
  }, [paymentDone, data, currentUser?.email, dispatch]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        {/* <ThemeProvider theme={theme}> */}
        <Routes>
          {/* if user enter wrong url show this page */}
          <Route path="*" element={<CarNotFound />} />
          {/* components with Navbar */}
          <Route element={<With_nav />}>
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* components without Navbar */}
          <Route>
            {/* Signin not accesible if logedin */}
            <Route element={<PrivateSignin />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/vendorSignin" element={<VendorSignin />} />
              <Route path="/vendorSignup" element={<VendorSignup />} />
            </Route>
          </Route>

          {/* user private routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/allVariants" element={<AllVehiclesofSameModel />} />
            <Route path="/vehicleDetails" element={<VehicleDetails />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/availableVehicles" element={<AvailableVehicles />} />
            <Route path="/checkoutPage" element={<CheckoutPage />} />
            <Route path="/paymentSuccess" element={<PaymentSuccessPage />} />
            <Route path="/razorpay" element={<Razorpay />} />
          </Route>

          {/* admin private routes */}
          <Route element={<AdminPrivateRoutes />}>
            <Route element={<Layout />}>
              <Route path="/adminDashboard/*" element={<AdminDashNew />} />
            </Route>
          </Route>

          {/* vendor private routes */}
          <Route element={<VendorPrivateRoute />}>
            <Route path="/vendorDashboard/*" element={<VendorDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
