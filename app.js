const express = require("express");
const morgan = require("morgan");
const errorHandler = require('./middlewares/error.middleware')
const adminRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const couponRoutes = require("./routes/coupon.routes");
const blogRoutes = require("./routes/blog.routes");

const cors = require("cors");

const app = express();
const allowedOrigins = ["http://localhost:3000", "https://myapp.com"];

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/category", categoryRoutes);
app.use("/api/admin/brand", brandRoutes);
app.use("/api/admin/coupon", couponRoutes);
app.use("/api/admin/blog", blogRoutes);


app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.use(errorHandler);

module.exports = app;
