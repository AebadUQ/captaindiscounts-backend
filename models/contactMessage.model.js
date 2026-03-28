const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ContactMessage = sequelize.define(
  "ContactMessage",
  {
    firstName: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { isEmail: true },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "ContactMessages",
  }
);

module.exports = ContactMessage;
