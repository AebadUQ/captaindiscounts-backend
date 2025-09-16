const express = require("express");
const morgan = require("morgan");
const errorHandler = require('./middlewares/error.middleware')
const adminRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/admin", adminRoutes);
app.use("/api/admin/category", categoryRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.use(errorHandler);

module.exports = app;
