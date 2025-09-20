const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Brand = require('./brand.model');

const Coupon = sequelize.define(
  'Coupon',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    affiliateUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    couponType: {
      type: DataTypes.ENUM('deal', 'coupon_code'),
      allowNull: false,
    },
    state: {
      type: DataTypes.ENUM('featured', 'verified', 'validated'),
      allowNull: false,
      defaultValue: 'validated',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 10,
      },
      defaultValue: 5,
    },
    discountPercentage: {
      type: DataTypes.FLOAT,
      validate: {
        min: 0,
        max: 100,
      },
    },
    uses: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastUsed: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    couponCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isCouponCodeValid(value) {
          if (this.couponType === 'coupon_code' && !value) {
            throw new Error('Coupon code is required when type is coupon_code');
          }
          if (this.couponType === 'deal' && value) {
            throw new Error('Coupon code should not exist when type is deal');
          }
        },
      },
    },
  },
  {
    timestamps: true,   // adds createdAt, updatedAt
    paranoid: true,     // adds deletedAt and enables soft delete
  }
);

// Relationship
Coupon.belongsTo(Brand, {
  foreignKey: {
    name: 'brandId',
    allowNull: false,
  },
  as: 'brand',
});

module.exports = Coupon;
