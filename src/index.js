import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";
import { Transaction } from "./models/Transaction.js";
dotenv.config();

const app = express();
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Kişisel Finans Yönetimi API");
});

// DB bağlantısı test
sequelize.authenticate()
  .then(() => console.log("✅ PostgreSQL bağlantısı başarılı"))
  .catch(err => console.error("❌ DB bağlantı hatası:", err));

// Transactions route
app.get("/transactions", async (req, res) => {
  try {
    const all = await Transaction.findAll();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
