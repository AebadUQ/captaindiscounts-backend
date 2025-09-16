const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/auth.model");

const adminService = {
  createAdmin: async (name, email, password) => {
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists, skipping creation.");
      return existingAdmin;
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
    );

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    };
  },

  loginAdmin: async (email, password) => {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "9d" }
    );
console.log("token",token)
    return {
      token,
      admin: admin,
    };
  },
};

module.exports = adminService;
