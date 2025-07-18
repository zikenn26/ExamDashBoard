import express from 'express';
import { generateExamSummary, generateNewsAnalysis, generateChatResponse } from '../services/openai.js';
import { generateExamInsights, generateStudyPlan, generatePersonalizedRecommendations } from '../services/gemini.js';
import { fetchLatestExamNews, fetchTrendingExamNews } from '../services/newsApi.js';
import { exams, categories, news } from '../data.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// AI Chat endpoint
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    const chatContext = {
      exams: exams.slice(0, 5), // Provide recent exams as context
      news: news.slice(0, 3),   // Provide recent news as context
      user: req.user
    };

    const response = await generateChatResponse(message, chatContext);
    
    res.json({
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Generate exam summary using OpenAI
router.get('/exam-summary/:id', async (req, res) => {
  try {
    const examId = parseInt(req.params.id);
    const exam = exams.find(e => e.id === examId);
    
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Add category info
    const examWithCategory = {
      ...exam,
      category: categories.find(cat => cat.id === exam.categoryId)
    };

    const summary = await generateExamSummary(examWithCategory);
    
    res.json({
      examId,
      summary,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Exam Summary Error:', error);
    res.status(500).json({ error: 'Failed to generate exam summary' });
  }
});

// Generate exam insights using Gemini
router.get('/exam-insights/:id', async (req, res) => {
  try {
    const examId = parseInt(req.params.id);
    const exam = exams.find(e => e.id === examId);
    
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const examWithCategory = {
      ...exam,
      category: categories.find(cat => cat.id === exam.categoryId)
    };

    const insights = await generateExamInsights(examWithCategory);
    
    res.json({
      examId,
      insights,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Exam Insights Error:', error);
    res.status(500).json({ error: 'Failed to generate exam insights' });
  }
});

// Generate study plan using Gemini
router.post('/study-plan', authenticateToken, async (req, res) => {
  try {
    const { examId, timeAvailable } = req.body;
    const exam = exams.find(e => e.id === examId);
    
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const examWithCategory = {
      ...exam,
      category: categories.find(cat => cat.id === exam.categoryId)
    };

    const studyPlan = await generateStudyPlan(examWithCategory, timeAvailable);
    
    res.json({
      examId,
      timeAvailable,
      studyPlan,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Study Plan Error:', error);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
});

// Get personalized recommendations using Gemini
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const userProfile = {
      id: req.user.id,
      role: req.user.role,
      // Add more profile data as needed
    };

    // Mock exam history - in real app, this would come from database
    const examHistory = exams.slice(0, 3);

    const recommendations = await generatePersonalizedRecommendations(userProfile, examHistory);
    
    res.json({
      userId: req.user.id,
      recommendations,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Recommendations Error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Get news analysis using OpenAI
router.get('/news-analysis', async (req, res) => {
  try {
    const { category } = req.query;
    
    // Get recent news for analysis
    let newsForAnalysis = news;
    if (category && category !== 'all') {
      newsForAnalysis = news.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    const analysis = await generateNewsAnalysis(newsForAnalysis.slice(0, 5));
    
    res.json({
      category: category || 'all',
      analysis,
      newsCount: newsForAnalysis.length,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('News Analysis Error:', error);
    res.status(500).json({ error: 'Failed to generate news analysis' });
  }
});

// Fetch real-time news using News API
router.get('/live-news', async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    const liveNews = await fetchLatestExamNews(category, parseInt(limit));
    
    res.json({
      category: category || 'all',
      news: liveNews,
      count: liveNews.length,
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Live News Error:', error);
    res.status(500).json({ error: 'Failed to fetch live news' });
  }
});

// Get trending exam news
router.get('/trending-news', async (req, res) => {
  try {
    const trendingNews = await fetchTrendingExamNews();
    
    res.json({
      news: trendingNews,
      count: trendingNews.length,
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Trending News Error:', error);
    res.status(500).json({ error: 'Failed to fetch trending news' });
  }
});

export default router;