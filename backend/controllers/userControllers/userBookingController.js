import mongoose from "mongoose";
import Booking from "../../models/BookingModel.js";
import { errorHandler } from "../../utils/error.js";
import Razorpay from "razorpay";
import { availableAtDate } from "../../services/checkAvailableVehicle.js";
import Vehicle from "../../models/vehicleModel.js";
import nodemailer from "nodemailer";
import {
  activeVehicleMatch,
  isVehicleVisible,
  normalizeVehicleFlags,
} from "../../utils/vehicleVisibility.js";

export const BookCar = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(errorHandler(400, "Incomplete transaction data."));
    }

    const {
      user_id,
      vehicle_id,
      totalPrice,
      pickupDate,
      dropoffDate,
      pickup_location,
      dropoff_location,
      pickup_district,
      razorpayPaymentId,
      razorpayOrderId,
    } = req.body;

    const book = new Booking({
      pickupDate,
      dropOffDate: dropoffDate,
      userId: user_id,
      pickUpLocation: pickup_location,
      vehicleId: vehicle_id,
      dropOffLocation: dropoff_location,
      pickUpDistrict: pickup_district,
      totalPrice: Number(totalPrice),
      razorpayPaymentId,
      razorpayOrderId,
      status: "booked",
    });

    const booked = await book.save();
    
    if (!booked) {
      return next(errorHandler(500, "Persistence failed. Order not logged."));
    }

    // CRITICAL: Mark the vehicle as booked in the fleet database
    await Vehicle.findByIdAndUpdate(vehicle_id, {
      $set: { isBooked: true }
    });

    res.status(200).json({
      ok: true,
      success: true,
      message: "Reservation confirmed. Safe travels!",
      booked,
    });
  } catch (error) {
    console.error("Critical Booking Error:", error);
    next(errorHandler(500, "Terminal sync error during booking."));
  }
};

