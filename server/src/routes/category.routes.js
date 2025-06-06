import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getCategories,
  createCategory,
  deleteCategory
} from '../controllers/category.controller.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCategories)
  .post(createCategory);

router.route('/:id')
  .delete(deleteCategory);

export default router; 