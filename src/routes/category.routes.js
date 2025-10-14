import express from 'express';
import { 
    createCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory 
} from "../controllers/categoryController.js"; 

import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js'; // 1. VALIDATOR MIDDLEWARE'İ İÇE AKTAR
import { 
    categoryCreateSchema, 
    categoryUpdateSchema, 
    paramsIdSchema 
} from '../validation/category.schema.js'; // 2. JOI ŞEMALARINI İÇE AKTAR

const router = express.Router();

// 1. Kategori Oluşturma: POST /api/categories
// Gelen isteğin BODY'si categoryCreateSchema'ya göre doğrulanacak.
router.post(
    "/", 
    authenticateToken, 
    validate(categoryCreateSchema, 'body'), // VALIDASYON EKLENDİ
    createCategory
);

// 2. Tüm Kategorileri Getirme: GET /api/categories
router.get(
    "/", 
    authenticateToken, 
    getCategories
);

// 3. Kategori Güncelleme: PUT /api/categories/:id
router.put(
    "/:id", 
    authenticateToken,
    validate(paramsIdSchema, 'params'), // PARAM ID (id) VALIDASYON EKLENDİ
    validate(categoryUpdateSchema, 'body'), // BODY (name, icon) VALIDASYON EKLENDİ
    updateCategory
);

// 4. Kategori Silme: DELETE /api/categories/:id
router.delete(
    "/:id", 
    authenticateToken, 
    validate(paramsIdSchema, 'params'), // PARAM ID (id) VALIDASYON EKLENDİ
    deleteCategory
);

export default router;
