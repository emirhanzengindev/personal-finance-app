import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true,
    },
    // Bu işlem hangi kullanıcıya ait? 
    userId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    //  Bu işlem hangi kategoriye ait?
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    type: { // gelir veya gider
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false,
    },
}, {
    tableName: 'transactions',
    timestamps: true,
    underscored: true
});
