import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getScheduledPayments,
  createScheduledPayment,
  deleteScheduledPayment
} from '../controllers/scheduledPayment.controller.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getScheduledPayments)
  .post(createScheduledPayment);

router.route('/:id')
  .delete(deleteScheduledPayment);

export default router; 