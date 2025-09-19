const Coupon = require('../models/coupon.model');
const Brand = require('../models/brand.model');
const ApiError = require('../utils/ApiError');

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
            { slug: { [Op.iLike]: `%${search}%` } },
          ],
        }
        : {}),
    };

    const { rows, count } = await Coupon.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      data: rows, // actual data
      metaData: {
        total: count,
        page,
        pageSize: limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },
  getCouponByID: async (id) => {
    const coupon = await Coupon.findOne({ where: { id, deletedAt: null } });
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

    // Agar brandId updateData me aya hai to check karo
    if (updateData.brandId) {
      const brand = await Brand.findByPk(updateData.brandId);
      if (!brand) {
        throw new ApiError(400, "Invalid brandId, brand not found");
      }
    }

    // Agar couponType update kar rahe ho to couponCode ka rule apply karo
    if (updateData.couponType === "coupon_code" && !updateData.couponCode) {
      throw new ApiError(400, "Coupon code is required when type is coupon_code",);
    }
    if (updateData.couponType === "deal" && updateData.couponCode) {
      throw new ApiError(400, "Coupon code should not exist when type is deal");
    }

    // Update fields safely
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
  },
};

module.exports = couponService;
