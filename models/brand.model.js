const { DataTypes } = require("sequelize");
const sequelize = require('../config/database');
const Category = require('./category.model');
const { Op } = require("sequelize");

const Brand = sequelize.define(
  "Brand",
  {
    brandName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    storeurl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    affiliateUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    brandImage: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0, // average rating
      allowNull: false,
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // total number of ratings
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

// Relations
Category.hasMany(Brand, { foreignKey: "categoryId", as: "brands" });
Brand.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

module.exports = Brand;
