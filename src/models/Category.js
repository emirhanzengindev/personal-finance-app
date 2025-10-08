import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, 
        primaryKey: true,
    },
    // Bu kategori hangi kullanıcıya ait? (1. ilişki: User'dan gelen FK)
    userId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        // Farklı kullanıcılar aynı kategori adına sahip olabilir.
    },
    type: { // gelir veya gider kategorisi
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false,
    },
 
}, {
    tableName: 'categories',
    timestamps: true,
    underscored: true
});
