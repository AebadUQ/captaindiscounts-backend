// models/blog.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Brand = require("./brand.model");

const Blog = sequelize.define(
  "Blog",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT("long"), // for full blog content
      allowNull: false,
    },
    canonicalUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    metaTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    schemaMarkup: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    featuredImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    keywords: {
  type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    publishDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    authorName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    authorPosition: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    authorLinkedin: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    authorImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    authorBio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Brand,
        key: "id",
      },
      unique: true, // one blog per brand
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

// Relations
Brand.hasOne(Blog, { foreignKey: "brandId", as: "blog" });
Blog.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });

module.exports = Blog;
