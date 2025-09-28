const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");
const Brand =require("../models/brand.model");
const { Op } = require("sequelize");

const categoryService = {
    createCategory: async (name, slug, url, description) => {
        const existing = await Category.findOne({ where: { slug, deletedAt: null } });
        if (existing) {
            throw new ApiError(400,"Category with this slug already exists");
        }

        const category = await Category.create({ name, slug, url, description });
        return category;
    },
getCategoryWithBrand: async () => {
      const categories = await Category.findAll({
      where: { deletedAt: null },
      include: [
        {
          model: Brand,
                as: "brands", // 🔑 match alias here

          attributes: [
            "id",
            "brandName",
            "slug",
            "storeurl",
            "affiliateUrl",
            "brandImage",
            "description",
          ],
        },
      ],
      attributes: ["id", "name", "slug", "url", "description"],
    });

    // if (!categories || categories.length === 0) {
    //   throw new ApiError(404, "No categories found");
    // }

    return categories;
    },

    getAllCategories: async ({ page = 1, limit = 10, search = "" }) => {
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const whereCondition = {
            deletedAt: null,
            ...(search
                ? {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${search}%` } },
                        { slug: { [Op.iLike]: `%${search}%` } },
                    ],
                }
                : {}),
        };

        const { rows, count } = await Category.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        return {
            data: rows, // actual data
            metaData: {
                total: count,
                page,
                pageSize: limit,
                totalPages: Math.ceil(count / limit),
            },
        };
    },
    getCategoryByID: async (id) => {
        const category = await Category.findOne({ where: { id, deletedAt: null } });
        if (!category) {
            throw new ApiError(404,"No Category found");
        }
        return category;
    },
    deleteCategory: async (id) => {
        const category = await Category.findOne({ where: { id, deletedAt: null } });
        if (!category) {
            throw new ApiError(404,"Category not found");
        }

        await category.destroy(); // soft delete
        return { message: "Category deleted successfully" };
    },
    updateCategory: async (id, updateData) => {
  // Find the category (active only)
  const category = await Category.findOne({ where: { id, deletedAt: null } });
  if (!category) throw new ApiError(404,"Category not found");

  // Handle slug update separately for uniqueness
  if (updateData.slug && updateData.slug !== category.slug) {
    const existing = await Category.findOne({ where: { slug: updateData.slug, deletedAt: null } });
    if (existing) throw new ApiError(400,"Slug already exists for an active category");
    category.slug = updateData.slug;
  }

  // Dynamically update all other fields except slug
  Object.keys(updateData).forEach(key => {
    if (key !== "slug" && updateData[key] !== undefined) {
      category[key] = updateData[key];
    }
  });

  // Save the category
  await category.save();
  return category;
}

};

module.exports = categoryService;
