import MasterData from '../../models/masterDataModel.js'
import { v4 as uuidv4 } from 'uuid';
import { errorHandler } from "../../utils/error.js";
import { buildIndiaLocationEntries, getDistrictStateMap } from "../../utils/indiaLocationCatalog.js";
import Vehicle from "../../models/vehicleModel.js";

const dummyData = [

    //kochi
    { id: uuidv4(), district: 'Kochi', location: 'kalamassery : skoda service', type: 'location' },
    { id: uuidv4(), district: 'Kochi', location: 'kalamassery : volkswagen', type: 'location' },
    { id: uuidv4(), district: 'Kochi', location: 'cheranallur : volkswagen', type: 'location' },

    //kottayam

    { id: uuidv4(), district: 'Kottayam', location: 'ettumanoor : skoda service', type: 'location' },
    { id: uuidv4(), district: 'Kottayam', location: 'kottayam : railway station', type: 'location' },
    { id: uuidv4(), district: 'Kottayam', location: 'thellakom : volkswagen', type: 'location' },

    //trivandrum

    { id: uuidv4(), district: 'Trivandrum', location: 'Nh 66 bybass : kochuveli railway station', type: 'location' },
    { id: uuidv4(), district: 'Trivandrum', location: 'tampanur : central railway station', type: 'location' },
    { id: uuidv4(), district: 'Trivandrum', location: 'kazhakootam : railway station', type: 'location' },

    //thrissur
    { id: uuidv4(), district: 'Thrissur', location: 'thrissur : railway station', type: 'location' },
    { id: uuidv4(), district: 'Thrissur', location: 'valarkavu : near ganam theater', type: 'location' },
    { id: uuidv4(), district: 'Thrissur', location: 'paliyekara : evm mg', type: 'location' },
    

    //calicut
    { id:uuidv4() , district: 'Calicut', location: 'calicut : railway', type: 'location' },
    { id: uuidv4(), district: 'Calicut', location: 'calicut : airport', type: 'location' },
    { id: uuidv4(), district: 'Calicut', location: 'pavangad : evm nissan', type: 'location' },
    

    //cars


    //alto
    { id: uuidv4(), model: 'Alto 800', variant: 'manual', type: 'car' , brand:'maruthi' },
    { id: uuidv4(), model: 'Alto 800', variant: 'automatic', type: 'car' , brand:'maruthi' },
    { id: uuidv4(), model: 'SKODA SLAVIA PETROL AT', variant: 'automatic', type: 'car' , brand:'maruthi' },
    { id: uuidv4(), model: 'NISSAN MAGNITE PETROL MT', variant: 'manual', type: 'car' , brand:'nissan' },
    { id: uuidv4(), model: 'SKODA KUSHAQ Petrol MT', variant: 'manual', type: 'car' , brand:'skoda' },
    { id: uuidv4(), model: 'SKODA KUSHAQ Petrol AT', variant: 'automatic', type: 'car' , brand:'skoda' },
    { id: uuidv4(), model: 'MG HECTOR Petrol MT', variant: 'manual', type: 'car' , brand:'mg' },
    { id: uuidv4(), model: 'MG HECTOR Petrol AT', variant: 'automatic', type: 'car' , brand:'mg' },
    { id: uuidv4(), model: 'MG HECTOR Diesel MT', variant: 'manual', type: 'car' , brand:'mg' },
    { id: uuidv4(), model: 'NISSAN TERRANO Diesel MT', variant: 'manual', type: 'car' , brand:'nissan' },
    { id: uuidv4(), model: 'NISSAN KICKS Petrol MT', variant: 'manual', type: 'car' , brand:'nissan' },
    { id: uuidv4(), model: 'NISSAN KICKS Petrol AT', variant: 'manual', type: 'car' , brand:'nissan' },
    { id: uuidv4(), model: 'VW TAIGUN Petrol MT', variant: 'manual', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'NISSAN MAGNITE Petrol MT', variant: 'manual', type: 'car' , brand:'nissan' },
    { id: uuidv4(), model: 'HYUNDAI ALCAZAR Diesel AT', variant: 'automatic', type: 'car' , brand:'hyundai' },
    { id: uuidv4(), model: 'CITROEN C3 Petrol MT', variant: 'automatic', type: 'car' , brand:'citroen' },
    { id: uuidv4(), model: 'ISUZU MUX Diesel AT', variant: 'automatic', type: 'car' , brand:'isuzu' },
    { id: uuidv4(), model: 'MG HECTOR PLUS Petrol MT', variant: 'manual', type: 'car' , brand:'mg' },
    { id: uuidv4(), model: 'MG HECTOR PLUS Petrol AT', variant: 'automatic', type: 'car' , brand:'mg' },
    { id: uuidv4(), model: 'MG HECTOR PLUS Diesel MT', variant: 'manual', type: 'car' , brand:'mg' },


    { id: uuidv4(), model: 'MARUTI SWIFT Petrol AT', variant: 'automatic', type: 'car' , brand:'maruthi' },
    { id: uuidv4(), model: 'DATSUN REDI GO Petrol MT', variant: 'manual', type: 'car' , brand:'DATSUN' },
    { id: uuidv4(), model: 'DATSUN REDI GO Petrol AT', variant: 'automatic', type: 'car' , brand:'DATSUN' },
    { id: uuidv4(), model: 'NISSAN MICRA Petrol MT', variant: 'automatic', type: 'car' , brand:'NISSAN' },
    { id: uuidv4(), model: 'VW AMEO Diesel MT', variant: 'manual', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'SKODA RAPID Petrol MT', variant: 'manual', type: 'car' , brand:'skoda' },
    { id: uuidv4(), model: 'MARUTI DZIRE Petrol MT', variant: 'manual', type: 'car' , brand:'maruthi' },
    { id: uuidv4(), model: 'VW VENTO Petrol MT', variant: 'manual', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'VW VENTO Petrol AT', variant: 'automatic', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'VW VENTO Diesel AT', variant: 'automatic', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'VW POLO Petrol MT', variant: 'manual', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'VW POLO Petrol AT', variant: 'automatic', type: 'car' , brand:'volkswagen' },
    { id: uuidv4(), model: 'VW POLO Diesel MT', variant: 'manual', type: 'car' , brand:'volkswagen' },
    

    

  ];

