const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

router.post("/", authMiddleware, (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "Image too large (max 10 MB)" });
        }
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message || "Upload failed" });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
      process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        error:
          "Cloudinary not configured on API server (set CLOUDINARY_* in backend .env).",
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No file received" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "captaindiscounts", resource_type: "image" },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      stream.end(req.file.buffer);
    });

    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error("[upload]", err);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
});

module.exports = router;
