const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");
const Category = require('../models/category.model')
const Brand = require('../models/brand.model')
const Coupon = require('../models/coupon.model')
const Blog = require('../models/blog.model')
const Faq = require('../models/faq.model')

const { deleteBrand } = require("../controllers/brand.controller");
const brandService = {
    createBrand: async ({ brandName, slug, storeurl, brandImage, affiliateUrl, description, categoryId }) => {

        // Slug uniqueness check
        const existing = await Brand.findOne({ where: { slug, deletedAt: null } });
        if (existing) throw new ApiError("Brand with this slug already exists", 400);

        // Create brand
        const brand = await Brand.create({ brandName, slug, storeurl, brandImage, affiliateUrl, description, categoryId });
        return brand;
    },
    getAllBrands: async ({ page = 1, limit = 10, search = "" }) => {
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const whereCondition = {
            deletedAt: null,
            ...(search
                ? {
                    [Op.or]: [
                        { brandName: { [Op.iLike]: `%${search}%` } },
                        { slug: { [Op.iLike]: `%${search}%` } },
                    ],
                }
                : {}),
        };

        const { rows, count } = await Brand.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: Category,
                            as: "category", // ⚡ must match Brand.belongsTo alias

                    where: { deletedAt: null },
                    attributes: ["id", "name"],
                },
            ],
        });

        return {
            data: rows,
            metaData: {
                total: count,
                page,
                pageSize: limit,
                totalPages: Math.ceil(count / limit),
            },
        };
    },

    getBrandByID: async (id) => {
        const brand = await Brand.findOne({
            where: { id, deletedAt: null },
            include: [
                {
                    model: Category,
                            as: "category", // ⚡ must match Brand.belongsTo alias

                    attributes: ["id", "name"], // only fetch id and name
                },
            ],
        });

        if (!brand) {
            throw new ApiError("No Brand found", 404);
        }

        return brand;
    },

    deleteBrand: async (id) => {
        const brand = await Brand.findOne({ where: { id, deletedAt: null } });
        if (!brand) {
            throw new ApiError("Brand not found", 404);
        }

        await brand.destroy(); // soft delete
        return { message: "Brand deleted successfully" };
    },
    updateBrand: async (id, updateData) => {
        // 1️⃣ Find the brand
        const brand = await Brand.findOne({ where: { id, deletedAt: null } });
        if (!brand) throw new ApiError(404, "Brand not found");

        // 2️⃣ Handle categoryId update
        // 2️⃣ Handle categoryId update
        if ("categoryId" in updateData && updateData.categoryId !== brand.categoryId) {
            if (!updateData.categoryId) {
                // prevent unsetting
                throw new ApiError(400, "Category must be selected");
            } else {
                const category = await Category.findOne({ where: { id: updateData.categoryId, deletedAt: null } });
                if (!category) throw new ApiError(404, "Category not found");
                brand.categoryId = updateData.categoryId;
            }
        }


        // 3️⃣ Handle slug update for uniqueness
        if ("slug" in updateData && updateData.slug !== brand.slug) {
            const existing = await Brand.findOne({ where: { slug: updateData.slug, deletedAt: null } });
            if (existing) throw new ApiError(400, "Slug already exists for an active Brand");
            brand.slug = updateData.slug;
        }

        // 4️⃣ Dynamically update all other fields except slug and categoryId
        Object.keys(updateData).forEach((key) => {
            if (!["slug", "categoryId"].includes(key) && updateData[key] !== undefined) {
                brand[key] = updateData[key];
            }
        });

        // 5️⃣ Save and return the brand
        await brand.save();
        return brand;
    }
,
  rateBrand: async (id, isPositive) => {
    const brand = await Brand.findByPk(id);
    if (!brand) {
      throw new ApiError(404,"Brand not found");
    }

    const newRatingValue = isPositive ? 5 : 1;

    const totalRating = brand.rating * brand.ratingCount + newRatingValue;
    const newCount = brand.ratingCount + 1;
    const newAverage = totalRating / newCount;

    brand.rating = newAverage;
    brand.ratingCount = newCount;
    await brand.save();

    return brand;
  },
getBrandProfile: async (id) => {
  // 1️⃣ Get brand with its category
  const brand = await Brand.findOne({
    where: { id, deletedAt: null },
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!brand) throw new ApiError(404, "No Brand found");

  // 2️⃣ Get coupons for this brand
  const coupons = await Coupon.findAll({
    where: {
      brandId: brand.id,
      deletedAt: null,
    },
    attributes: [
      "id",
      "name",
      "couponCode",
      "couponType",
      "affiliateUrl",
      "state",
      "startDate",
      "endDate",
      "uses",
      "lastUsed",
      "detail",
      "priority",
    ],
    order: [["priority", "ASC"]],
  });

  // 3️⃣ Get blogs for this brand
  const blogs = await Blog.findAll({
    where: {
      brandId: brand.id,
      deletedAt: null,
    },
    order: [["publishDate", "DESC"]],
  });

  // 4️⃣ Get FAQs for this brand ✅
  const faqs = await Faq.findAll({
    where: {
      brandId: brand.id,
      deletedAt: null,
    },
    attributes: ["id", "content", "createdAt", "updatedAt"],
    order: [["createdAt", "DESC"]],
  });

  // 5️⃣ Get competitor brands (same category, limit 10, exclude current brand)
  const competitors = await Brand.findAll({
    where: {
      categoryId: brand.categoryId,
      deletedAt: null,
      id: { [Op.ne]: brand.id }, // exclude current brand
    },
    attributes: ["id", "brandName", "categoryId", "brandImage", "description","slug"],
    limit: 10,
    order: [["id", "ASC"]],
  });

  // 6️⃣ Combine and return brand data
  const brandData = brand.toJSON();
  brandData.coupons = coupons;
  brandData.blogs = blogs;
  brandData.faqs = faqs;
  brandData.competitor = competitors;

  // 🔥 7️⃣ Aggregates (stats)
  const totalCoupons = coupons.length;
  const dealCount = coupons.filter((c) => c.couponType === "deal").length;
  const couponCodeCount = coupons.filter(
    (c) => c.couponType === "coupon_code"
  ).length;

  const lastUpdated =
    coupons.length > 0
      ? coupons
          .filter((c) => c.lastUsed !== null)
          .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed))[0]
          ?.lastUsed
      : null;

  brandData.stats = {
    totalCoupons,
    dealCount,
    couponCodeCount,
    lastUpdated,
  };

  return brandData;
}


};

module.exports = brandService;
