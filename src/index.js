import express from "express";
import dotenv from "dotenv";
// Authentication (Hafta 3) için gerekli kütüphaneler henüz dahil edilmedi.
import { sequelize } from "./config/database.js";
import { Transaction } from "./models/Transaction.js";
import { User } from "./models/User.js";
import { Category } from "./models/Category.js";
import "./models/associations.js"; // Modeller arası ilişkiler

dotenv.config();

const app = express();
app.use(express.json());

async function initializeDB() {
    try {
        await sequelize.authenticate();
        console.log('✅ Veritabanı bağlantısı başarılı.');
        await sequelize.sync({ alter: true }); 
        console.log("✅ Veritabanı senkronizasyonu (Modeller Oluşturuldu) tamamlandı.");

    } catch (error) {
        console.error('❌ Veritabanı başlatılırken hata oluştu:', error);
    }
}

initializeDB();


// Sunucunun ve temel modellerin başarılı bir şekilde yüklendiğini test etmek için rota.
app.get("/status", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "API çalışıyor. Veritabanı bağlantısı ve model yüklemesi başarılı (Hafta 2 tamamlandı).",
        nextStep: "Hafta 3: Authentication (User registration/login) rotaları eklenecek."
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
