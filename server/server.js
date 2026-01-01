import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
const app = express();

// app.use(cors());
app.use(cors({
  origin: [
      "http://localhost:5173", "https://69560aff9980f4adfac4de59--fancy-axolotl-a5aa93.netlify.app"],
  withCredentials: true,
}));

app.use(express.json());

// mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected."));
mongoose.connect(process.env.MONGODB_URI).then(() => console.log("MongoDB connected."));
console.log("Mongo URL:", process.env.MONGODB_URL);
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));