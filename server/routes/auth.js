import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
// router.post("/register", async (req, res) => {
//   const hashed = await bcrypt.hash(req.body.password, 10);
//   const user = await User.create({ ...req.body, password: hashed });
//   res.json(user);
// });
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let errors = {};

  if (!name) errors.name = "Name is required";
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (password && password.length < 6)
    errors.password = "Password must be at least 6 characters";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      errors: { email: "Email already exists" },
    });
  }
  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashed });
  await user.save();

  res.json({ message: "Registered successfully" });
});


// Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({match: "User Not found."});

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json({match: "Invalid"});

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user });
});

export default router;
