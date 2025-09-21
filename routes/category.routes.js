const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
router.post("/create", authMiddleware, categoryController.createCategory);
router.get("/category-with-brands", categoryController.getCategoryWithBrands);
router.get("/", authMiddleware, categoryController.getAllCategories);
router.get("/:id", authMiddleware, categoryController.getCategoryByID);
router.delete("/:id", authMiddleware, categoryController.deleteCategory);
router.put("/:id", authMiddleware, categoryController.updateCategory);



module.exports = router;
