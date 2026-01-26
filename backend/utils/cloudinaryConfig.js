import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary, uploader, config } from "cloudinary";


export const cloudinaryConfig = (req, res, next) => {
  const cloud_name = process.env.CLOUD_NAME;
  const api_key = process.env.API_KEY;
  const api_secret = process.env.API_SECRET;

  if (cloud_name && api_key && api_secret && cloud_name !== 'placeholder') {
    config({
      cloud_name,
      api_key,
      api_secret,
    });
  } else {
    // console.warn("Cloudinary is not configured correctly in .env");
  }

  next();
};

export { uploader, cloudinary };
