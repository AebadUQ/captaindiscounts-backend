const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");
const Brand = require('../models/brand.model')
const brandService = {
    createBrand: async ({ brandName, slug, storeurl, brandImage, affiliateUrl, description, categoryId }) => {

        // Slug uniqueness check
        const existing = await Brand.findOne({ where: { slug, deletedAt: null } });
        if (existing) throw new ApiError("Brand with this slug already exists", 400);

        // Create brand
        const brand = await Brand.create({ brandName, slug, storeurl, brandImage, affiliateUrl, description, categoryId });
        return brand;
    }
};

module.exports = brandService;
