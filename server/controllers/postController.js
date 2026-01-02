import express from "express";
import Post from "../models/Post.js";
import upload from "../middleware/upload.js";

// GET all posts (PUBLIC)
export const getBlogs = async (req, res) => {
  try {
    const { page = 1, search = "", category } = req.query;
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

export const getBlogById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name");
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
    const { page = 1, search = "", category } = req.query;
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
    const post = await Post.findById(req.params.id).populate("author", "name");
    if(!post) return res.status(404).json({ error: "Post not found"});
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

// CREATE post (LOGIN REQUIRED)
export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    let errors = {};
    if (!title) errors.title = "Title required";
    if (!content) errors.content = "Content required";
    if (!category) errors.category = "Category required";

    if (Object.keys(errors).length)
      return res.status(400).json({ errors });

    const post = await Post.create({
      title,
      content,
      category,
      tags: tags ? tags.split(",") : [],
      image: req.file ? req.file?.path : null,
      author: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
};

// UPDATE post (LOGIN REQUIRED)
export const updatePost = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags: req.body.tags,
    };

    if (req.file) {
      updateData.image = req.file?.path;
    }

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!post)
      return res.status(404).json({ message: "Not found or unauthorized" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to update post" });
  }
};

// DELETE post (LOGIN REQUIRED)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!post)
      return res.status(404).json({ message: "Not found or unauthorized" });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};

// Like post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.includes(req.user.id);

    if (liked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to like the post" });
  }
};

export const commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!req.body.text) return res.status(404).json({ message: "Comment is required." });

    post.comments.push({
      text: req.body.text,
      user: req.user.id,
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to comment on post" });
  }
};

