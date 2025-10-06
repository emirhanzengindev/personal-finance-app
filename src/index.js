import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt"; // Şifre hash'leme için kütüphane
import { sequelize } from "./config/database.js";
import { Transaction } from "./models/Transaction.js";
import { User } from "./models/User.js";
import { Category } from "./models/Category.js";
import "./models/associations.js"; // Modeller arası ilişkiler

dotenv.config();

const app = express();
app.use(express.json());

const SALT_ROUNDS = 10; // bcrypt hash gücü (önerilen değer)

async function initializeDB() {
    try {
        await sequelize.authenticate();
        console.log('✅ Veritabanı bağlantısı başarılı.');

        // Modelleri oluştur ve şema değişikliklerini uygula
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

    // 1. Temel Giriş Kontrolü 
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: "Lütfen tüm alanları (email, şifre, ad, soyad) doldurun." });
    }

    try {
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: "Bu e-posta adresi zaten kayıtlı." });
        }
        
        
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS); 

   
        const newUser = await User.create({
            email,
            password: passwordHash, // Hashlenmiş şifre kaydediliyor
            firstName,
            lastName
        });

        res.status(201).json({
            status: "success",
            message: "Kullanıcı başarıyla kaydedildi.",
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

app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    // 1. Temel Giriş Kontrolü
    if (!email || !password) {
        return res.status(400).json({ error: "Lütfen e-posta ve şifrenizi girin." });
    }

    try {
        const user = await User.findOne({ where: { email } });

        // Kullanıcı bulunamazsa
        if (!user) {
            return res.status(401).json({ error: "Geçersiz e-posta veya şifre." });
        }

        // 3. Şifreyi karşılaştır
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Şifre eşleşmezse
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Geçersiz e-posta veya şifre." });
        }

        res.status(200).json({
            status: "success",
            message: "Giriş başarılı, ancak oturum bilgisi (token) oluşturulmadı.",
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        console.error("Giriş sırasında hata:", error);
        res.status(500).json({ 
            status: "error",
            message: "Sunucu hatası oluştu, giriş yapılamadı." 
        });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
