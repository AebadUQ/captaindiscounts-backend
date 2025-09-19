const couponService = require("../services/coupon.services");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const couponController = {
    createCoupon: catchAsync(async (req, res) => {
        const couponData = req.body;

        const coupon = await couponService.createCoupon(couponData);

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            data: coupon,
        });
    }),
    getAllCoupons: catchAsync(async (req, res) => {
        const { page, limit, search } = req.query;
        const result = await couponService.getAllCoupons({ page, limit, search });

        res.status(200).json({
            success: true,
            message: "Coupons fetched successfully",
            data: result,
        });
    }),
    getCouponByID: catchAsync(async (req, res) => {

        const category = await couponService.getCouponByID(req.params.id)
        res.status(200).json({
            success: true,
            message: "Coupon fetched successfully",
            data: category,
        });
    }),
    updateCoupon: catchAsync(async (req, res) => {
        const { id } = req.params;
        const updateData = req.body;

        const coupon = await couponService.updateCoupon(id, updateData);

        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            data: coupon,
        });
    }),
    updateUses: catchAsync(async (req, res) => {
        const { id } = req.params;

        const coupon = await couponService.updateUse(id);

        res.status(200).json({
            success: true,
            message: "Uses updated successfully",
            data: coupon,
        });
    }),

}
module.exports = couponController;
