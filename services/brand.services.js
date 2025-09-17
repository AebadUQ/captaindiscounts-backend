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
        const brand = await Brand.findOne({ where: { id, deletedAt: null } });
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
        const brand = await Brand.findOne({ where: { id, deletedAt: null } });
        if (!brand) throw new ApiError("Brand not found", 404);

        // 2️⃣ Check if categoryId is being updated
        if (updateData.categoryId && updateData.categoryId !== brand.categoryId) {
            const category = await Category.findOne({ where: { id: updateData.categoryId, deletedAt: null } });
            if (!category) throw new ApiError("Category not found", 404);
            brand.categoryId = updateData.categoryId;
        }

        // 3️⃣ Handle slug update separately for uniqueness
        if (updateData.slug && updateData.slug !== brand.slug) {
            const existing = await Brand.findOne({ where: { slug: updateData.slug, deletedAt: null } });
            if (existing) throw new ApiError("Slug already exists for an active Brand", 400);
            brand.slug = updateData.slug;
        }

        // 4️⃣ Dynamically update all other fields except slug and categoryId
        Object.keys(updateData).forEach(key => {
            if (!["slug", "categoryId"].includes(key) && updateData[key] !== undefined) {
                brand[key] = updateData[key];
            }
        });

        // 5️⃣ Save the brand
        await brand.save();
        return brand;
    }
};

module.exports = brandService;
