const { fn, col, literal } = require("sequelize");
const Category = require("../models/category.model");
const Brand = require("../models/brand.model");
const Coupon = require("../models/coupon.model");
const Blog = require("../models/blog.model");

const statsService = {
  getStats: async () => {
    const [
      totalCategories,
      totalBlogs,
      totalBrands,
      totalCoupons,
      totalCouponCodes,
      totalDeals,
    ] = await Promise.all([
      Category.count({ where: { deletedAt: null } }),
      Blog.count({ where: { deletedAt: null } }),
      Brand.count({ where: { deletedAt: null } }),
      Coupon.count({ where: { deletedAt: null } }),
      Coupon.count({ where: { couponType: "coupon_code", deletedAt: null } }),
      Coupon.count({ where: { couponType: "deal", deletedAt: null } }),
    ]);

    const usesPerCategory = await Coupon.findAll({
      attributes: [
        [col("brand.category.id"), "categoryId"],
        [col("brand.category.name"), "categoryName"],
        [fn("SUM", col("uses")), "totalUses"],
        // [
        //   fn(
        //     "SUM",
        //     literal(`CASE WHEN couponType='coupon_code' THEN uses ELSE 0 END`)
        //   ),
        //   "couponCodeUses",
        // ],
        // [
        //   fn(
        //     "SUM",
        //     literal(`CASE WHEN couponType='deal' THEN uses ELSE 0 END`)
        //   ),
        //   "dealUses",
        // ],
      ],
      include: [
        {
          model: Brand,
          as: "brand",
          attributes: [],
          include: [
            {
              model: Category,
              as: "category",
              attributes: [],
            },
          ],
        },
      ],
      group: ["brand.category.id", "brand.category.name"],
      raw: true,
    });

    return {
      totalCategories,
      totalBlogs,
      totalBrands,
      totalCoupons,
      totalCouponCodes,
      totalDeals,
      usesPerCategory,
    };
  },
};

module.exports = statsService;
