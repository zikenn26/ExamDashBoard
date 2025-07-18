import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import examRoutes from './routes/exams.js';
import userRoutes from './routes/user.js';
import newsRoutes from './routes/news.js';
import categoryRoutes from './routes/categories.js';
import aiRoutes from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/user', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});