import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { Calendar, Clock, Bookmark, Newspaper, TrendingUp } from 'lucide-react';
import ExamCard from '../components/exams/ExamCard';
import CountdownTimer from '../components/common/CountdownTimer';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const [savedExams, setSavedExams] = useState<any[]>([]);
  const { data: upcomingExams, loading: examsLoading } = useApi('/api/exams/upcoming');
  const { data: latestNews, loading: newsLoading } = useApi('/api/news/latest');
  const { data: categories } = useApi('/api/categories');

  useEffect(() => {
    if (user) {
      fetchSavedExams();
    }
  }, [user]);

  const fetchSavedExams = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/user/saved-exams', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSavedExams(data);
    } catch (error) {
      console.error('Error fetching saved exams:', error);
    }
  };

  const handleSaveToggle = (examId: number, isSaved: boolean) => {
    if (isSaved) {
      setSavedExams(prev => prev.filter(exam => exam.id !== examId));
    } else {
      const examToAdd = upcomingExams?.find(exam => exam.id === examId);
      if (examToAdd) {
        setSavedExams(prev => [...prev, examToAdd]);
      }
    }
  };

  const isExamSaved = (examId: number) => {
    return savedExams.some(exam => exam.id === examId);
  };

  const stats = [
    {
      title: 'Upcoming Exams',
      value: upcomingExams?.length || 0,
      icon: Calendar,
      color: 'bg-blue-500',
      onClick: () => onPageChange('exams')
    },
    {
      title: 'Saved Exams',
      value: savedExams.length,
      icon: Bookmark,
      color: 'bg-green-500',
      onClick: () => onPageChange('profile')
    },
    {
      title: 'Categories',
      value: categories?.length || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      onClick: () => onPageChange('categories')
    },
    {
      title: 'Latest News',
      value: latestNews?.length || 0,
      icon: Newspaper,
      color: 'bg-orange-500',
      onClick: () => onPageChange('news')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 text-lg">
              Stay updated with your exam schedule and notifications
            </p>
          </div>
          <div className="hidden md:block">
            <Clock size={48} className="text-blue-200" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={stat.onClick}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Exams */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upcoming Exams
          </h2>
          <button
            onClick={() => onPageChange('exams')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            View All
          </button>
        </div>

        {examsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingExams?.slice(0, 6).map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onExamClick={() => onPageChange('exam-detail')}
                isSaved={isExamSaved(exam.id)}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        )}
      </div>

      {/* Latest News */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Latest News
          </h2>
          <button
            onClick={() => onPageChange('news')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            View All
          </button>
        </div>

        {newsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews?.slice(0, 3).map((news) => (
              <div
                key={news.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                      {news.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                    {news.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;