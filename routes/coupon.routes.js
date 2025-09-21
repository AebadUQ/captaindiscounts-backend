const express = require("express");
const router = express.Router();
const couponController = require("../controllers/coupon.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
router.post("/create", authMiddleware, couponController.createCoupon);
router.get("/promo-code",couponController.getCouponsWithBrandAndCategory)
router.patch("/use/:id",couponController.updateUses)

router.get("/",couponController.getAllCoupons);
router.get("/:id",couponController.getCouponByID);
router.put("/:id",couponController.updateCoupon);

router.delete("/:id",authMiddleware,couponController.deleteCoupon)

module.exports = router;
