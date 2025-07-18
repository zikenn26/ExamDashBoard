import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import ExamCard from '../components/exams/ExamCard';
import ExamFilters from '../components/exams/ExamFilters';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface AllExamsProps {
  onExamClick: (examId: number) => void;
}

const AllExams: React.FC<AllExamsProps> = ({ onExamClick }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [savedExams, setSavedExams] = useState<any[]>([]);

  const { data: categories } = useApi('/api/categories');
  const { data: exams, loading, refetch } = useApi(`/api/exams?search=${searchTerm}&category=${selectedCategory}&status=${selectedStatus}`);

  useEffect(() => {
    if (user) {
      fetchSavedExams();
    }
  }, [user]);

  useEffect(() => {
    refetch();
  }, [searchTerm, selectedCategory, selectedStatus]);

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
      const examToAdd = exams?.find(exam => exam.id === examId);
      if (examToAdd) {
        setSavedExams(prev => [...prev, examToAdd]);
      }
    }
  };

  const isExamSaved = (examId: number) => {
    return savedExams.some(exam => exam.id === examId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Exams</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {exams?.length || 0} exams found
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search exams by name or description..."
        />
        
        {categories && (
          <ExamFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
        )}
      </div>

      {/* Exams Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams?.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onExamClick={onExamClick}
              isSaved={isExamSaved(exam.id)}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}

      {!loading && exams?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No exams found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default AllExams;