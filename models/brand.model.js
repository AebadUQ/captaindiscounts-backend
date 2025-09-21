const { DataTypes } = require("sequelize");
const sequelize = require('../config/database');
const Category = require('./category.model');

const Brand = sequelize.define(
  "Brand",
  {
    brandName: {
      type: DataTypes.STRING(255), // limit 255, usually fine
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    storeurl: {
      type: DataTypes.STRING(500), // increase length for long URLs
      allowNull: false,
    },
    affiliateUrl: {
      type: DataTypes.STRING(500), // increase length for long URLs
      allowNull: false,
    },
    brandImage: {
      type: DataTypes.STRING(500), // safer for long URLs
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // unlimited length
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
  },
  {
    timestamps: true,
    paranoid: true, // soft delete
  }
);

// Relations
Category.hasMany(Brand, { foreignKey: "categoryId", as: "category" });

// Category.hasMany(Brand, { foreignKey: "categoryId" });
// Brand.belongsTo(Category, { foreignKey: "categoryId" });
Brand.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

module.exports = Brand;
