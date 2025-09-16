const {DataTypes} =require("sequelize")
const sequelize = require('../config/database')
const Category = sequelize.define('Category',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    slug:{
        type:DataTypes.STRING,
        allowNull:false,
        // unique:true
    },
    url:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:true
    }
},{
    timestamps:true,
    paranoid: true 
})
module.exports= Category