const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const statsController = require("../controllers/stats.controller");
router.get("/get-stats", authMiddleware, statsController.getStats);

module.exports = router;
