const express = require("express");
const morgan = require("morgan");
const errorHandler = require('./middlewares/error.middleware')
const adminRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const couponRoutes = require("./routes/coupon.routes");
const blogRoutes = require("./routes/blog.routes");
const statsRoutes = require("./routes/stats.routes");
const faqRoutes = require("./routes/faq.routes");
const webblogsRoutes = require('./routes/webblog.routes')
const contactRoutes = require("./routes/contact.routes");
const adminContactMessageRoutes = require("./routes/adminContactMessage.routes");
const uploadRoutes = require("./routes/upload.routes");
const cors = require("cors");

const app = express();

const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://captaindiscounts.com",
  "https://www.captaindiscounts.com",
  "https://dealsnapr.vercel.app",
  "https://wiselyspent.vercel.app",
];

const extraOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])];

function isDevLocalhostOrigin(origin) {
  if (!origin || process.env.NODE_ENV === "production") return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== "http:") return false;
    return (
      u.hostname === "localhost" ||
      u.hostname === "127.0.0.1" ||
      u.hostname === "[::1]"
    );
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (isDevLocalhostOrigin(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/category", categoryRoutes);
app.use("/api/admin/brand", brandRoutes);
app.use("/api/admin/coupon", couponRoutes);
app.use("/api/admin/blog", blogRoutes);
app.use("/api/admin/stats", statsRoutes);
app.use("/api/admin/faq", faqRoutes);
app.use("/api/admin/webblog", webblogsRoutes);
app.use("/api/admin/contact-messages", adminContactMessageRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.use(errorHandler);

module.exports = app;
