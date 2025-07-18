import express from 'express';
import { users, exams, getUserSavedExams, notifications } from '../data.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    savedExamsCount: user.savedExams.length
  });
});

// Get saved exams
router.get('/saved-exams', authenticateToken, (req, res) => {
  const savedExams = getUserSavedExams(req.user.id);
  res.json(savedExams);
});

// Save exam
router.post('/save-exam', authenticateToken, (req, res) => {
  try {
    const { examId } = req.body;
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const exam = exams.find(e => e.id === examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    if (user.savedExams.includes(examId)) {
      return res.status(400).json({ error: 'Exam already saved' });
    }

    user.savedExams.push(examId);
    res.json({ message: 'Exam saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save exam' });
  }
});

// Remove saved exam
router.delete('/save-exam/:examId', authenticateToken, (req, res) => {
  try {
    const examId = parseInt(req.params.examId);
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const index = user.savedExams.indexOf(examId);
    if (index === -1) {
      return res.status(404).json({ error: 'Exam not in saved list' });
    }

    user.savedExams.splice(index, 1);
    res.json({ message: 'Exam removed from saved list' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove exam' });
  }
});

// Get notifications
router.get('/notifications', authenticateToken, (req, res) => {
  const userNotifications = notifications.filter(n => n.userId === req.user.id);
  res.json(userNotifications);
});

// Mark notification as read
router.put('/notifications/:id/read', authenticateToken, (req, res) => {
  const notification = notifications.find(n => n.id === parseInt(req.params.id) && n.userId === req.user.id);
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  notification.isRead = true;
  res.json({ message: 'Notification marked as read' });
});

export default router;