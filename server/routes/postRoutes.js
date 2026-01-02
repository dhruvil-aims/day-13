import express from "express";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { getPosts, createPost, getPostById, updatePost, deletePost, likePost, commentPost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", auth, getPosts);
router.post("/", auth, upload.single("image"), createPost);
router.get("/:id", auth, getPostById);
router.put("/:id", auth, upload.single("image"), updatePost);
router.delete("/:id", auth, deletePost);
router.post("/:id/like", auth, likePost);
router.post("/:id/comment", auth, commentPost);

export default router;
