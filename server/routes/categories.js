import express from 'express';
import { categories } from '../data.js';

const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
  res.json(categories);
});

// Get category by ID
router.get('/:id', (req, res) => {
  const category = categories.find(cat => cat.id === parseInt(req.params.id));
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json(category);
});

export default router;