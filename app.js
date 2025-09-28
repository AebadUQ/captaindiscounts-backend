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
const allowedOrigins = [
  "http://localhost:3000",
  "https://captaindiscounts.com"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow curl or server-to-server requests
    if(allowedOrigins.indexOf(origin) === -1){
      let msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // allow cookies or auth headers
}));

// Handle preflight OPTIONS requests globally
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

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

module.exports = app;
