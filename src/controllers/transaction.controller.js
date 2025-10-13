//burada işlem oluşturma mantığı var
import { Transaction } from "../models/Transaction.js";
export const createTransaction = async (req, res) => {
    // req.userId, authenticateToken middleware'i tarafından eklendi.
    const { categoryId, description, amount, type, date } = req.body; 

    // Basit doğrulama (Joi'a geçene kadar kullanıyoruz)
    if (!categoryId || !description || !amount || !type) {
        return res.status(400).json({ error: "Kategori, açıklama, miktar ve tür zorunludur." });
    }

    try {
        // İşlemi, kimlik doğrulamasından gelen userId ile ilişkilendirerek oluşturuyoruz
        const newTransaction = await Transaction.create({
            userId: req.userId, // Kullanıcı aitliğini burada ekliyoruz!
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
};


export const getTransactions = async (req, res) => {
    res.status(501).json({ 
        status: "pending", 
        message: "GET /api/transactions rotası henüz tamamlanmadı." 
    });
};
