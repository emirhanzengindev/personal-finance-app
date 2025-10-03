import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";
import { Transaction } from "./models/Transaction.js";
import { User } from "./models/User.js";
import { Category } from "./models/Category.js";
import "./models/associations.js"; 

dotenv.config();

const app = express();
app.use(express.json());

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
app.get("/status", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "API çalışıyor. Veritabanı bağlantısı ve model yüklemesi başarılı (Hafta 2 tamamlandı)."
    });
});

app.post("/api/auth/register", async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: "Lütfen tüm alanları (email, şifre, ad, soyad) doldurun." });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: "Bu e-posta adresi zaten kayıtlı." });
        }

        const newUser = await User.create({
            email,
            password: password, 
            firstName,
            lastName
        });
        res.status(201).json({
            status: "success",
            message: "Kullanıcı başarıyla kaydedildi. (Şifre Hash'leme ve JWT sonraki görevde eklenecek).",
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            }
        });

    } catch (error) {
        console.error("Kayıt sırasında hata:", error);
        res.status(500).json({ 
            status: "error",
            message: "Sunucu hatası oluştu, kayıt yapılamadı." 
        });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
