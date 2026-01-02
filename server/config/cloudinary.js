import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
cloudinary.config({
  cloud_name: "dg3ncqeqh",
  api_key: "874488624476642",
  api_secret: "8BS8oPG0bXnjECJKYauHPqmyO5Q",
});

export default cloudinary;