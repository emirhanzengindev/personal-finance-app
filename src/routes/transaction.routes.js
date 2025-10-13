import express from "express";
import { createTransaction, getTransactions } from "../controllers/transaction.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Tüm işlem rotaları kimlik doğrulaması gerektirir
router.use(authenticateToken);

// POST /api/transactions
router.post("/", createTransaction);

// GET /api/transactions
router.get("/", getTransactions);

export default router;
// rotaları ilgili controllerle express ve router kullanarak eşleştrdim ve tüm rotalar için authenticateToken middlewere uyguladım 