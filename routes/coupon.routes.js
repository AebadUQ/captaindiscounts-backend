const express = require("express");
const router = express.Router();
const couponController = require("../controllers/coupon.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
router.post("/create", authMiddleware, couponController.createCoupon);
router.get("/",couponController.getAllCoupons);

router.get("/:id",couponController.getCouponByID);
router.patch("/:id/use",couponController.updateUses)
module.exports = router;
