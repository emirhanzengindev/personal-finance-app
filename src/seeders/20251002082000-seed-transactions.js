"use strict";

export async function up(queryInterface, Sequelize) {
  return queryInterface.bulkInsert("transactions", [
    {
      amount: 5000.0,
      description: "Eylül maaşı",
      transaction_date: "2025-09-30",
      type: "income",
      category_id: 1,
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      amount: 150.0,
      description: "Akşam yemeği",
      transaction_date: "2025-10-01",
      type: "expense",
      category_id: 2,
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      amount: 2000.0,
      description: "Proje ödemesi",
      transaction_date: "2025-09-28",
      type: "income",
      category_id: 3,
      user_id: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      amount: 50.0,
      description: "Otobüs kartı",
      transaction_date: "2025-10-01",
      type: "expense",
      category_id: 4,
      user_id: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete("transactions", null, {});
}
