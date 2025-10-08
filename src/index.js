import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sequelize } from "./config/database.js";
import { Transaction } from "./models/Transaction.js";
import { User } from "./models/User.js";
import { Category } from "./models/Category.js";
import "./models/associations.js"; 
// 📌 GÜNCELLEME: Auth Middleware'i içe aktarıyorum
import { authenticateToken } from "./middleware/auth.js"; 


dotenv.config();

const app = express();
app.use(express.json());

// 1: GÜVENLİK AYARI: Şifre hashleme gücünü belirliyorum.
const SALT_ROUNDS = 10; 

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_please_change_this_in_env";
if (JWT_SECRET === "your_super_secret_key_please_change_this_in_env") {
    console.warn("⚠️ JWT_SECRET ENV dosyasında tanımlanmamış, varsayılan değer kullanılıyor! Lütfen .env dosyanıza güvenli bir anahtar ekleyin.");
}

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
        message: "API çalışıyor."
    });
});

app.post("/api/auth/register", async (req, res) => {
    const { email, password, firstName, lastName, username } = req.body; 

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: "Lütfen tüm zorunlu alanları doldurun." });
    }

    try {
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: "Bu e-posta adresi zaten kayıtlı." });
        }
        
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS); 

        const newUser = await User.create({
            email,
            password: passwordHash,
            firstName,
            lastName,
            username 
        });
        
        // JWT Token oluşturma
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "1d" }
        );
        
        res.status(201).json({
            status: "success",
            message: "Kullanıcı başarıyla kaydedildi.",
            token: token,
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
            message: "Sunucu hatası oluştu." 
        });
    }
});

app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Lütfen e-posta ve şifrenizi girin." });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "Geçersiz e-posta veya şifre." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Geçersiz e-posta veya şifre." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            status: "success",
            message: "Giriş başarılı.",
            token: token,
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
            message: "Sunucu hatası oluştu." 
        });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    // req.userId, middleware tarafından token'dan çıkarıldı.
    try {
        const user = await User.findByPk(req.userId, { 
            attributes: { exclude: ['password'] } // Şifreyi gönderme!
        });

        if (!user) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı." });
        }

        res.json({
            status: "success",
            user
        });
    } catch (error) {
        console.error("Me rotası hatası:", error);
        res.status(500).json({ error: "Kullanıcı bilgileri getirilemedi." });
    }
});
app.post('/api/transactions', authenticateToken, async (req, res) => {
    // req.userId, authenticateToken middleware'i tarafından eklendi.
    const { categoryId, description, amount, type, date } = req.body; 

    // Basit doğrulama
    if (!categoryId || !description || !amount || !type) {
        return res.status(400).json({ error: "Kategori, açıklama, miktar ve tür zorunludur." });
    }

    try {
        // İşlemi, kimlik doğrulamasından gelen userId ile ilişkilendirerek ululuşturd
        const newTransaction = await Transaction.create({
            userId: req.userId, //  Kullanıcı aitliğini burada ekliyoruz!
            categoryId,
            description,
            amount,
            type,
            date: date || new Date() // Eğer tarih verilmezse, o anki tarihi kullan
        });

        res.status(201).json({
            status: "success",
            message: "İşlem başarıyla kaydedildi.",
            transaction: newTransaction
        });

    } catch (error) {
        console.error("Yeni işlem oluşturulurken hata:", error);
        res.status(500).json({ error: "Yeni işlem kaydedilemedi." });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
