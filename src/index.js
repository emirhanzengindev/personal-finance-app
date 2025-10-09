import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";
import { Transaction } from "./models/Transaction.js";
import { User } from "./models/User.js";
import { Category } from "./models/Category.js";
import "./models/associations.js"; 

// Rota dosyalarını içe aktarıyoruz
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";


dotenv.config();

const app = express();
app.use(express.json());


const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_please_change_this_in_env";
if (JWT_SECRET === "your_super_secret_key_please_change_this_in_env") {
    console.warn("⚠️ JWT_SECRET ENV dosyasında tanımlanmamış, varsayılan değer kullanılıyor! Lütfen .env dosyanıza güvenli bir anahtar ekleyin.");
}

async function initializeDB() {
    try {
        await sequelize.authenticate();
        console.log('✅ Veritabanı bağlantısı başarılı.');
        await sequelize.sync({ alter: true }); 
        console.log("✅ Veritabanı senkronizasyonu tamamlandı.");

    } catch (error) {
        console.error('❌ Veritabanı başlatılırken hata oluştu:', error);
   }
}

initializeDB();


// Basit bir durum kontrol rotası
app.get("/status", (req, res) => {
   res.json({ 
    status: "OK", 
    message: "API çalışıyor."
   });
});


//  Rota Uygulamaları
// Bütün /api/auth rotaları authRoutes tarafından yönetilir
app.use("/api/auth", authRoutes); 

// Bütün /api/transactions rotaları transactionRoutes tarafından yönetilir
app.use("/api/transactions", transactionRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
     console.log(`🚀 Server running on http://localhost:${PORT}`);
});
