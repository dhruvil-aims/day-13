// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + "-" + file.originalname),
// });

// export default multer({ storage });
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blogs",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

export default upload;