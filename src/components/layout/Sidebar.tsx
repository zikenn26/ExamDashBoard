import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Newspaper, 
  User,
  Settings,
  Shield
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, isOpen }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'exams', label: 'All Exams', icon: Calendar },
    { id: 'categories', label: 'Categories', icon: BookOpen },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin Panel', icon: Shield });
  }

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`
                  w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${currentPage === item.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;