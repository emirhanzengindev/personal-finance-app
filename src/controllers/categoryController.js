import { Category } from "../models/Category.js";

/**
 * Kullanıcıya ait yeni bir kategori oluşturur. (POST /api/categories)
 * User-specific kontrolü (aynı kullanıcı aynı isimde kategori oluşturamaz) içerir.
 */
export const createCategory = async (req, res) => {
    // req.userId, authenticateToken middleware'inden gelir.
    // req.body, Joi validasyonu (categoryCreateSchema) tarafından temizlenmiştir.
    const { name, type, icon } = req.body; 

    try {
        // 1. Kullanıcının bu isimde zaten bir kategorisi var mı kontrol et
        const existingCategory = await Category.findOne({
            where: {
                userId: req.userId,
                name: name
            }
        });

        if (existingCategory) {
            // 409 Conflict: Kullanıcıya özel olarak bu isim zaten mevcut
            return res.status(409).json({ 
                status: "error", 
                message: `Bu isimde (${name}) bir kategori zaten oluşturdunuz.` 
            });
        }

        // 2. Yeni Kategoriyi oluştur
        const newCategory = await Category.create({
            userId: req.userId, // Kullanıcı aitliğini ekle
            name,
            type,
            // icon, Joi şeması sayesinde boş ise null olarak gelir
            icon: icon || null 
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
            message: "Kategori kaydedilemedi. Sunucu hatası." 
        });
    }
};

/**
 * Kullanıcıya ait tüm kategorileri listeler. (GET /api/categories)
 */
export const getCategories = async (req, res) => {
    try {
        // Sadece giriş yapan kullanıcının kategorilerini getir
        const categories = await Category.findAll({
            where: { userId: req.userId },
            // createdAt'a göre alfabetik sıralama veya kategori adına göre sıralama eklenebilir.
            order: [['name', 'ASC']]
        });

        res.status(200).json({
            status: "success",
            count: categories.length,
            categories
        });
    } catch (error) {
        console.error("Kategoriler getirilirken hata:", error);
        res.status(500).json({ 
            status: "error",
            message: "Kategoriler listelenemedi. Sunucu hatası." 
        });
    }
};

/**
 * Mevcut bir kategoriyi günceller. (PUT /api/categories/:id)
 * KRİTİK: Sadece kategorinin sahibinin güncellemesine izin verir.
 */
export const updateCategory = async (req, res) => {
    // req.userId: Token'dan gelen kullanıcı ID'si
    // req.params.id: Rota parametresinden gelen kategori ID'si (paramsIdSchema ile doğrulandı)
    // req.body: Joi tarafından temizlenmiş, güncellenecek veriler (name veya icon)
    const { id } = req.params; 
    const updateData = req.body;

    try {
        // 1. Kategoriyi bul ve aitliğini kontrol et
        const category = await Category.findOne({
            where: { id: id }
        });

        if (!category) {
            return res.status(404).json({ 
                status: "error", 
                message: "Güncellenmek istenen kategori bulunamadı." 
            });
        }

        // Kategori, talep eden kullanıcıya mı ait?
        if (category.userId !== req.userId) {
            // 403 Forbidden: Yetkisi olmayan bir kaynağı değiştirmeye çalışıyor
            return res.status(403).json({ 
                status: "error", 
                message: "Bu kategoriyi güncelleme yetkiniz bulunmamaktadır." 
            });
        }

        // 2. Güncelleme işlemi
        const updatedCategory = await category.update(updateData);

        res.status(200).json({
            status: "success",
            message: "Kategori başarıyla güncellendi.",
            category: updatedCategory
        });

    } catch (error) {
        console.error("Kategori güncellenirken hata:", error);
        res.status(500).json({ 
            status: "error",
            message: "Kategori güncellenemedi. Sunucu hatası." 
        });
    }
};

/**
 * Mevcut bir kategoriyi siler. (DELETE /api/categories/:id)
 * KRİTİK: Sadece kategorinin sahibinin silmesine izin verir.
 */
export const deleteCategory = async (req, res) => {
    // req.userId: Token'dan gelen kullanıcı ID'si
    // req.params.id: Rota parametresinden gelen kategori ID'si (paramsIdSchema ile doğrulandı)
    const { id } = req.params;

    try {
        // 1. Kategoriyi bul ve aitliğini kontrol et
        const category = await Category.findOne({
            where: { id: id }
        });

        if (!category) {
            return res.status(404).json({ 
                status: "error", 
                message: "Silinmek istenen kategori bulunamadı." 
            });
        }

        // Kategori, talep eden kullanıcıya mı ait?
        if (category.userId !== req.userId) {
            // 403 Forbidden: Yetkisi olmayan bir kaynağı silmeye çalışıyor
            return res.status(403).json({ 
                status: "error", 
                message: "Bu kategoriyi silme yetkiniz bulunmamaktadır." 
            });
        }

        // 2. Silme işlemi
        // NOT: Sequelize ilişkilendirmelerinde onDelete: 'CASCADE' tanımlandıysa,
        // bu kategoriye bağlı işlemler de otomatik silinmelidir.
        await category.destroy();

        // 204 No Content: Silme başarılı, döndürülecek içerik yok.
        res.status(204).end(); 

    } catch (error) {
        console.error("Kategori silinirken hata:", error);
        res.status(500).json({ 
            status: "error",
            message: "Kategori silinemedi. Sunucu hatası." 
        });
    }
};
