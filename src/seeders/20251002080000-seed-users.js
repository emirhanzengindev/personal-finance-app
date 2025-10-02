"use strict";

export async function up(queryInterface, Sequelize) {
  return queryInterface.bulkInsert("categories", [
    {
      name: "Maaş",
      type: "income",
      user_id: 1,
      created_at: new Date(),
    },
    {
      name: "Yemek",
      type: "expense",
      user_id: 1,
      created_at: new Date(),
    },
    {
      name: "Freelance",
      type: "income",
      user_id: 2,
      created_at: new Date(),
    },
    {
      name: "Ulaşım",
      type: "expense",
      user_id: 2,
      created_at: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete("categories", null, {});
}
