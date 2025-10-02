"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("transactions", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    transaction_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM("income", "expense"),
      allowNull: false,
    },
category_id: {
  type: Sequelize.INTEGER,
  references: {
    model: 'categories', // Küçük harf ve tablo adı tam olarak eşleşmeli
    key: 'id'
  },
  onDelete: 'SET NULL',
  allowNull: true // Transactions her zaman bir kategoriye bağlı olmayabilir
},
user_id: {
  type: Sequelize.INTEGER,
  references: {
    model: 'users',
    key: 'id'
  },
  onDelete: 'CASCADE',
  allowNull: false
},
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("transactions");
}
