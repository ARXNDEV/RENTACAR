import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  // Allow normal users and enterprise users (isUser: true)
  const isAuthorized = currentUser && (currentUser.isUser || (!currentUser.isAdmin && !currentUser.isVendor));
  return isAuthorized ? <Outlet /> : <Navigate to={"/signin"} />;
}

export const PrivateSignin = () => {
  const { currentUser } = useSelector((state) => state.user);
  if (!currentUser) {
    //signin or signout available only if there is no current user
    return <Outlet />;
  }

  // Check the user's role and redirect accordingly
  if (currentUser.isAdmin) {

    return <Navigate to="/adminDashboard" />;

  } else if (currentUser.isVendor) {

    return <Navigate to="/vendorDashboard" />;

  } else {

    return <Navigate to="/" />;
    
  }
};

export default PrivateRoute;
