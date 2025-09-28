const express = require("express");
const webBlogController = require("../controllers/webblog.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// Create a new web blog
router.post("/create", authMiddleware, webBlogController.createWebBlog);

// Get all web blogs
router.get("/", webBlogController.getAllWebBlogs);

// Get a single web blog by ID
router.get("/:id", webBlogController.getWebBlogByID);
router.get("/slug/:slug", webBlogController.getWebBlogBySlug);

// Update a web blog by ID
router.put("/:id", authMiddleware, webBlogController.updateWebBlog);

// Delete a web blog by ID
router.delete("/:id", authMiddleware, webBlogController.deleteWebBlog);

module.exports = router;
