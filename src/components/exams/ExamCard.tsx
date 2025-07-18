import React, { useState } from 'react';
import { Calendar, Clock, Users, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatDate, getExamStatus, getStatusColor } from '../../utils/dateUtils';
import { apiCall } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import CountdownTimer from '../common/CountdownTimer';

interface ExamCardProps {
  exam: {
    id: number;
    name: string;
    examDate: string;
    applicationEndDate: string;
    description: string;
    category: {
      name: string;
      color: string;
    };
    seats: number;
    fee: string;
    officialWebsite: string;
  };
  onExamClick: (examId: number) => void;
  isSaved?: boolean;
  onSaveToggle?: (examId: number, isSaved: boolean) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ 
  exam, 
  onExamClick, 
  isSaved = false, 
  onSaveToggle 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const status = getExamStatus(exam.examDate, exam.applicationEndDate);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !onSaveToggle) return;

    setLoading(true);
    try {
      if (isSaved) {
        await apiCall(`/api/user/save-exam/${exam.id}`, { method: 'DELETE' });
      } else {
        await apiCall('/api/user/save-exam', { 
          method: 'POST', 
          body: { examId: exam.id } 
        });
      }
      onSaveToggle(exam.id, !isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${exam.category.color} text-white`}>
                {exam.category.name}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
            <h3 
              className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
              onClick={() => onExamClick(exam.id)}
            >
              {exam.name}
            </h3>
          </div>
          
          {user && (
            <button
              onClick={handleSaveToggle}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {exam.description}
        </p>

        {/* Exam Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar size={16} />
            <span>Exam: {formatDate(exam.examDate)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock size={16} />
            <span>Apply by: {formatDate(exam.applicationEndDate)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Users size={16} />
            <span>{exam.seats.toLocaleString()} seats</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Fee: {exam.fee}</span>
          </div>
        </div>

        {/* Countdown and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-gray-400" />
            <CountdownTimer 
              targetDate={status === 'Open' ? exam.applicationEndDate : exam.examDate}
              className="text-sm font-medium"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <a
              href={exam.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
              <span>Official Site</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;