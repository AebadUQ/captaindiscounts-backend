const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/auth.model");

function toPublicAdmin(admin) {
  if (!admin) return null;
  const plain = admin.get ? admin.get({ plain: true }) : { ...admin };
  const { password, ...rest } = plain;
  return rest;
}

const adminService = {
  toPublicAdmin,

  createAdmin: async (name, email, password) => {
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      throw new Error("An admin with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10
    );

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    return toPublicAdmin(admin);
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

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "9d" }
    );

    return {
      token,
      admin: toPublicAdmin(admin),
    };
  },

  getAdminById: async (id) => {
    const admin = await Admin.findByPk(id);
    return toPublicAdmin(admin);
  },

  /** Idempotent: used by server startup when ADMIN_* env vars are set. */
  ensureSeededAdmin: async (name, email, password) => {
    if (!name || !email || !password) {
      console.warn("ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD not set; skipping admin seed.");
      return null;
    }
    const existing = await Admin.findOne({ where: { email } });
    if (existing) {
      return toPublicAdmin(existing);
    }
    return adminService.createAdmin(name, email, password);
  },
};

module.exports = adminService;
