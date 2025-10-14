import Joi from 'joi';

// Kategori Oluşturma Şeması (POST /api/categories)
export const categoryCreateSchema = Joi.object({
    // 'name' alanı zorunludur.
    name: Joi.string()
        .min(2) // Minimum 2 karakter
        .max(50) // Maksimum 50 karakter
        .required()
        .messages({
            'string.base': 'İsim alanı metin olmalıdır.',
            'string.min': 'İsim en az 2 karakter olmalıdır.',
            'string.max': 'İsim en fazla 50 karakter olmalıdır.',
            'any.required': 'İsim alanı zorunludur.'
        }),
    
    // 'type' alanı zorunludur ve sadece 'income' veya 'expense' olabilir.
    type: Joi.string()
        .valid('income', 'expense')
        .required()
        .messages({
            'any.only': 'Tip alanı sadece "income" (gelir) veya "expense" (gider) olabilir.',
            'any.required': 'Tip alanı zorunludur.'
        }),
    
    // 'icon' alanı isteğe bağlıdır, boş string gelirse null olarak kabul edilir (veya string).
    icon: Joi.string()
        .max(50)
        .allow(null, '') 
        .default(null)
        .messages({
            'string.max': 'İkon URL/Adı en fazla 50 karakter olabilir.'
        })
});


// Kategori Güncelleme Şeması (PUT /api/categories/:id)
// Güncelleme işleminde sadece 'name' veya 'icon' alanlarından en az biri gelmelidir.
export const categoryUpdateSchema = Joi.object({
    // name alanı zorunlu değil ama gelirse kurallara uymalı
    name: Joi.string()
        .min(2)
        .max(50)
        .messages({
            'string.base': 'İsim alanı metin olmalıdır.',
            'string.min': 'İsim en az 2 karakter olmalıdır.',
            'string.max': 'İsim en fazla 50 karakter olmalıdır.'
        }),

    // icon alanı zorunlu değil ama gelirse kurallara uymalı
    icon: Joi.string()
        .max(50)
        .allow(null, '') 
        .default(null)
        .messages({
            'string.max': 'İkon URL/Adı en fazla 50 karakter olabilir.'
        }),

    // type alanının güncellenmesine izin verilmez, bu yüzden şemaya eklenmedi.
    
}).or('name', 'icon') // KRİTİK: Güncelleme için en az 'name' VEYA 'icon' gelmeli.
.messages({
    'object.missing': 'Güncelleme için "name" veya "icon" alanlarından en az biri sağlanmalıdır.'
});

// Rota parametresi ID doğrulaması (/:id)
export const paramsIdSchema = Joi.object({
    id: Joi.number()
        .integer() // Tam sayı olmalı
        .positive() // Pozitif olmalı
        .required()
        .messages({
            'number.base': 'ID bir sayı olmalıdır.',
            'number.integer': 'ID tam sayı olmalıdır.',
            'number.positive': 'ID pozitif bir sayı olmalıdır.',
            'any.required': 'ID parametresi zorunludur.'
        })
});
