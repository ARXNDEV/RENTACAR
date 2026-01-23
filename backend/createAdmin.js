import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import User from "./models/userModel.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

const seedDefaults = async () => {
  try {
    // 1. Create Default Admin
    const adminEmail = "admin@rentaride.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = bcryptjs.hashSync("admin123", 10);
      const adminUser = new User({
        username: "Admin",
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
        isUser: false,
        isVendor: false,
      });
      await adminUser.save();
      console.log("Default admin created: admin@rentaride.com / admin123");
    } else {
      console.log("Default admin already exists.");
    }

    // 2. Create Default User
    const userEmail = "user@rentaride.com";
    const existingUser = await User.findOne({ email: userEmail });

    if (!existingUser) {
      const userHashedPassword = bcryptjs.hashSync("user123", 10);
      const regularUser = new User({
        username: "Standard User",
        email: userEmail,
        password: userHashedPassword,
        isAdmin: false,
        isUser: true,
        isVendor: false,
        phoneNumber: "0000000000" // Changed to avoid collision
      });
      await regularUser.save();
      console.log("Default user created: user@rentaride.com / user123");
    } else {
      console.log("Default user already exists.");
    }

  } catch (error) {
    console.error("Error seeding default accounts:", error);
  }
};

export default seedDefaults;
