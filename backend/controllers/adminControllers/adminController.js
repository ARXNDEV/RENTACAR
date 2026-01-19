import User from "../../models/userModel.js";
import { errorHandler } from "../../utils/error.js";

export const adminAuth = async (req,res,next)=> {
    try{
        if(req.user.isAdmin){
            res.status(200).json({message:"admin loged in successfully"})
        }
        else{
            res.status(403).json({message:"only acces for admins"})
        }
    }
    catch(error){
        next(error)
    }
}

export const adminProfiile = async (req,res,next)=> {
    try{
        // Add profile logic if needed
        res.status(200).json({ message: "Admin profile view" });
    }
    catch(error){
        next(error)
    }
}

export const allUsers = async (req, res, next) => {
    try {
        const users = await User.find({ isAdmin: false, isVendor: false });
        res.status(200).json(users);
    } catch (error) {
        next(errorHandler(500, "Error fetching users"));
    }
}

export const allVendors = async (req, res, next) => {
    try {
        const vendors = await User.find({ isVendor: true });
        res.status(200).json(vendors);
    } catch (error) {
        next(errorHandler(500, "Error fetching vendors"));
    }
}

