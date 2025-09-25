const { Op } = require("sequelize");
const Blog = require("../models/blog.model");
const Brand = require("../models/brand.model");
const ApiError = require("../utils/ApiError");

const blogService = {
  createBlog: async (data) => {
    const { brandId, title, slug, content } = data;

    if (!brandId || !title || !slug || !content) {
      throw new ApiError(400, "brandId, title, slug and content are required");
    }

    // Check if brand exists
    const brand = await Brand.findOne({ where: { id: brandId, deletedAt: null } });
    if (!brand) throw new ApiError(404, "Brand not found");

    // Check if blog already exists for this brand
    const existingBlog = await Blog.findOne({ where: { brandId, deletedAt: null } });
    if (existingBlog) throw new ApiError(400, "This brand already has a blog");

    // Check slug uniqueness
    const existingSlug = await Blog.findOne({ where: { slug, deletedAt: null } });
    if (existingSlug) throw new ApiError(400, "Slug already exists");

    const blog = await Blog.create(data);
    return blog;
  },

  getAllBlogs: async ({ page = 1, limit = 10, search = "" }) => {
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const whereCondition = {
      deletedAt: null,
      ...(search
        ? { title: { [Op.iLike]: `%${search}%` } }
        : {}),
    };

    const { rows, count } = await Blog.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [{ model: Brand, as: "brand", attributes: ["id", "brandName"] }],
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

  getBlogByID: async (id) => {
    const blog = await Blog.findOne({
      where: { id, deletedAt: null },
      include: [{ model: Brand, as: "brand", attributes: ["id", "brandName"] }],
    });

    if (!blog) throw new ApiError(404, "Blog not found");
    return blog;
  },

  updateBlog: async (id, updateData) => {
    const blog = await Blog.findOne({ where: { id, deletedAt: null } });
    if (!blog) throw new ApiError(404, "Blog not found");

    // Update slug uniqueness if changed
    if (updateData.slug && updateData.slug !== blog.slug) {
      const existingSlug = await Blog.findOne({ where: { slug: updateData.slug, deletedAt: null } });
      if (existingSlug) throw new ApiError(400, "Slug already exists");
      blog.slug = updateData.slug;
    }

    // Update brandId check
    if (updateData.brandId && updateData.brandId !== blog.brandId) {
      const brand = await Brand.findOne({ where: { id: updateData.brandId, deletedAt: null } });
      if (!brand) throw new ApiError(404, "Brand not found");

      const existingBlog = await Blog.findOne({ where: { brandId: updateData.brandId, deletedAt: null } });
      if (existingBlog) throw new ApiError(400, "This brand already has a blog");

      blog.brandId = updateData.brandId;
    }

    // Update other fields
    Object.keys(updateData).forEach((key) => {
      if (!["slug", "brandId"].includes(key) && updateData[key] !== undefined) {
        blog[key] = updateData[key];
      }
    });

    await blog.save();
    return blog;
  },

  deleteBlog: async (id) => {
    const blog = await Blog.findOne({ where: { id, deletedAt: null } });
    if (!blog) throw new ApiError(404, "Blog not found");

    await blog.destroy(); // soft delete
    return { message: "Blog deleted successfully" };
  },
};

module.exports = blogService;
