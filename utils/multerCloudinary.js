import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "voting_app_candidates",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export const uploadCloud = multer({ storage });
