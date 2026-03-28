const jwt = require("jsonwebtoken");
const Admin = require("../models/auth.model");

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role && decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/** First admin can be created with no token; later creates require a valid admin JWT. */
exports.allowCreateAdminIfBootstrapOrAuth = async (req, res, next) => {
  try {
    const count = await Admin.count();
    if (count === 0) {
      return next();
    }
    return exports.authMiddleware(req, res, next);
  } catch (err) {
    next(err);
  }
};
