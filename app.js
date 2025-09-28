// server.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require('./middlewares/error.middleware');

const adminRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const couponRoutes = require("./routes/coupon.routes");
const blogRoutes = require("./routes/blog.routes");
const statsRoutes = require("./routes/stats.routes");
const faqRoutes = require("./routes/faq.routes");
const webblogsRoutes = require('./routes/webblog.routes');

const app = express();

// --- CORS CONFIG ---
const corsOptions = {
  origin: '*', // allow all domains
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("/*", cors(corsOptions)); // catch-all preflight OPTIONS

// --- MIDDLEWARES ---
app.use(express.json());
app.use(morgan("dev"));

// --- ROUTES ---
app.use("/api/admin", adminRoutes);
app.use("/api/admin/category", categoryRoutes);
app.use("/api/admin/brand", brandRoutes);
app.use("/api/admin/coupon", couponRoutes);
app.use("/api/admin/blog", blogRoutes);
app.use("/api/admin/stats", statsRoutes);
app.use("/api/admin/faq", faqRoutes);
app.use("/api/admin/webblog", webblogsRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// --- ERROR HANDLER ---
app.use(errorHandler);

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});

module.exports = app;
