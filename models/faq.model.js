const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Brand = require("./brand.model");

const Faq = sequelize.define(
  "Faq",
  {
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Brand,
        key: "id",
      },
      unique: true, // one FAQ per brand
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

// Relations
Brand.hasOne(Faq, { foreignKey: "brandId", as: "faq" });
Faq.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });

module.exports = Faq;
