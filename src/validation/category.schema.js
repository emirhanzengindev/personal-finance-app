import Joi from 'joi';

// Kategori Oluşturma Şeması (POST /api/categories)
// Yeni bir kategori oluşturulurken tüm alanlar zorunludur
export const categoryCreateSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
        'string.base': 'Kategori adı metin olmalıdır',
        'string.empty': 'Kategori adı boş bırakılamaz',
        'string.min': 'Kategori adı en az 2 karakter olmalıdır',
        'string.max': 'Kategori adı en fazla 50 karakter olmalıdır',
        'any.required': 'Kategori adı zorunludur'
    }),
    // Type sadece 'income' veya 'expense' olabilir
    type: Joi.string().valid('income', 'expense').required().messages({
        'string.base': 'Tür metin olmalıdır',
        'any.only': 'Tür sadece "income" (gelir) veya "expense" (gider) olabilir',
        'any.required': 'Tür zorunludur'
    }),
    icon: Joi.string().trim().max(50).allow(null, '').optional().messages({
        'string.base': 'İkon metin olmalıdır',
        'string.max': 'İkon en fazla 50 karakter olmalıdır'
    })
});

// Kategori Güncelleme Şeması (PUT /api/categories/:id)
export const categoryUpdateSchema = Joi.object({
    // Güncelleme işleminde tüm alanlar isteğe bağlıdır, ancak en az biri gönderilmelidir.
    name: Joi.string().trim().min(2).max(50).optional().messages({
        'string.base': 'Kategori adı metin olmalıdır',
        'string.min': 'Kategori adı en az 2 karakter olmalıdır',
        'string.max': 'Kategori adı en fazla 50 karakter olmalıdır'
    }),
    icon: Joi.string().trim().max(50).allow(null, '').optional().messages({
        'string.base': 'İkon metin olmalıdır',
        'string.max': 'İkon en fazla 50 karakter olmalıdır'
    })
    // Not: Kategori türü (type) güncelleme rotasında değiştirilemez.
}).min(1).messages({
    'object.min': 'Güncellemek için isim veya ikon alanlarından en az biri gönderilmelidir'
});


// URL Parametresi ID Doğrulama Şeması (/:id)
// Hem PUT hem de DELETE rotaları için kullanılır.
export const paramsIdSchema = Joi.object({
    // ID'nin URL'den geldiğini varsayarak number ve integer olmasını isteriz
    id: Joi.number().integer().min(1).required().messages({
        'number.base': 'ID bir sayı olmalıdır',
        'number.integer': 'ID tam sayı olmalıdır',
        'number.min': 'ID en az 1 olmalıdır',
        'any.required': 'Kategori ID zorunludur'
    })
});
