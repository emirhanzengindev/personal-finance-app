import { Category } from "../models/Category.js";

// Kategori Oluşturma (POST /api/categories)
export const createCategory = async (req, res) => {
    // req.userId, authenticateToken middleware'i tarafından eklendi.
    const { name, type, icon } = req.body;
    
    try {
        // Aynı kullanıcı için aynı isimde kategori zaten var mı kontrolü (409 Conflict)
        const existingCategory = await Category.findOne({ 
            where: { 
                userId: req.userId,
                name: name
            } 
        });

        if (existingCategory) {
            return res.status(409).json({ 
                status: "error",
                message: "Bu kategori zaten mevcut. Lütfen farklı bir isim kullanın." 
            });
        }

        const newCategory = await Category.create({
            userId: req.userId, // Kullanıcıya aitlik
            name,
            type,
            icon: icon || null // İkon alanı boş gelirse null olarak kaydet
        });

        res.status(201).json({
            status: "success",
            message: "Kategori başarıyla oluşturuldu.",
            category: newCategory
        });

    } catch (error) {
        console.error("Kategori oluşturulurken hata:", error);
        res.status(500).json({ 
            status: "error",
            message: "Sunucu hatası: Kategori kaydedilemedi." 
        });
    }
};

// Tüm Kategorileri Getirme (GET /api/categories)
export const getCategories = async (req, res) => {
    try {
        // Yalnızca kimlik doğrulamasından gelen kullanıcıya ait kategorileri getir
        const categories = await Category.findAll({
            where: { userId: req.userId },
            order: [['name', 'ASC']]
        });

        res.json({
            status: "success",
            count: categories.length,
            categories
        });
    } catch (error) {
        console.error("Kategoriler getirilirken hata:", error);
        res.status(500).json({ 
            status: "error",
            message: "Sunucu hatası: Kategoriler getirilemedi." 
        });
    }
};

// Kategori Güncelleme (PUT /api/categories/:id)
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, icon } = req.body; // type alanını güncelleme izni yok

    try {
        const category = await Category.findOne({
            where: { id: id, userId: req.userId } // KRİTİK: Güvenlik için kullanıcıya ait olup olmadığı kontrolü
        });

        if (!category) {
            return res.status(404).json({ 
                status: "error",
                message: "Kategori bulunamadı veya bu kategoriye erişim izniniz yok." 
            });
        }

        // Güncelleme işlemi: Sadece name veya icon değiştiyse uygula
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (icon !== undefined) updateFields.icon = icon;

        // Güncelleme yapılacak alan yoksa
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ 
                status: "error",
                message: "Güncellemek için isim veya ikon alanlarından en az biri geçerli olmalıdır." 
            });
        }

        await category.update(updateFields);

        res.json({
            status: "success",
            message: "Kategori başarıyla güncellendi.",
            category
        });
        
    } catch (error) {
        console.error("Kategori güncellenirken hata:", error);
        res.status(500).json({ 
            status: "error",
            message: "Sunucu hatası: Kategori güncellenemedi." 
        });
    }
};

// Kategori Silme (DELETE /api/categories/:id)
export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Category.destroy({
            where: { id: id, userId: req.userId } 
        });

        if (result === 0) {
            return res.status(404).json({ 
                status: "error",
                message: "Kategori bulunamadı veya silme yetkiniz yok." 
            });
        }

        res.json({
            status: "success",
            message: "Kategori başarıyla silindi."
        });

    } catch (error) {
        console.error("Kategori silinirken hata:", error);
        res.status(500).json({ 
            status: "error",
            message: "Sunucu hatası: Kategori silinemedi." 
        });
    }
};
