"use strict";
import bcrypt from "bcrypt";

export async function up(queryInterface, Sequelize) {
  const passwordHash = await bcrypt.hash("123456", 10);
  return queryInterface.bulkInsert("users", [
    {
      email: "emirhan@example.com",
      password_hash: passwordHash,
      first_name: "Emirhan",
      last_name: "Zengin",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      email: "ayse@example.com",
      password_hash: passwordHash,
      first_name: "Ayşe",
      last_name: "Yılmaz",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete("users", null, {});
}
