import Stripe from "stripe";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Booking from "../../models/BookingModel.js";
import Vehicle from "../../models/vehicleModel.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../backend/.env") });

// ─── Stripe Client (only initialise if a real test key is provided) ──────────
const stripeKey = process.env.STRIPE_SECRET_KEY;
const isLiveStripe = stripeKey && !stripeKey.startsWith("mock");
const stripe = isLiveStripe ? new Stripe(stripeKey) : null;

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const persistStripeBooking = async (orderData, session) => {
  if (!orderData?.user_id || !orderData?.vehicle_id) {
    throw new Error("Stripe session metadata is missing booking identifiers.");
  }

  const existingBooking = await Booking.findOne({
    razorpayOrderId: session.id,
    razorpayPaymentId: session.payment_intent || session.id,
  });

  if (existingBooking) {
    return existingBooking;
  }

  const booking = await Booking.create({
    pickupDate: orderData.pickupDate,
    dropOffDate: orderData.dropoffDate,
    userId: new mongoose.Types.ObjectId(orderData.user_id),
    pickUpLocation: orderData.pickup_location,
    vehicleId: new mongoose.Types.ObjectId(orderData.vehicle_id),
    dropOffLocation: orderData.dropoff_location,
    pickUpDistrict: orderData.pickup_district,
    totalPrice: Number(orderData.totalPrice),
    razorpayOrderId: session.id,
    razorpayPaymentId: session.payment_intent || session.id,
    status: "booked",
  });

  await Vehicle.findByIdAndUpdate(orderData.vehicle_id, {
    $set: { isBooked: true },
  });

  return booking;
};

// ────────────────────────────────────────────────────────────────────────────
//  POST /api/user/create-checkout-session
//  Creates a Stripe hosted Checkout Session and returns the session URL.
// ────────────────────────────────────────────────────────────────────────────
export const createCheckoutSession = async (req, res, next) => {
  // ── Mock/Sandbox mode ────────────────────────────────────────────────────
  if (!stripe) {
    return res.status(200).json({
      ok: true,
      mock: true,
      url: `${CLIENT_URL}/paymentSuccess`,
      message: "Stripe is in mock mode — redirecting directly to success.",
    });
  }

  const { totalPrice, vehicle_model, vehicle_id, user_id, orderData, chargeId } = req.body;

  if (!totalPrice || !vehicle_model) {
    return res.status(400).json({ ok: false, message: "Missing required fields: totalPrice, vehicle_model" });
  }

  try {
    // If the client requested to check a specific charge (based on user input logic)
    if (chargeId && stripeKey === "sk_test_REDACTED") {
      try {
        const charge = await stripe.charges.retrieve(chargeId);
        console.log("Retrieved Charge:", charge.id);
        // We still proceed to create a session for the UI to function properly
      } catch (err) {
        console.log("Error retrieving charge:", err.message);
      }
    }

    // Ensure metadata orderData fits within Stripe's 500 char limit
    // We only keep the most bare minimum fields required by persistStripeBooking to prevent the 500 limit crash
    const essentialOrderData = {
      pickupDate: orderData?.pickupDate,
      dropoffDate: orderData?.dropoffDate,
      pickup_location: orderData?.pickup_location?.substring(0, 15),
      pickup_district: orderData?.pickup_district?.substring(0, 10),
      totalPrice: orderData?.totalPrice,
      user_id: orderData?.user_id,
      vehicle_id: orderData?.vehicle_id
    };
    
    const orderDataString = JSON.stringify(essentialOrderData);
    const safeOrderData = orderDataString.length > 490 
      ? JSON.stringify({ _truncated: true, message: "Order data too large for metadata" })
      : orderDataString;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",                // ← INR for Indian market
            product_data: {
              name: `Rent-a-Ride: ${vehicle_model}`,
              description: "Vehicle rental booking — Rent-a-Ride",
              images: ["https://rent-a-ride-two.vercel.app/logo.png"],
            },
            unit_amount: Math.round(totalPrice * 100), // paise
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user_id || "",
        vehicle_id: vehicle_id || "",
        orderData: safeOrderData,   // carry booking params safely
      },
      // ── Redirect URLs ───────────────────────────────────────────────────
      success_url: `${CLIENT_URL}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/checkoutPage`,
    });

    return res.status(200).json({ ok: true, url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("[Stripe] createCheckoutSession error:", error.message);
    return res.status(400).json({ ok: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────────────────────────
//  POST /api/user/create-payment-intent
//  Legacy endpoint — kept for backward compatibility (Elements flow).
// ────────────────────────────────────────────────────────────────────────────
export const createPaymentIntent = async (req, res, next) => {
  if (!stripe) {
    return res.status(200).json({
      clientSecret: "mock_secret_" + Date.now(),
      message: "Stripe is currently in mock mode.",
    });
  }

  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("[Stripe] createPaymentIntent error:", error.message);
    return next(error);
  }
};

// ────────────────────────────────────────────────────────────────────────────
//  POST /api/user/stripe-webhook
//  Listens for Stripe events.  Must receive the RAW body (not JSON-parsed).
//  Add this route BEFORE express.json() in server.js.
// ────────────────────────────────────────────────────────────────────────────
export const stripeWebhook = async (req, res) => {
  if (!stripe) {
    return res.status(200).send("Webhook received (mock mode — no processing).");
  }

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    // req.body must be the raw Buffer — see server.js setup below
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ── Handle events ────────────────────────────────────────────────────────
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("[Stripe Webhook] ✅ Payment confirmed for session:", session.id);

      try {
        const orderData = JSON.parse(session.metadata.orderData || "{}");
        await persistStripeBooking(orderData, session);
      } catch (error) {
        console.error("[Stripe Webhook] Booking persistence failed:", error.message);
        return res.status(500).json({ received: false, message: "Booking persistence failed." });
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object;
      console.warn("[Stripe Webhook] ❌ Payment failed:", pi.id);
      break;
    }
    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
};
