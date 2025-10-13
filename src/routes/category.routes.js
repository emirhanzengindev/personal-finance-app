import express from 'express';
import { 
    createCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory 
} from "../controllers/categoryController.js"; 

import { authenticateToken } from '../middleware/auth.js';


const router = express.Router();

// 1. Kategori Oluşturma: POST /api/categories

router.post(
    "/", 
    authenticateToken, 
    
    createCategory
);

// 2. Tüm Kategorileri Getirme: GET /api/categories
router.get(
    "/", 
    authenticateToken, 
    getCategories
);


router.put(
    "/:id", 
    authenticateToken,

    updateCategory
);


router.delete(
    "/:id", 
    authenticateToken, 
    
    deleteCategory
);

export default router;