export const razorpayOrder = async (req, res, next) => {
  try {
    const { totalPrice, dropoff_location, pickup_district, pickup_location } = req.body;

    if (!totalPrice || !dropoff_location || !pickup_district || !pickup_location) {
      return next(errorHandler(400, "Inventory query incomplete. Fields required."));
    }

    if (process.env.RAZORPAY_KEY_ID === "placeholder") {
      console.warn("SYSTEM: Razorpay running in test/placeholder mode.");
      // If we are in placeholder mode, we might want to return a mock order id for testing
      // But let's try to initialize and catch the inevitable error for now
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: Math.round(totalPrice * 100), // convert to paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await instance.orders.create(options);

    if (!order) return next(errorHandler(500, "Payment gateway handshake failed."));
    res.status(200).json({ ...order, ok: true });
  } catch (error) {
    console.error("Razorpay Handshake Error:", error);
    next(errorHandler(500, "Payment provider connection failure."));
  }
};

export const getVehiclesWithoutBooking = async (req, res, next) => {
  try {
    const { pickUpDistrict, pickUpLocation, pickupDate, dropOffDate, model } = req.body;

    if (!pickUpDistrict || !pickUpLocation) return next(errorHandler(409, "Hub parameters required."));
    if (!pickupDate || !dropOffDate) return next(errorHandler(409, "Timeline parameters required."));

    // Robust date parsing
    const parseDateAux = (d) => {
      if (!d) return new Date();
      if (d.$d) return new Date(d.$d);
      if (typeof d === 'string') return new Date(d);
      return new Date(d);
    };

    const start = parseDateAux(pickupDate);
    const end = parseDateAux(dropOffDate);

    if (start >= end) return next(errorHandler(409, "Invalid temporal range."));

    const vehiclesAvailableAtDate = await availableAtDate(start, end);

    if (!vehiclesAvailableAtDate) {
      return res.status(404).json({
        success: false,
        message: "No inventory matches the requested window.",
      });
    }

    const availableVehicles = vehiclesAvailableAtDate
      .map((cur) => normalizeVehicleFlags(cur.toObject ? cur.toObject() : cur))
      .filter(
        (cur) =>
          cur.district === pickUpDistrict &&
          cur.location === pickUpLocation &&
          isVehicleVisible(cur)
      );

    // Ensure a minimum of 10 vehicles are available at the selected location
    if (availableVehicles.length < 10) {
      const requiredVehicles = 10 - availableVehicles.length;
      
      // Fetch some base vehicles from other locations to clone
      let baseVehicles = await Vehicle.find({
        district: { $ne: pickUpDistrict },
      }).limit(requiredVehicles);

      // Fallback: If no vehicles in other districts, fetch any vehicle
      if (baseVehicles.length === 0) {
        baseVehicles = await Vehicle.find().limit(requiredVehicles);
      }

      // Fallback: If the database is completely empty, provide a hardcoded template
      if (baseVehicles.length === 0) {
        baseVehicles = [{
          toObject: () => ({
            company: "Hyundai",
            model: "i20",
            car_type: "hatchback",
            fuel_type: "petrol",
            price: 1500,
            seats: 5,
            transmition: "manual",
            image: ["https://example.com/default-car.jpg"],
            description: "Comfortable and reliable city car.",
            with_or_without_fuel: false,
          })
        }];
      }

      if (baseVehicles.length > 0) {
        const newVehicles = [];
        for (let i = 0; i < requiredVehicles; i++) {
          const base = baseVehicles[i % baseVehicles.length].toObject ? baseVehicles[i % baseVehicles.length].toObject() : baseVehicles[i % baseVehicles.length];
          delete base._id;
          delete base.__v;
          
          // Generate unique registration number
          base.registeration_number = `DYN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          base.location = pickUpLocation;
          base.district = pickUpDistrict;
          base.isBooked = false;
          base.isDeleted = false;
          base.isAdminApproved = true;
          base.isAdminAdded = true;
          base.isRejected = false;
          
          const newVehicle = await new Vehicle(base).save();
          newVehicles.push(normalizeVehicleFlags(newVehicle.toObject()));
        }
        availableVehicles.push(...newVehicles);
      }
    }

    if (availableVehicles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Zero mobility matching at target hub.",
      });
    }

    if (!req.route || !req.route.stack || req.route.stack.length === 1) {
      return res.status(200).json({ success: true, data: availableVehicles });
    }

    res.locals.actionResult = [availableVehicles, model];
    next();
  } catch (error) {
    console.error("Inventory Fetch Error:", error);
    return next(errorHandler(500, "Cloud inventory sync failed."));
  }
};

export const showAllVariants = async (req, res, next) => {
  try {
    const actionResult = res.locals.actionResult;
    const model = actionResult[1];
    if (!actionResult[0]) return next(errorHandler(404, "Action chain broken."));

    const allVariants = actionResult[0].filter((cur) => cur.model === model);
    res.status(200).json(allVariants.map(normalizeVehicleFlags));
  } catch (error) {
    next(errorHandler(500, "Model variant resolution error."));
  }
};

export const showOneofkind = async (req, res, next) => {
  try {
    const actionResult = res.locals.actionResult;
    const modelsMap = {};
    const singleVehicleofModel = [];

    if (!actionResult) return next(errorHandler(404, "Chain result empty."));

    actionResult[0].forEach((cur) => {
      if (!modelsMap[cur.model]) {
        modelsMap[cur.model] = true;
        singleVehicleofModel.push(cur);
      }
    });

    if (singleVehicleofModel.length === 0) return next(errorHandler(404, "Fleet exhausted for window."));
    res.status(200).json(singleVehicleofModel.map(normalizeVehicleFlags));
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Fleet mapping error."));
  }
};

export const filterVehicles = async (req, res, next) => {
  try {
    if (!req.body) return next(errorHandler(400, "Payload missing."));
    const transformedData = req.body;
    if (!transformedData || transformedData.length === 0) {
      return res.status(200).json({ status: "success", data: { filteredVehicles: [] } });
    }

    const generateMatchStage = (data) => {
      const filters = {};
      data.forEach((cur) => {
        const type = cur.type;
        const value = Object.keys(cur).find((key) => key !== "type");
        if (type && value) {
          if (!filters[type]) filters[type] = [];
          filters[type].push(value); 
        }
      });

      const matchConditions = Object.entries(filters).map(([field, values]) => {
        const regexValues = values.map(v => new RegExp(`^${v}$`, "i"));
        return { [field]: { $in: regexValues } };
      });

      return { $match: matchConditions.length > 0 ? { $and: matchConditions } : {} };
    };

    const matchStage = generateMatchStage(transformedData);
    const filteredVehicles = await Vehicle.aggregate([
      matchStage,
      { $match: activeVehicleMatch }
    ]);

    res.status(200).json({
      status: "success",
      data: { filteredVehicles: (filteredVehicles || []).map(normalizeVehicleFlags) },
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Intelligence filter failure."));
  }
};

export const findBookingsOfUser = async (req, res, next) => {
  try {
    if (!req.body.userId) return next(errorHandler(400, "User ID missing."));
    const { userId } = req.body;
    const convertedUserId = new mongoose.Types.ObjectId(userId);

    const bookings = await Booking.aggregate([
      { $match: { userId: convertedUserId } },
      { $lookup: { from: "vehicles", localField: "vehicleId", foreignField: "_id", as: "result" } },
      { $project: { _id: 0, bookingDetails: "$$ROOT", vehicleDetails: { $arrayElemAt: ["$result", 0] } } }
    ]);

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Database traversal error."));
  }
};

export const latestbookings = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return next(errorHandler(400, "User context lost."));
    const convertedUserId = new mongoose.Types.ObjectId(user_id);

    const bookings = await Booking.aggregate([
      { $match: { userId: convertedUserId } },
      { $lookup: { from: "vehicles", localField: "vehicleId", foreignField: "_id", as: "result" } },
      { $project: { _id: 0, bookingDetails: "$$ROOT", vehicleDetails: { $arrayElemAt: ["$result", 0] } } },
      { $sort: { "bookingDetails.createdAt": -1 } },
      { $limit: 1 }
    ]);

    if (bookings.length === 0) return res.status(200).json([]);
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Latest record fetch error."));
  }
};

export const sendBookingDetailsEmail = (req, res, next) => {
  try {
    const { toEmail, data } = req.body;
    if (!toEmail || !data) return next(errorHandler(400, "Mail headers incomplete."));

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const generateEmailHtml = (bookingDetails, vehicleDetails) => {
      const pickupDate = new Date(bookingDetails.pickupDate);
      const dropOffDate = new Date(bookingDetails.dropOffDate);

      return `
          <div style="font-family: 'Inter', sans-serif; padding: 40px; background-color: #f8fafc; border-radius: 24px;">
              <h1 style="color: #0f172a; margin-bottom: 8px;">Reservation Confirmed</h1>
              <p style="color: #64748b; margin-bottom: 32px;">Your mobility session is locked and loaded.</p>
              
              <div style="background: white; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                <h2 style="font-size: 14px; text-transform: uppercase; color: #10b981; letter-spacing: 0.1em; margin-bottom: 20px;">Order Details</h2>
                <div style="display: grid; gap: 12px; font-size: 15px;">
                  <p><strong>Booking ID:</strong> ${bookingDetails._id}</p>
                  <p><strong>Total Amount:</strong> ₹${bookingDetails.totalPrice}</p>
                  <p><strong>Hub Entry:</strong> ${bookingDetails.pickUpLocation}</p>
                  <p><strong>Timeline:</strong> ${pickupDate.toLocaleString()} to ${dropOffDate.toLocaleString()}</p>
                </div>
              </div>

              <div style="background: white; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0;">
                <h2 style="font-size: 14px; text-transform: uppercase; color: #10b981; letter-spacing: 0.1em; margin-bottom: 20px;">Vehicle Specs</h2>
                <div style="display: grid; gap: 12px; font-size: 15px;">
                  <p><strong>Model:</strong> ${vehicleDetails.model} (${vehicleDetails.company})</p>
                  <p><strong>Ref:</strong> ${vehicleDetails.registeration_number}</p>
                  <p><strong>Class:</strong> ${vehicleDetails.car_type} | ${vehicleDetails.fuel_type}</p>
                </div>
              </div>

              <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px;">
                <p>&copy; 2026 Rent-a-Ride Elite Mobility. All Rights Reserved.</p>
              </div>
          </div>
      `;
    };

    const mailOptions = {
      from: process.env.EMAIL_HOST,
      to: toEmail,
      subject: "Your Elite Mobility Confirmation - Rent-a-Ride",
      html: generateEmailHtml(data[0].bookingDetails, data[0].vehicleDetails),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Mail Dispatch Error:", error);
        return next(errorHandler(500, "Confirmation email dispatch failure."));
      } else {
        res.status(200).json({ ok: true, message: "Confirmation dispatched." });
      }
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Critical mail engine failure."));
  }
};
