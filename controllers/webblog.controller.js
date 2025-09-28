const catchAsync = require("../utils/catchAsync");
const webBlogService = require("../services/webblog.service");

const webBlogController = {
  createWebBlog: catchAsync(async (req, res) => {
    const webBlog = await webBlogService.createWebBlog(req.body);
    res.status(201).json({
      success: true,
      message: "WebBlog created successfully",
      data: webBlog,
    });
  }),

  getAllWebBlogs: catchAsync(async (req, res) => {
    const { page, limit, search } = req.query;
    const result = await webBlogService.getAllWebBlogs({ page, limit, search });
    res.status(200).json({
      success: true,
      message: "WebBlogs fetched successfully",
      data: result,
    });
  }),

  getWebBlogByID: catchAsync(async (req, res) => {
    const webBlog = await webBlogService.getWebBlogByID(req.params.id);
    res.status(200).json({
      success: true,
      message: "WebBlog fetched successfully",
      data: webBlog,
    });
  }),
 getWebBlogBySlug: catchAsync(async (req, res) => {
    const webBlog = await webBlogService.getWebBlogBySlug(req.params.slug);
    res.status(200).json({
      success: true,
      message: "WebBlog fetched successfully",
      data: webBlog,
    });
  }),

  updateWebBlog: catchAsync(async (req, res) => {
    const updatedWebBlog = await webBlogService.updateWebBlog(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "WebBlog updated successfully",
      data: updatedWebBlog,
    });
  }),

  deleteWebBlog: catchAsync(async (req, res) => {
    const result = await webBlogService.deleteWebBlog(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  }),
};

module.exports = webBlogController;
