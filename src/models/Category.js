import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// Kategoriyi tek seferde dışa aktararak tanımlıyoruz.
export const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: { // gelir veya gider kategorisi
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false,
    },
    // Foreign Key: user_id (associations.js'te eklenecek)
}, {
    tableName: 'categories',
    timestamps: true
});

// İlişkiler (associations.js dosyasına taşındığı varsayılmıştır)
// Category.belongsTo(User, ...); // Bu kısım associations.js'e taşındı
// Category.hasMany(Transaction, ...); // Bu kısım associations.js'e taşındı
