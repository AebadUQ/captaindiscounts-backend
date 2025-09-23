const express = require("express");
const brandController = require("../controllers/brand.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create",authMiddleware, brandController.createBrand);
router.get("/", brandController.getAllBrands);
router.patch("/rate/:id", brandController.rateBrand);
router.get("/get-brand-profile/:id",brandController.getBrandProfile)

router.get("/:id", brandController.getBrandByID);
router.delete("/:id",authMiddleware, brandController.deleteBrand);
router.put("/:id", authMiddleware, brandController.updateBrand);

module.exports = router;
