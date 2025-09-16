const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode, 
    message,
    // sirf development me stack dikhana
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    errors: err.errors || null, // agar koi validation errors ho to
  });
};

module.exports = errorHandler;
