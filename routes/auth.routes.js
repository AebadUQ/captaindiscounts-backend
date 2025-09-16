const express = require("express");
const adminController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/create", adminController.createAdmin);
router.post("/login", adminController.loginAdmin);

module.exports = router;
