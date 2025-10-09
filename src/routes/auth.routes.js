import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me (Yetkilendirme gerektirir)
router.get("/me", authenticateToken, getMe);

export default router;
