const { Op } = require("sequelize");
const WebBlog = require("../models/webblog.model");
const ApiError = require("../utils/ApiError");

const webBlogService = {
  createWebBlog: async (data) => {
    const { title, slug, content } = data;
    if (!title || !slug || !content) {
      throw new ApiError(400, "title, slug, and content are required");
    }

    // Check slug uniqueness
    const existingSlug = await WebBlog.findOne({ where: { slug, deletedAt: null } });
    if (existingSlug) throw new ApiError(400, "Slug already exists");

    const webBlog = await WebBlog.create(data);
    return webBlog;
  },

  getAllWebBlogs: async ({ page = 1, limit = 10, search = "" }) => {
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const whereCondition = {
      deletedAt: null,
      ...(search ? { title: { [Op.iLike]: `%${search}%` } } : {}),
    };

    const { rows, count } = await WebBlog.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      data: rows,
      metaData: {
        total: count,
        page,
        pageSize: limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },
 getWebBlogBySlug: async (slug) => {
    const webBlog = await WebBlog.findOne({ where: { slug, deletedAt: null } });
    if (!webBlog) throw new ApiError(404, "WebBlog not found");
    return webBlog;
  },

  getWebBlogByID: async (id) => {
    const webBlog = await WebBlog.findOne({ where: { id, deletedAt: null } });
    if (!webBlog) throw new ApiError(404, "WebBlog not found");
    return webBlog;
  },

  updateWebBlog: async (id, updateData) => {
    const webBlog = await WebBlog.findOne({ where: { id, deletedAt: null } });
    if (!webBlog) throw new ApiError(404, "WebBlog not found");

    if (updateData.slug && updateData.slug !== webBlog.slug) {
      const existingSlug = await WebBlog.findOne({ where: { slug: updateData.slug, deletedAt: null } });
      if (existingSlug) throw new ApiError(400, "Slug already exists");
      webBlog.slug = updateData.slug;
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== "slug" && updateData[key] !== undefined) {
        webBlog[key] = updateData[key];
      }
    });

    await webBlog.save();
    return webBlog;
  },

  deleteWebBlog: async (id) => {
    const webBlog = await WebBlog.findOne({ where: { id, deletedAt: null } });
    if (!webBlog) throw new ApiError(404, "WebBlog not found");

    await webBlog.destroy();
    return { message: "WebBlog deleted successfully" };
  },
};

module.exports = webBlogService;
