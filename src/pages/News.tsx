import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { formatDateTime } from '../utils/dateUtils';
import { ExternalLink } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const News: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: news, loading } = useApi(`/api/news?category=${selectedCategory}`);

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'Banking', label: 'Banking' },
    { value: 'JEE', label: 'JEE' },
    { value: 'UPSC', label: 'UPSC' },
    { value: 'Medical', label: 'Medical' },
    { value: 'SSC', label: 'SSC' },
    { value: 'Railways', label: 'Railways' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Latest News</h1>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news?.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(article.publishedAt)}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {article.summary}
                </p>
                
                <a
                  href={article.sourceURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  <ExternalLink size={14} />
                  <span>Read More</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && news?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No news found for the selected category
          </p>
        </div>
      )}
    </div>
  );
};

export default News;