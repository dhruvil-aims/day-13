import express from "express";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

// GET all posts (PUBLIC)
export const getBlogs = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { page = 1, search = "", category } = req.query;console.log('d');
    const limit = 5;

    const query = {
      title: { $regex: search, $options: "i" },
    };

    if (category) query.category = category;

    const posts = await Post.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({ posts, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }

};

// GET single post by ID (PUBLIC)
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

// CREATE post (LOGIN REQUIRED)
export const createPost = async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags: req.body.tags,
      image: req.file ? req.file.filename : "",
      user: req.user.id, // from auth middleware
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
};

// UPDATE post (LOGIN REQUIRED)
export const updatePost = async (req, res) => {
  try {
    const updatedData = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags: req.body.tags,
    };

    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to update post" });
  }
};

// DELETE post (LOGIN REQUIRED)
export const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};
