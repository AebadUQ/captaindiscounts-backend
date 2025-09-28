const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WebBlog = sequelize.define(
  "WebBlog",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    //   unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT("long"), // full blog content
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
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = WebBlog;
