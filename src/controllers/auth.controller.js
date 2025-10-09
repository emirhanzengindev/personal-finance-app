import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Şifre hashleme gücü
const SALT_ROUNDS = 10; 
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_please_change_this_in_env";

/**
 * Yeni bir kullanıcı kaydı yapar. (POST /api/auth/register)
 */
export const register = async (req, res) => {
    const { email, password, firstName, lastName, username } = req.body; 

    // Basit doğrulama (Joi'a geçene kadar kullanıyoruz)
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
};

/**
 * Kullanıcı girişi yapar ve JWT token döndürür. (POST /api/auth/login)
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    // Basit doğrulama
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
};

/**
 * Yetkili kullanıcının bilgilerini döndürür. (GET /api/auth/me)
 * req.userId, middleware'den gelir.
 */
export const getMe = async (req, res) => {
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
};
