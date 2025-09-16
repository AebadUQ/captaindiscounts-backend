const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const User = sequelize.define('User', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true,
},
name: { type: DataTypes.STRING, allowNull: false },
email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
password: { type: DataTypes.STRING, allowNull: false },
role: { type: DataTypes.ENUM('superadmin', 'admin'), defaultValue: 'admin' },
isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
indexes: [
{ unique: true, fields: ['email'] }
],
tableName: 'users',
});


module.exports = User;