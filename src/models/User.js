import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const User = sequelize.define('User', {
    // ID tipi INTEGER (SERIAL) olarak değiştirildi
    id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true, 
        unique: true
    },
    // Rota ile uyumlu olması için 'password' 
    password: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true // Tüm alan adlarını otomatik olarak snake_case yapar (first_name, updated_at vb.)
});