const seedCarCatalogIfEmpty = async () => {
  const existingCarCount = await MasterData.countDocuments({ type: "car" });
  if (existingCarCount > 0) {
    return;
  }

  const carSeedData = dummyData.filter((item) => item.type === "car");
  if (carSeedData.length > 0) {
    await MasterData.insertMany(carSeedData, { ordered: false });
  }
};

const seedIndiaLocationsIfMissing = async () => {
  const existingIndiaLocationCount = await MasterData.countDocuments({
    type: "location",
    id: { $regex: "^india-location:" },
  });

  if (existingIndiaLocationCount > 0) {
    return { inserted: 0, total: existingIndiaLocationCount };
  }

  const entries = buildIndiaLocationEntries();
  if (entries.length === 0) {
    return { inserted: 0, total: 0 };
  }

  const operations = entries.map((entry) => ({
    updateOne: {
      filter: { id: entry.id },
      update: { $set: entry },
      upsert: true,
    },
  }));

  await MasterData.bulkWrite(operations, { ordered: false });
  return { inserted: entries.length, total: entries.length };
};

const syncVehicleLocationsIntoMasterData = async () => {
  const districtStateMap = getDistrictStateMap();
  const vehicles = await Vehicle.find({
    isDeleted: { $ne: true },
    district: { $exists: true, $ne: "" },
    location: { $exists: true, $ne: "" },
  }).lean();

  if (vehicles.length === 0) {
    return 0;
  }

  const operations = vehicles.map((vehicle) => {
    const state = districtStateMap.get(vehicle.district) || "Custom";
    const id = `vehicle-location:${vehicle.district}:${vehicle.location}`.toLowerCase().replace(/[^a-z0-9:]+/g, "-");

    return {
      updateOne: {
        filter: { id },
        update: {
          $set: {
            id,
            type: "location",
            state,
            district: vehicle.district,
            location: vehicle.location,
          },
        },
        upsert: true,
      },
    };
  });

  await MasterData.bulkWrite(operations, { ordered: false });
  return operations.length;
};

