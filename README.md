# My Exam Dashboard - Full Stack Application

A comprehensive exam management system with AI-powered features, real-time news integration, and intelligent chatbot assistance.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based login/signup system
- **Exam Management**: Complete CRUD operations for exams and categories
- **Real-time Countdown**: Live countdown timers for exam dates and deadlines
- **Bookmark System**: Save and manage favorite exams
- **News Integration**: Real-time exam news with AI summarization
- **Admin Panel**: Full administrative control over exams and categories
- **Responsive Design**: Mobile-first approach with dark/light mode

### AI-Powered Features
- **Intelligent Chatbot**: Natural language processing for exam queries
- **Exam Insights**: AI-generated exam analysis and difficulty assessment
- **Study Plans**: Personalized study schedules using Gemini AI
- **News Analysis**: OpenAI-powered news summarization and trend analysis
- **Smart Recommendations**: Personalized exam suggestions based on user profile

## 🔧 API Configuration

### Required API Keys

Copy the API keys to the following file:

**📁 File: `server/.env`**

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Google Gemini Configuration  
GEMINI_API_KEY=your_gemini_api_key_here

# News API Configuration
NEWS_API_KEY=your_news_api_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

### How to Get API Keys

1. **OpenAI API Key**:
   - Visit: https://platform.openai.com/api-keys
   - Create account and generate API key
   - Add to `OPENAI_API_KEY` in `.env`

2. **Google Gemini API Key**:
   - Visit: https://makersuite.google.com/app/apikey
   - Create project and generate API key
   - Add to `GEMINI_API_KEY` in `.env`

3. **News API Key**:
   - Visit: https://newsapi.org/register
   - Register and get free API key
   - Add to `NEWS_API_KEY` in `.env`

## 📚 API Endpoints

### 🔐 Authentication APIs
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### 👤 User Management APIs
- `GET /api/user/profile` - Get user profile
- `GET /api/user/saved-exams` - Get bookmarked exams
- `POST /api/user/save-exam` - Save/bookmark exam
- `DELETE /api/user/save-exam/:id` - Remove saved exam
- `GET /api/user/notifications` - Get notifications

### 📚 Exam Management APIs
- `GET /api/exams` - Get all exams (with filtering)
- `GET /api/exams/upcoming` - Get upcoming exams
- `GET /api/exams/:id` - Get specific exam
- `POST /api/exams` - Add new exam (Admin)
- `PUT /api/exams/:id` - Update exam (Admin)
- `DELETE /api/exams/:id` - Delete exam (Admin)

### 🏷️ Category APIs
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get specific category

### 📰 News APIs
- `GET /api/news` - Get all news
- `GET /api/news/latest` - Get latest news
- `GET /api/news/:id` - Get specific news article

### 🤖 AI-Powered APIs
- `POST /api/ai/chat` - AI chatbot conversation
- `GET /api/ai/exam-summary/:id` - OpenAI exam summary
- `GET /api/ai/exam-insights/:id` - Gemini exam insights
- `POST /api/ai/study-plan` - Personalized study plan
- `GET /api/ai/recommendations` - AI recommendations
- `GET /api/ai/news-analysis` - News trend analysis
- `GET /api/ai/live-news` - Real-time news fetching
- `GET /api/ai/trending-news` - Trending exam news

## 🛠️ Installation & Setup

1. **Clone and Install Dependencies**:
```bash
npm install
cd server && npm install
```

2. **Configure API Keys**:
   - Copy `server/.env.example` to `server/.env`
   - Add your API keys as shown above

3. **Start Development Server**:
```bash
npm run dev
```

4. **Access Application**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## 🎯 AI Features Usage

### Chatbot Capabilities
- **Exam Queries**: "Show me upcoming banking exams"
- **News Updates**: "Latest JEE news"
- **Study Help**: "How to prepare for UPSC?"
- **Deadline Alerts**: "Which exams have open applications?"

### AI-Generated Content
- **Exam Summaries**: Detailed exam overviews using OpenAI
- **Study Plans**: Personalized preparation schedules via Gemini
- **News Analysis**: Trend analysis and insights from latest news
- **Smart Recommendations**: Exam suggestions based on user profile

### Real-time Data
- **Live News**: Fetches latest exam news from News API
- **Trending Topics**: Identifies popular exam-related discussions
- **Dynamic Updates**: Real-time content updates and notifications

## 🔒 Security Features
- JWT-based authentication
- Protected admin routes
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📱 Responsive Design
- Mobile-first approach
- Dark/light mode toggle
- Smooth animations and transitions
- Touch-friendly interface
- Cross-browser compatibility

## 🚀 Deployment Ready
- Environment configuration
- Production build optimization
- API error handling
- Fallback mechanisms for AI services

---

**Note**: The application works with or without API keys. If API keys are not configured, it falls back to mock data and rule-based responses while maintaining full functionality.