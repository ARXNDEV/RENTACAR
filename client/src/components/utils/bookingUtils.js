import { setisPaymentDone } from "../../redux/user/LatestBookingsSlice";

export async function sendBookingDetailsEmail(toEmail, bookingDetails, dispatch) {
  try {
    const res = await fetch("/api/user/sendBookingDetailsEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toEmail, data: bookingDetails }),
    });
    const result = await res.json();
    if (!result.ok) {
      dispatch(setisPaymentDone(false));
      console.error("Email API failure:", result.message);
      return;
    }
    return "success";
  } catch (error) {
    console.error("Email send error:", error);
  }
}