const normalizeLegacyLocationStates = async () => {
  const districtStateMap = getDistrictStateMap();
  const legacyLocations = await MasterData.find({
    type: "location",
    $or: [{ state: { $exists: false } }, { state: null }, { state: "" }],
  }).lean();

  if (legacyLocations.length === 0) {
    return 0;
  }

  const operations = legacyLocations
    .map((entry) => {
      const state = districtStateMap.get(entry.district);
      if (!state) {
        return null;
      }

      return {
        updateOne: {
          filter: { _id: entry._id },
          update: { $set: { state } },
        },
      };
    })
    .filter(Boolean);

  if (operations.length === 0) {
    return 0;
  }

  await MasterData.bulkWrite(operations, { ordered: false });
  return operations.length;
};
  
  // Function to insert dummy data into the database
 export async function insertDummyData(req, res, next) {
    try {
        await MasterData.insertMany(dummyData);
        console.log('Dummy data inserted successfully.');
        res.status(200).json({ message: "Dummy data seeded." });
    } catch (error) {
        console.error('Error inserting dummy data:', error);
        res.status(500).json({ message: "Failed to seed dummy data" });
    }
    finally{
        console.log("Dummy data insert process completed.");
    }
  }

//app product modal data fetching from db
  export const getCarModelData = async (req,res,next)=> {
    try{
            await seedCarCatalogIfEmpty();
            await seedIndiaLocationsIfMissing();
            await normalizeLegacyLocationStates();
            await syncVehicleLocationsIntoMasterData();
            const availableVehicleModels  = await MasterData.find()
              .sort({ type: 1, state: 1, district: 1, location: 1, brand: 1, model: 1 });
            if(!availableVehicleModels){
                return next(errorHandler(404,"no model found"))
            }
            res.status(200).json(availableVehicleModels)
    }
    catch(error){
        next(errorHandler(500,{'could not get model Data':error}))
    }
  }
  

  
export const addMasterData = async (req, res, next) => {
    try {
        const { type, state, district, location, brand, model, variant } = req.body;

        if (!type) {
            return next(errorHandler(400, "Master data type is required"));
        }

        if (type === "location" && (!state || !district || !location)) {
            return next(errorHandler(400, "State, district, and location are required"));
        }

        const duplicateQuery =
            type === "location"
                ? { type, state, district, location }
                : { type, brand, model, variant };

        const existing = await MasterData.findOne(duplicateQuery);
        if (existing) {
            return res.status(409).json({ message: "Master data entry already exists", data: existing });
        }

        const newData = new MasterData({
            id: uuidv4(),
            type,
            state,
            district,
            location,
            brand,
            model,
            variant
        });
        await newData.save();
        res.status(200).json({ message: "Master data added successfully", data: newData });
    } catch (error) {
        next(errorHandler(500, "Error adding master data"));
    }
}

export const seedIndiaLocations = async (req, res, next) => {
    try {
        const result = await seedIndiaLocationsIfMissing();
        res.status(200).json({
            message: result.inserted > 0 ? "India location catalog imported successfully" : "India location catalog already available",
            ...result,
        });
    } catch (error) {
        console.error("Error importing India locations:", error);
        next(errorHandler(500, "Failed to import India location catalog"));
    }
}

export const deleteMasterData = async (req, res, next) => {
    try {
        const { id } = req.params;
        await MasterData.findOneAndDelete({ id });
        res.status(200).json({ message: "Master data deleted successfully" });
    } catch (error) {
        next(errorHandler(500, "Error deleting master data"));
    }
}
