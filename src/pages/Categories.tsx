import React from 'react';
import { useApi } from '../hooks/useApi';
import { getIconByName } from '../utils/iconUtils';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface CategoriesProps {
  onCategoryClick: (categoryId: number) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onCategoryClick }) => {
  const { data: categories, loading } = useApi('/api/categories');

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exam Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category) => {
          const Icon = getIconByName(category.icon);
          return (
            <div
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${category.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;