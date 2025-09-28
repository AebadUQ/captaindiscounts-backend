const Faq = require("../models/faq.model");
const Brand = require("../models/brand.model");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

const faqService = {
  createFaq: async ({ brandId, content }) => {
    if (!brandId || !content) {
      throw new ApiError(400, "brandId and content are required");
    }

    const brand = await Brand.findOne({ where: { id: brandId, deletedAt: null } });
    if (!brand) throw new ApiError(404, "Brand not found");

    const existingFaq = await Faq.findOne({ where: { brandId, deletedAt: null } });
    if (existingFaq) throw new ApiError(400, "FAQ already exists for this brand");

    const faq = await Faq.create({ brandId, content });
    return faq;
  },

 getAllFaqs: async ({ page = 1, limit = 10, search = "" }) => {
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const whereCondition = {
    deletedAt: null,
    ...(search
      ? {
          [Op.or]: [
            { content: { [Op.iLike]: `%${search}%` } },
            { "$brand.brandName$": { [Op.iLike]: `%${search}%` } }, // ✅ brand name search
          ],
        }
      : {}),
  };

  const { rows, count } = await Faq.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Brand,
        as: "brand",
        attributes: ["id", "brandName"],
      },
    ],
  });

  const formattedRows = rows.map((faq) => ({
    id: faq.id,
    brandId: faq.brandId,
    brandName: faq.brand?.brandName || "",
    content: faq.content,
    createdAt: faq.createdAt,
    updatedAt: faq.updatedAt,
  }));

  return {
    data: formattedRows,
    metaData: {
      total: count,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
    },
  }},

  

  getFaqByBrand: async (brandId) => {
    const faq = await Faq.findOne({
      where: { brandId, deletedAt: null },
      include: [{ model: Brand, as: "brand", attributes: ["id", "brandName"] }],
    });
    if (!faq) throw new ApiError(404, "FAQ not found for this brand");
    return faq;
  },

  updateFaq: async (id, content) => {
    const faq = await Faq.findOne({ where: { id, deletedAt: null } });
    if (!faq) throw new ApiError(404, "FAQ not found");
    faq.content = content;
    await faq.save();
    return faq;
  },

  deleteFaq: async (id) => {
    const faq = await Faq.findOne({ where: { id, deletedAt: null } });
    if (!faq) throw new ApiError(404, "FAQ not found");
    await faq.destroy();
    return { message: "FAQ deleted successfully" };
  },
};

module.exports = faqService;
