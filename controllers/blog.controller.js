const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const blogService = require("../services/blog.service");

const blogController = {
  createBlog: catchAsync(async (req, res) => {
    const blog = await blogService.createBlog(req.body);
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  }),

  getAllBlogs: catchAsync(async (req, res) => {
    const { page, limit, search } = req.query;
    const result = await blogService.getAllBlogs({ page, limit, search });
    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      data: result,
    });
  }),

  getBlogByID: catchAsync(async (req, res) => {
    const blog = await blogService.getBlogByID(req.params.id);
    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blog,
    });
  }),

  updateBlog: catchAsync(async (req, res) => {
    const updatedBlog = await blogService.updateBlog(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  }),

  deleteBlog: catchAsync(async (req, res) => {
    const result = await blogService.deleteBlog(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  }),
};

module.exports = blogController;
