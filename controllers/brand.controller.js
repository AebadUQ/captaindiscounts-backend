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
    }),

    getAllBrands: catchAsync(async (req, res) => {
        const { page, limit, search } = req.query;
        const result = await brandService.getAllBrands({ page, limit, search });

        res.status(200).json({
            success: true,
            message: "Brands fetched successfully",
            data: result,
        });
    }),
    getBrandByID: catchAsync(async (req, res) => {

        const brand = await brandService.getBrandByID(req.params.id)
        res.status(200).json({
            success: true,
            message: "Brand fetched successfully",
            data: brand,
        });
    },


    ),
    deleteBrand: catchAsync(async (req, res) => {
        const result = await brandService.deleteBrand(req.params.id);
        res.status(200).json({
            success: true,
            ...result,
        });
    }),
    updateBrand: catchAsync(async (req, res) => {
        const { id } = req.params;
        const updateData = req.body;

        const updatedBrand = await brandService.updateBrand(id, updateData)
        res.status(200).json({
            success: true,
            data: updatedBrand,
        });
    })

}
module.exports = brandController;
