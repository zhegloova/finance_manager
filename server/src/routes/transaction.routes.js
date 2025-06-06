import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getTransactions,
  createTransaction,
  getBalance
} from '../controllers/transaction.controller.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.get('/balance', getBalance);

export default router; 