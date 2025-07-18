import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Bookmark, Calendar } from 'lucide-react';
import ExamCard from '../components/exams/ExamCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [savedExams, setSavedExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = (examId: number, isSaved: boolean) => {
    if (!isSaved) {
      setSavedExams(prev => prev.filter(exam => exam.id !== examId));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
      
      {/* Profile Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Mail size={20} className="text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">{user?.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield size={20} className="text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300 capitalize">{user?.role}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bookmark size={20} className="text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">{savedExams.length} saved exams</span>
          </div>
        </div>
      </div>

      {/* Saved Exams */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Saved Exams</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : savedExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onExamClick={() => {}}
                isSaved={true}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Bookmark size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No saved exams yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Save exams to keep track of them easily
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;