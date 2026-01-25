import express from "express"
import { adminAuth, adminProfiile, allUsers, allVendors } from "../controllers/adminControllers/adminController.js"
import { signIn } from "../controllers/authController.js"
import { signOut  } from "../controllers/userControllers/userController.js"
import { addProduct, deleteVehicle, editVehicle,  } from "../controllers/adminControllers/dashboardController.js"
import { showVehicles } from "../controllers/adminControllers/dashboardController.js"
import { multerUploads } from "../utils/multer.js"
import { addMasterData, deleteMasterData, getCarModelData, insertDummyData, seedIndiaLocations } from "../controllers/adminControllers/masterCollectionController.js"
import { approveVendorVehicleRequest, fetchVendorVehilceRequests, rejectVendorVehicleRequest } from "../controllers/adminControllers/vendorVehilceRequests.js"
import { allBookings, changeStatus } from "../controllers/adminControllers/bookingsController.js"
import { verifyToken } from "../utils/verifyUser.js"





const router = express.Router()

router.post('/dashboard',signIn,adminAuth)
router.post('/profile',adminProfiile)
router.get('/signout',signOut)
router.post('/addProduct',multerUploads,addProduct)
router.get('/showVehicles',showVehicles)
router.delete('/deleteVehicle/:id',deleteVehicle)
router.put('/editVehicle/:id',editVehicle)
router.get('/dummyData',insertDummyData)
router.get('/getVehicleModels',getCarModelData)
router.get('/fetchVendorVehilceRequests',fetchVendorVehilceRequests)
router.post('/approveVendorVehicleRequest',approveVendorVehicleRequest)
router.post('/rejectVendorVehicleRequest',rejectVendorVehicleRequest)
router.get('/allBookings',allBookings)
router.post('/changeStatus',changeStatus)
router.get('/allUsers',allUsers)
router.get('/allVendors',allVendors)
router.get('/allVehicles',showVehicles)
router.get('/latestbookings',allBookings)
router.post('/addMasterData', addMasterData)
router.post('/seedIndiaLocations', seedIndiaLocations)
router.delete('/deleteMasterData/:id', deleteMasterData)

export default router
