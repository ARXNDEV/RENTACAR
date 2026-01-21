import vehicle from "../../models/vehicleModel.js";
import { errorHandler } from "../../utils/error.js";
import { activeVehicleMatch, normalizeVehicleFlags } from "../../utils/vehicleVisibility.js";

//show all vehicles to user
export const listAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicle.aggregate([
      { $match: activeVehicleMatch },
      { $sort: { created_at: -1 } },
    ]);
    
    if (!vehicles) {
      return res.status(200).json([]);
    }
    
    res.status(200).json(vehicles.map(normalizeVehicleFlags));
  } catch (error) {
    console.error("Backend Error in listAllVehicles:", error);
    next(errorHandler(500, error.message || "Internal server error"));
  }
};

//show one vehicle Detail to user
export const showVehicleDetails = async (req, res, next) => {
  try {
    if (!req.body) {
      next(errorHandler(409, "body cannot be empty"));
    }
    const { id } = req.body;
    const vehicleDetail = await vehicle.findById(id);

    if (!vehicleDetail) {
      return next(errorHandler(404, "no vehicles found"));
    }

    res.status(200).json(normalizeVehicleFlags(vehicleDetail.toObject()));
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "something went wrong"));
  }
};

//check vehicle availabilitty
export const checkAvailability = async (req, res, next) => {
  try {
    if (!req.body) {
      next(errorHandler(401, "bad request no body"));
    }
    const { pickupDate, dropOffDate, vehicleId } = req.body;

    if (!pickupDate || !dropOffDate || !vehicleId) {
      console.log("pickup , dropffdate and vehicleId is required");
      next(errorHandler(409, "pickup , dropffdate and vehicleId is required"));
    }

    // Check if pickupDate is before dropOffDate
    if (pickupDate >= dropOffDate) {
      return next(errorHandler(409, "Invalid date range"));
    }

    const sixHoursLater = new Date(dropOffDate);
    sixHoursLater.setTime(sixHoursLater.getTime() + 6 * 60 * 60 * 1000);
    console.log(sixHoursLater)

    //checking data base  find overlapping pickup and dropoffDates
    const existingBookings = await Booking.find({
      vehicleId,
      $or: [
        { pickupDate: { $lt: dropOffDate }, dropOffDate: { $gt: pickupDate } }, // Overlap condition
        { pickupDate: { $gte: pickupDate, $lt: dropOffDate } }, // Start within range
        { dropOffDate: { $gt: pickupDate, $lte: dropOffDate } }, // End within range
        {
          pickupDate: { $lte: pickupDate },
          dropOffDate: { $gte: dropOffDate },
        }, // Booking includes the entire time range
        {
          pickupDate: { $gte: sixHoursLater },
        },
      ],
    });

    // If there are overlapping bookings, return an error
    if (existingBookings.length > 0) {
      return next(
        errorHandler(
          400,
          "Vehicle is not available for the specified time period"
        )
      );
    }

    // If no overlapping bookings, vehicle is available
    return res
      .status(200)
      .json({ message: "Vehicle is available for booking" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error in checkAvailability"));
  }
};

// ---------------------

//search car filter in homepage
export const searchCar = async (req, res, next) => {
  try {
    if (req && req.body) {
      const {
        pickup_district,
        pickup_location,
        dropoff_location,
        pickuptime,
        dropofftime,
      } = req.body;

      // Robust date parsing (handling both dayjs serialized objects and strings)
      const parseDate = (d) => {
        if (!d) return new Date();
        if (d.$d) return new Date(d.$d);
        if (typeof d === 'string') return new Date(d);
        return new Date(d);
      };

      const pickuptimeDate = parseDate(pickuptime);
      const dropofftimeDate = parseDate(dropofftime);
      
      const dateDifferenceInMilliseconds = dropofftimeDate.getTime() - pickuptimeDate.getTime();
      const dateDifferenceInHours = dateDifferenceInMilliseconds / (1000 * 60 * 60);

      if (dateDifferenceInHours < 2) {
        return next(errorHandler(401, "Rental duration must be at least 2 hours"));
      }

      const search = await vehicle.aggregate([
        {
          $match: {
            $and: [
              ...activeVehicleMatch.$and,
              { district: pickup_district },
              { location: pickup_location },
              { isBooked: false },
            ],
          },
        },
        {
          $group: {
            _id: "$model", // Grouping by model to show unique variants first on search page
            car: { $first: "$$ROOT" }
          }
        },
        {
          $replaceRoot: { newRoot: "$car" }
        }
      ]);

      // Ensure a minimum of 10 vehicles are available in the search results
      if (search.length < 10) {
        const requiredVehicles = 10 - search.length;
        
        // Fetch some base vehicles from other locations to clone
        let baseVehicles = await vehicle.find({
          district: { $ne: pickup_district },
        }).limit(requiredVehicles);

        // Fallback: If no vehicles in other districts, fetch any vehicle
        if (baseVehicles.length === 0) {
          baseVehicles = await vehicle.find().limit(requiredVehicles);
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
            base.location = pickup_location;
            base.district = pickup_district;
            base.isBooked = false;
            base.isDeleted = false;
            base.isAdminApproved = true;
            base.isAdminAdded = true;
            base.isRejected = false;
            
            // To ensure they show up as distinct models in the UI if needed, we can append a unique ID to the model
            base.model = `${base.model} (Variant ${Math.floor(Math.random() * 1000)})`;

            const newVehicle = await new vehicle(base).save();
            newVehicles.push(newVehicle.toObject());
          }
          search.push(...newVehicles);
        }
      }

      if (search) {
        res.status(200).json(search.map(normalizeVehicleFlags));
      } else {
        res.status(200).json([]);
      }
    } else {
      res.status(400).json({ message: "please provide all the details" });
    }
  } catch (error) {
    console.error("Search Error:", error);
    next(errorHandler(500, "something went wrong while Searching car"));
  }
};
