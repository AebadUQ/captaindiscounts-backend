const { Op } = require("sequelize");
const ContactMessage = require("../models/contactMessage.model");
const ApiError = require("../utils/ApiError");
const { sendContactFormNotification } = require("../utils/mail");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactMessageService = {
  create: async ({ firstName, lastName, phone, email, message }) => {
    const fn = String(firstName ?? "").trim();
    const ln = String(lastName ?? "").trim();
    const ph = String(phone ?? "").trim();
    const em = String(email ?? "").trim();
    const msg = String(message ?? "").trim();

    if (!fn || !ln) {
      throw new ApiError(400, "First name and last name are required");
    }
    if (!ph) {
      throw new ApiError(400, "Phone number is required");
    }
    if (!em || !emailRegex.test(em)) {
      throw new ApiError(400, "A valid email is required");
    }
    if (!msg || msg.length < 10) {
      throw new ApiError(400, "Message must be at least 10 characters");
    }

    const row = await ContactMessage.create({
      firstName: fn,
      lastName: ln,
      phone: ph,
      email: em,
      message: msg,
    });

    sendContactFormNotification({
      id: row.id,
      firstName: fn,
      lastName: ln,
      phone: ph,
      email: em,
      message: msg,
      createdAt: row.createdAt,
    }).catch((err) => {
      console.error("[mail] Failed to send contact notification:", err.message);
    });

    return row;
  },

  getAll: async ({ page = 1, limit = 10, search = "" }) => {
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const offset = (page - 1) * limit;
    const term = String(search ?? "").trim();

    const where = term
      ? {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${term}%` } },
            { lastName: { [Op.iLike]: `%${term}%` } },
            { email: { [Op.iLike]: `%${term}%` } },
            { phone: { [Op.iLike]: `%${term}%` } },
            { message: { [Op.iLike]: `%${term}%` } },
          ],
        }
      : {};

    const { rows, count } = await ContactMessage.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const data = rows.map((r) => ({
      id: r.id,
      firstName: r.firstName,
      lastName: r.lastName,
      phone: r.phone,
      email: r.email,
      message: r.message,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    return {
      data,
      metaData: {
        total: count,
        page,
        pageSize: limit,
        totalPages: Math.ceil(count / limit) || 0,
      },
    };
  },
};

module.exports = contactMessageService;
