const express = require("express");
const adminController = require("../controllers/auth.controller");
const {
  authMiddleware,
  allowCreateAdminIfBootstrapOrAuth,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/create",
  allowCreateAdminIfBootstrapOrAuth,
  adminController.createAdmin
);
router.post("/login", adminController.loginAdmin);
router.get("/me", authMiddleware, adminController.getCurrentAdmin);

module.exports = router;
