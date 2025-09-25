const express = require("express");
const blogController = require("../controllers/blog.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// Create a new blog (only admin/authenticated users)
router.post("/create", authMiddleware, blogController.createBlog);

// Get all blogs (with optional pagination & search)
router.get("/", blogController.getAllBlogs);

// Get a single blog by ID
router.get("/:id", blogController.getBlogByID);

// Update a blog by ID (only admin/authenticated users)
router.put("/:id", authMiddleware, blogController.updateBlog);

// Delete a blog by ID (only admin/authenticated users)
router.delete("/:id", authMiddleware, blogController.deleteBlog);

module.exports = router;
