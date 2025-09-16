const adminService = require("../services/auth.services");

const adminController = {
  createAdmin: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const admin = await adminService.createAdmin(name, email, password);

      res.status(201).json({
        success: true,
        message: "Admin created successfully",
        data: admin,
      });
    } catch (error) {
      next(error);
    }
  },

  loginAdmin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { token, admin } = await adminService.loginAdmin(email, password);

      res.status(200).json({
        success: true,
        message: "Admin login successful",
        token,
        data: admin,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  },
};

module.exports = adminController;
