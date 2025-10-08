import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_please_change_this_in_env";

/**
 
 * * Amaç: Gelen isteğin başlığındaki (Authorization Header) JWT token'ını kontrol eder.

 */
export const authenticateToken = (req, res, next) => {
    // 1. Authorization başlığını kontrol et
    const authHeader = req.headers['authorization'];
  
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // Token yoksa 401 (Unauthorized) hatası dön
        return res.status(401).json({ error: "Erişim reddedildi. Geçerli bir token gerekli." });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Token geçersiz veya süresi dolmuşsa 403 (Forbidden) hatası dön
            // 403, genellikle yetkisiz ancak token formatı doğru olduğunda kullanılır (token süresi dolmuştur vb.)
            return res.status(403).json({ error: "Token geçersiz veya süresi dolmuş." });
        }
        
        req.userId = user.id;

        
        next();
    });
};
