const Coupon = require('../models/coupon.model');
const Brand = require('../models/brand.model');
const ApiError = require('../utils/ApiError');
const Category = require('../models/category.model');
const { Op } = require("sequelize");

const couponService = {
  createCoupon: async (data) => {
    console.log("here")
    const { name, affiliateUrl, couponType, state, startDate, endDate, brandId, priority, discountPercentage, detail, couponCode } = data;

    // 🔍 Validate brand exists
    const brand = await Brand.findByPk(brandId);
    if (!brand) {
      throw new ApiError(404, 'Brand not found');
    }

    // 🔍 Coupon code validation
    if (couponType === 'coupon_code' && !couponCode) {
      throw new ApiError(400, 'Coupon code is required for type coupon_code');
    }
    if (couponType === 'deal' && couponCode) {
      throw new ApiError(400, 'Coupon code should not be provided for type deal');
    }
if (priority < 1 || priority > 10) {
    throw new ApiError(400, 'Priority must be between 1 and 10');
  }
    // ✅ Create coupon
    const coupon = await Coupon.create({
      name,
      affiliateUrl,
      couponType,
      state,
      startDate,
      endDate,
      brandId,
      priority,
      discountPercentage,
      detail,
      couponCode,
    });

    return coupon;
  },
 getAllCoupons: async ({ page = 1, limit = 10, search = "" }) => {
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const whereCondition = {
    deletedAt: null,
    ...(search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { "$brand.brandName$": { [Op.iLike]: `%${search}%` } }, // match brand name
          ],
        }
      : {}),
  };

  const { rows, count } = await Coupon.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Brand,
        as: "brand",
        where: { deletedAt: null },
        attributes: ["id", "brandName", "brandImage"],
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name"],
            where: { deletedAt: null },
            required: true,
          },
        ],
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

  getCouponByID: async (id) => {
    const coupon = await Coupon.findOne({ where: { id, deletedAt: null },
     include: [
        {
          model: Brand,
                              where: { deletedAt: null },

          as: "brand",
          attributes: ["id", "brandName"], // only bring required fields
        },
      ], });
    console.log("coupon", coupon)
    if (!coupon) {
      throw new ApiError(404, "No Coupon found");
    }
    return coupon;
  },
 updateCoupon: async (id, updateData) => {
  const coupon = await Coupon.findByPk(id);

  if (!coupon) {
    throw new ApiError("Coupon not found", 404);
  }

  // Agar brandId null ya undefined hai → error throw karo
  if (updateData.brandId === undefined || updateData.brandId === null) {
    throw new ApiError(400, "Brand not selected");
  }

  // Agar brandId diya hai to check karo
  const brand = await Brand.findByPk(updateData.brandId);
  if (!brand) {
    throw new ApiError(400, "Invalid brandId, brand not found");
  }

  // CouponType rules
  if (updateData.couponType === "coupon_code" && !updateData.couponCode) {
    throw new ApiError(400, "Coupon code is required when type is coupon_code");
  }
  if (updateData.couponType === "deal" && updateData.couponCode) {
    throw new ApiError(400, "Coupon code should not exist when type is deal");
  }

  // Update safely
  await coupon.update(updateData);

  return coupon;
},

  updateUse: async (id) => {
    const coupon = await Coupon.findByPk(id);

    if (!coupon) {
      throw new ApiError(404, "Coupon not found");
    }
    coupon.uses += 1;
    coupon.lastUsed = new Date()
    await coupon.save()
    return coupon;
  },
  deleteCoupon: async (id) => {
    const coupon = await Coupon.findOne({ where: { id, deletedAt: null } });
    if (!coupon) {
      throw new ApiError(404, "Coupon not found");
    }

    await coupon.destroy(); // soft delete
    return { message: "Coupon deleted successfully" };
  },getCouponsWithBrandAndCategory: async ({ page = 1, limit = 10, search = "" }) => {
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const whereCondition = {
    deletedAt: null,
    ...(search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { couponCode: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {}),
  };

  const { rows, count } = await Coupon.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Brand,
        as: "brand",
        attributes: ["brandName", "brandImage", "storeurl", "affiliateUrl", "categoryId"],
        required: true, // brand must exist
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
            where: { deletedAt: null },
            required: true, // ✅ only include brand if category exists and is not deleted
          },
        ],
      },
    ],
  });

  if (!rows || rows.length === 0) {
    // throw new ApiError(404,"No coupons found");
  }

  const data = rows.map(coupon => ({
    id:coupon.id,
    brandLogo: coupon.brand.brandImage,
    brandName: coupon.brand.brandName,
    couponType: coupon.couponType,
    state: coupon.state,
    couponTitle: coupon.name,
    description: coupon.detail,
    uses: coupon.uses,
    lastUsed: coupon.lastUsed,
    codeText: coupon.couponCode,
    category: coupon.brand.category.name, // always exists now
    affiliateUrl: coupon.affiliateUrl,
    storeUrl: coupon.brand.storeurl,
  }));

  return {
    data,
    metaData: {
      total: count,
      page,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
    },
  };
},

};

module.exports = couponService;
