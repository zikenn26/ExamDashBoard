import express from 'express';
import { news } from '../data.js';

const router = express.Router();

// Get all news
router.get('/', (req, res) => {
  const { category, limit } = req.query;
  let filteredNews = [...news];

  // Filter by category
  if (category && category !== 'all') {
    filteredNews = filteredNews.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  // Sort by date (newest first)
  filteredNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // Limit results
  if (limit) {
    filteredNews = filteredNews.slice(0, parseInt(limit));
  }

  res.json(filteredNews);
});

// Get latest news
router.get('/latest', (req, res) => {
  const latestNews = news.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 6);
  res.json(latestNews);
});

// Get news by ID
router.get('/:id', (req, res) => {
  const newsItem = news.find(item => item.id === parseInt(req.params.id));
  if (!newsItem) {
    return res.status(404).json({ error: 'News item not found' });
  }
  res.json(newsItem);
});

export default router;