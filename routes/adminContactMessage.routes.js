const express = require("express");
const contactMessageController = require("../controllers/contactMessage.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, contactMessageController.listForAdmin);

module.exports = router;
