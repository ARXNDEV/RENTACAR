/**
 * stripeService.js
 * ─────────────────────────────────────────────────────────────────
 * Handles Stripe Checkout Session creation + redirect.
 * Uses the hosted Stripe checkout page (no card fields on our site).
 * ─────────────────────────────────────────────────────────────────
 */

import { toast } from "sonner";
import { setPageLoading } from "../../redux/user/userSlice";
import { fetchLatestBooking } from "./Razorpay";

/**
 * Initiates a Stripe Checkout Session and redirects the user.
 *
 * @param {Object} orderData  - Full booking data (same shape as Razorpay flow)
 * @param {Function} navigate - react-router navigate
 * @param {Function} dispatch - redux dispatch
 */
export const displayStripeCheckout = async (orderData, navigate, dispatch) => {
  try {
    dispatch(setPageLoading(true));

    const res = await fetch("/api/user/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalPrice: orderData.totalPrice,
        vehicle_model: orderData.vehicle_model,
        vehicle_id: orderData.vehicle_id,
        user_id: orderData.user_id,
        orderData,                        // stored in session.metadata for webhook
        chargeId: "ch_3LiiC52eZvKYlo2C1da66ZSQ", // Trigger specific charge retrieval requested by user
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      toast.error(data.message || "Failed to create Stripe session.");
      dispatch(setPageLoading(false));
      return;
    }

    // ── Mock / Dev mode: skip Stripe redirect ───────────────────────────
    if (data.mock) {
      toast.info("Stripe is in mock mode. Simulating success…");

      // Save booking in DB manually (since webhook won't fire in mock mode)
      const bookingRes = await fetch("/api/user/bookCar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderData,
          stripeSessionId: "mock_session_" + Date.now(),
          paymentMethod: "stripe_mock",
        }),
      });
      const bookingStatus = await bookingRes.json();

      if (bookingStatus.ok) {
        await fetchLatestBooking(orderData.user_id, dispatch);
        navigate("/paymentSuccess", { state: { bookingData: orderData } });
        toast.success("Booking confirmed (mock mode)!");
      } else {
        toast.error("Booking save failed in mock mode.");
      }

      dispatch(setPageLoading(false));
      return;
    }

    // ── Real Stripe: redirect to hosted checkout ─────────────────────────
    toast.success("Redirecting to Stripe…");
    window.location.href = data.url;   // Stripe takes over from here

  } catch (error) {
    console.error("[Stripe Frontend] Error:", error);
    toast.error("Stripe checkout initiation failed. Please try again.");
    dispatch(setPageLoading(false));
  }
};
