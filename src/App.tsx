import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import AllExams from './pages/AllExams';
import Categories from './pages/Categories';
import News from './pages/News';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ChatBot from './components/chat/ChatBot';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  const handleExamClick = (examId: number) => {
    // Handle exam detail navigation
    console.log('Navigate to exam:', examId);
  };

  const handleCategoryClick = (categoryId: number) => {
    // Handle category navigation
    console.log('Navigate to category:', categoryId);
    setCurrentPage('exams');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={handlePageChange} />;
      case 'exams':
        return <AllExams onExamClick={handleExamClick} />;
      case 'categories':
        return <Categories onCategoryClick={handleCategoryClick} />;
      case 'news':
        return <News />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header onMenuToggle={handleMenuToggle} isMobileMenuOpen={isMobileMenuOpen} />
        
        <div className="flex">
          <Sidebar 
            currentPage={currentPage} 
            onPageChange={handlePageChange} 
            isOpen={isMobileMenuOpen}
          />
          
          {/* Overlay for mobile */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          <main className="flex-1 lg:ml-64">
            <div className="p-4 sm:p-6 lg:p-8">
              {renderCurrentPage()}
            </div>
          </main>
        </div>
        
        {/* AI Chatbot */}
        <ChatBot 
          isOpen={isChatOpen} 
          onToggle={() => setIsChatOpen(!isChatOpen)} 
        />
      </div>
    </div>
  );
}

export default App;