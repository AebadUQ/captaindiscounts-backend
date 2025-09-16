const { DataTypes } = require("sequelize")
const sequelize = require('../config/database')
const Category = require('./category.model')
const Brand = sequelize.define("Brand", {
    brandName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    storeurl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    affiliateUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brandImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: "id"
        },
        onDelete: "CASCADE"

    }
},
    {
        timestamps: true,
        paranoid: true // soft delete
    })
Category.hasMany(Brand, { foreignKey: "categoryId" });
Brand.belongsTo(Category, { foreignKey: "categoryId" });
module.exports = Brand;
