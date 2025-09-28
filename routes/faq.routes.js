const express = require("express");
const faqController = require("../controllers/faq.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create", authMiddleware, faqController.createFaq);
router.get("/", faqController.getAllFaqs);
router.get("/brand/:brandId", faqController.getFaqByBrand);
router.put("/:id", authMiddleware, faqController.updateFaq);
router.delete("/:id", authMiddleware, faqController.deleteFaq);

module.exports = router;
