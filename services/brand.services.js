const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");
const Brand = require('../models/brand.model');
const Category = require('../models/category.model')
const { deleteBrand } = require("../controllers/brand.controller");
const brandService = {
    createBrand: async ({ brandName, slug, storeurl, brandImage, affiliateUrl, description, categoryId }) => {

        // Slug uniqueness check
        const existing = await Brand.findOne({ where: { slug, deletedAt: null } });
        if (existing) throw new ApiError("Brand with this slug already exists", 400);

        // Create brand
        const brand = await Brand.create({ brandName, slug, storeurl, brandImage, affiliateUrl, description, categoryId });
        return brand;
    },
    getAllBrands: async ({ page = 1, limit = 10, search = "" }) => {
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const whereCondition = {
            deletedAt: null,
            ...(search
                ? {
                    [Op.or]: [
                        { brandName: { [Op.iLike]: `%${search}%` } },
                        { slug: { [Op.iLike]: `%${search}%` } },
                    ],
                }
                : {}),
        };

        const { rows, count } = await Brand.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: Category,
                    where: { deletedAt: null },
                    attributes: ["id", "name"], 
                },
            ],
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

  getBrandByID: async (id) => {
  const brand = await Brand.findOne({
    where: { id, deletedAt: null },
    include: [
      {
        model: Category,
        attributes: ["id", "name"], // only fetch id and name
      },
    ],
  });

  if (!brand) {
    throw new ApiError("No Brand found", 404);
  }

  return brand;
},

    deleteBrand: async (id) => {
        const brand = await Brand.findOne({ where: { id, deletedAt: null } });
        if (!brand) {
            throw new ApiError("Brand not found", 404);
        }

        await brand.destroy(); // soft delete
        return { message: "Brand deleted successfully" };
    },
  updateBrand: async (id, updateData) => {
    // 1️⃣ Find the brand
    const brand = await Brand.findOne({ where: { id, deletedAt: null } });
    if (!brand) throw new ApiError(404, "Brand not found");

    // 2️⃣ Handle categoryId update
   // 2️⃣ Handle categoryId update
if ("categoryId" in updateData && updateData.categoryId !== brand.categoryId) {
    if (!updateData.categoryId) {
        // prevent unsetting
        throw new ApiError(400, "Category must be selected");
    } else {
        const category = await Category.findOne({ where: { id: updateData.categoryId, deletedAt: null } });
        if (!category) throw new ApiError(404, "Category not found");
        brand.categoryId = updateData.categoryId;
    }
}


    // 3️⃣ Handle slug update for uniqueness
    if ("slug" in updateData && updateData.slug !== brand.slug) {
        const existing = await Brand.findOne({ where: { slug: updateData.slug, deletedAt: null } });
        if (existing) throw new ApiError(400, "Slug already exists for an active Brand");
        brand.slug = updateData.slug;
    }

    // 4️⃣ Dynamically update all other fields except slug and categoryId
    Object.keys(updateData).forEach((key) => {
        if (!["slug", "categoryId"].includes(key) && updateData[key] !== undefined) {
            brand[key] = updateData[key];
        }
    });

    // 5️⃣ Save and return the brand
    await brand.save();
    return brand;
}

};

module.exports = brandService;
