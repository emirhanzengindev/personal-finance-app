/**
 * Joi şeması kullanarak gelen isteğin verilerini (body, params veya query) doğrular.
 * * @param {Joi.Schema} schema - Kullanılacak Joi şeması (örneğin: categoryCreateSchema)
 * @param {string} source - Doğrulanacak veri kaynağı ('body', 'params' veya 'query')
 * @returns {function} Express middleware fonksiyonu
 */
export const validate = (schema, source) => (req, res, next) => {
    // Doğrulanacak veriyi seç
    const data = req[source];

    // Şemayı kullanarak veriyi doğrula
    const { error, value } = schema.validate(data, {
        abortEarly: false, // Tüm hataları toplu göster
        allowUnknown: false // Şemada olmayan alanlara izin verme
    });

    if (error) {
        // Joi hatası oluşursa, hata mesajlarını düzenle
        const errorMessages = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message.replace(/['"]/g, '') // Tırnakları temizle
        }));

        // 400 Bad Request hatası döndür
        return res.status(400).json({
            status: 'error',
            message: 'Doğrulama hatası.',
            errors: errorMessages
        });
    }

    // Doğrulanan ve temizlenen veriyi (varsa default değerler eklenmiş)
    // orijinal isteğin ilgili kaynağına geri yaz.
    req[source] = value;
    
    // Doğrulama başarılı, sonraki middleware/controller'a geç
    next();
};
