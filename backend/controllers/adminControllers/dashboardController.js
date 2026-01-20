import { errorHandler } from "../../utils/error.js";
import vehicle from "../../models/vehicleModel.js";
import Vehicle from "../../models/vehicleModel.js";

import { uploader } from "../../utils/cloudinaryConfig.js";
import { dataUri } from "../../utils/multer.js";

//admin addVehicle
export const addProduct = async (req, res, next) => {
  try {
    if (!req.body) {
      return next(errorHandler(500, "body cannot be empty"));
    }

    const cloudName = process.env.CLOUD_NAME ? process.env.CLOUD_NAME.trim() : "";
    console.log("CLOUD_NAME from env:", process.env.CLOUD_NAME);
    const isCloudinaryMocked = !cloudName || cloudName === "placeholder" || cloudName === "";
    
    if (!req.files || req.files.length === 0) {
      if (isCloudinaryMocked) {
         // Mock files if not provided when using placeholder credentials
         req.files = [{
           originalname: 'mock_image.jpg',
           buffer: Buffer.from('mock buffer data'),
           mimetype: 'image/jpeg'
         }];
      } else {
         return next(errorHandler(500, "image cannot be empty"));
      }
    }

    const {
      registeration_number,
      vin,
      mileage,
      engine,
      exterior_color,
      drive_type,
      company,
      name,
      model,
      title,
      base_package,
      price,
      year_made,
      fuel_type,
      description,
      seat,
      transmition_type,
      registeration_end_date,
      insurance_end_date,
      polution_end_date,
      car_type,
      location,
      district,
    } = req.body;

    if (!registeration_number || !location || !district) {
      return next(errorHandler(400, "Registration number, location, and district are required"));
    }

    const uploadedImages = [];
    
    //converting the buffer to base64
      let fileDataUri = [];
      try {
        if (req.files && req.files.length > 0) {
          // ensure dataUri can process correctly
          fileDataUri = dataUri(req);
        }
      } catch (err) {
        console.warn("Failed to parse dataUri. Continuing with fallback...", err);
      }

      try {
        if (fileDataUri && fileDataUri.length > 0) {
          if (isCloudinaryMocked) {
             // Mock Cloudinary upload if not configured
             uploadedImages.push("https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600");
          } else {
            await Promise.all(
              fileDataUri.map(async (cur) => {
                try {
                  const result = await uploader.upload(cur.data, {
                    public_id: cur.filename || `vehicle_${Date.now()}`,
                  });
                  if (result && result.secure_url) {
                    uploadedImages.push(result.secure_url);
                  }
                } catch (error) {
                  console.error("Cloudinary upload failed for a file:", error);
                }
              })
            );
          }
        }
      } catch (err) {
        console.error("Cloudinary process threw an error:", err);
      }

      // Final fallback if array is empty
      if (uploadedImages.length === 0) {
         console.log("Fallback check. CLOUD_NAME:", process.env.CLOUD_NAME, "isMocked:", isCloudinaryMocked);
         if (isCloudinaryMocked) {
           uploadedImages.push("https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600");
         } else {
           console.error("Cloudinary returned no secure_urls, and mock is false");
           return next(errorHandler(500, "Could not upload any images to Cloudinary"));
         }
      }

      const addVehicle = new vehicle({
        registeration_number,
        vin: vin || undefined,
        mileage: mileage ? Number(mileage) : undefined,
        engine: engine || undefined,
        exterior_color: exterior_color || undefined,
        drive_type: drive_type || undefined,
        company,
        name,
        image: uploadedImages,
        model,
        car_title: title,
        car_description: description,
        base_package,
        price: price ? Number(price) : undefined,
        year_made: year_made ? Number(year_made) : undefined,
        fuel_type,
        seats: seat ? Number(seat) : undefined,
        transmition: transmition_type,
        insurance_end: insurance_end_date ? new Date(insurance_end_date) : undefined,
        registeration_end: registeration_end_date ? new Date(registeration_end_date) : undefined,
        pollution_end: polution_end_date ? new Date(polution_end_date) : undefined,
        created_at: Date.now(),
        location,
        district,
      });

      await addVehicle.save();
      res.status(200).json({
        message: "product added successfully",
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(errorHandler(409, `Vehicle with registration number ${req.body.registeration_number} already exists`));
      }
      console.error("Vehicle save error:", error);
      next(errorHandler(500, error.message || "Failed to save vehicle"));
    }
};

//show all vehicles to admin
export const showVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicle.find();

    if (!vehicles) {
      return next(errorHandler(404, "no vehicles found"));
    }

    res.status(200).json(vehicles);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "something went wrong"));
  }
};

//admin delete vehicle

export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id;
    if (!vehicle_id) {
      return;
    }

    const deleted = await Vehicle.findByIdAndUpdate(vehicle_id, {
      isDeleted: true,
    });
    if (!deleted) {
      return next(500, "not able to delete");
    }
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "something went wrong"));
  }
};

//edit vehicle listed by admin

export const editVehicle = async (req, res, next) => {
  try {
    //get the id of vehicle to edit through req.params
    const vehicle_id = req.params.id;

    if (!vehicle_id) {
      return next(errorHandler(401, "cannot be empty"));
    }

    if (!req.body || !req.body.formData) {
      return next(errorHandler(404, "Add data to edit first"));
    }

    const {
      registeration_number,
      vin,
      mileage,
      engine,
      exterior_color,
      drive_type,
      company,
      name,
      model,
      title,
      base_package,
      price,
      year_made,
      description,
      Seats,
      transmitionType,
      Registeration_end_date,
      insurance_end_date,
      polution_end_date,
      carType,
      fuelType,
      vehicleLocation,
      vehicleDistrict,
    } = req.body.formData;

    try {
      const edited = await Vehicle.findByIdAndUpdate(
        vehicle_id,
        {
          registeration_number,
          vin: vin || undefined,
          mileage: mileage ? Number(mileage) : undefined,
          engine: engine || undefined,
          exterior_color: exterior_color || undefined,
          drive_type: drive_type || undefined,
          company,
          name,
          model,
          car_title: title,
          car_description: description,
          base_package,
          price: price ? Number(price) : undefined,
          year_made: year_made ? Number(year_made) : undefined,
          fuel_type: fuelType,
          seats: Seats ? Number(Seats) : undefined,
          transmition: transmitionType,
          insurance_end: insurance_end_date ? new Date(insurance_end_date) : undefined,
          registeration_end: Registeration_end_date ? new Date(Registeration_end_date) : undefined,
          pollution_end: polution_end_date ? new Date(polution_end_date) : undefined,
          car_type: carType,
          isDeleted: false,
          updated_at: Date.now(),
          location: vehicleLocation,
          district: vehicleDistrict,
        },
        { new: true }
      );
      if (!edited) {
        return next(errorHandler(404, "data with this id not found"));
      }

      res.status(200).json(edited);
    } catch (error) {
      if (error.code == 11000 && error.keyPattern && error.keyValue) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        const duplicateValue = error.keyValue[duplicateField];

        return next(
          errorHandler(
            409,
            `${duplicateField} '${duplicateValue}' already exists`
          )
        );
      }
    }
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "something went wrong"));
  }
};
