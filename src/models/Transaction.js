import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
// Diğer importlar (User, Category) burada olabilir veya relations dosyasına taşınmış olmalıdır.
// Hata çözümü için bu dosyanın sadece bir kez export yapması önemlidir.

export const Transaction = sequelize.define('Transaction', {
    // Model Sütunları
    // ...
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
    // Foreign Keys: user_id ve category_id (associations.js'te eklenecek)
}, {
    tableName: 'transactions',
    // Eğer User ve Category import edildiyse, ilişki kodu da buradaydı
    // Ancak en temiz çözüm: İlişki kodlarını (Transaction.belongsTo) buradan KALDIRIN.
});

// Eğer ilişkileri associations.js'e taşıdıysanız, bu kadar.
// TEKRARLI export yapmadığınızdan emin olun.
