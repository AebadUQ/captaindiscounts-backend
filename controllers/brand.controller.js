const Category = require("../models/category.model");
const brandService = require("../services/brand.services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const brandController = {
    createBrand: catchAsync(async (req, res) => {
        const { brandName, slug, storeurl, brandImage, affiliateUrl, description, categoryId } = req.body;

        if (!brandName || !slug || !brandImage || !storeurl || !affiliateUrl || !description || !categoryId) {
            throw new ApiError("Name, slug, storeurl, affiliateUrl, description, categoryId and brandImage are required", 400);
        }
        const isCategory = await Category.findOne({ where: { id: categoryId, deletedAt: null } })
        if (!isCategory) {
            throw new ApiError("Category Not Found", 404);

        }
        const brand = await brandService.createBrand(
           req.body
        );

        res.status(201).json({
            success: true,
            message: "Brand created successfully",
            data: brand,
        });
    })

}
module.exports = brandController;
