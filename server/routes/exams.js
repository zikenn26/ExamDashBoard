import express from 'express';
import { exams, categories, getExamsByCategory, getUpcomingExams, addExam, updateExam, deleteExam } from '../data.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all exams
router.get('/', (req, res) => {
  const { category, status, search } = req.query;
  let filteredExams = [...exams];

  // Filter by category
  if (category && category !== 'all') {
    filteredExams = filteredExams.filter(exam => exam.categoryId === parseInt(category));
  }

  // Filter by status
  if (status && status !== 'all') {
    filteredExams = filteredExams.filter(exam => exam.status.toLowerCase() === status.toLowerCase());
  }

  // Search filter
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredExams = filteredExams.filter(exam => 
      exam.name.toLowerCase().includes(searchTerm) ||
      exam.description.toLowerCase().includes(searchTerm)
    );
  }

  // Add category info
  const examsWithCategory = filteredExams.map(exam => ({
    ...exam,
    category: categories.find(cat => cat.id === exam.categoryId)
  }));

  res.json(examsWithCategory);
});

// Get upcoming exams
router.get('/upcoming', (req, res) => {
  const upcomingExams = getUpcomingExams();
  const examsWithCategory = upcomingExams.map(exam => ({
    ...exam,
    category: categories.find(cat => cat.id === exam.categoryId)
  }));
  res.json(examsWithCategory);
});

// Get exam by ID
router.get('/:id', (req, res) => {
  const exam = exams.find(e => e.id === parseInt(req.params.id));
  if (!exam) {
    return res.status(404).json({ error: 'Exam not found' });
  }

  const examWithCategory = {
    ...exam,
    category: categories.find(cat => cat.id === exam.categoryId)
  };

  res.json(examWithCategory);
});

// Get exams by category
router.get('/category/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const categoryExams = getExamsByCategory(categoryId);
  const examsWithCategory = categoryExams.map(exam => ({
    ...exam,
    category: categories.find(cat => cat.id === exam.categoryId)
  }));
  res.json(examsWithCategory);
});

// Add new exam (Admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const newExam = addExam(req.body);
    res.status(201).json(newExam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add exam' });
  }
});

// Update exam (Admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const examId = parseInt(req.params.id);
    const updatedExam = updateExam(examId, req.body);
    if (!updatedExam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(updatedExam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update exam' });
  }
});

// Delete exam (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const examId = parseInt(req.params.id);
    const deleted = deleteExam(examId);
    if (!deleted) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete exam' });
  }
});

export default router;