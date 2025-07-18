import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi, apiCall } from '../hooks/useApi';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [isAddingExam, setIsAddingExam] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { data: exams, loading: examsLoading, refetch: refetchExams } = useApi('/api/exams');
  const { data: categories } = useApi('/api/categories');

  const [newExam, setNewExam] = useState({
    name: '',
    categoryId: '',
    examDate: '',
    applicationEndDate: '',
    description: '',
    eligibility: '',
    fee: '',
    seats: '',
    officialWebsite: '',
    syllabus: ''
  });

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const examData = {
        ...newExam,
        categoryId: parseInt(newExam.categoryId),
        seats: parseInt(newExam.seats),
        syllabus: newExam.syllabus.split(',').map(s => s.trim()),
        status: 'Open'
      };

      await apiCall('/api/exams', { method: 'POST', body: examData });
      setIsAddingExam(false);
      setNewExam({
        name: '',
        categoryId: '',
        examDate: '',
        applicationEndDate: '',
        description: '',
        eligibility: '',
        fee: '',
        seats: '',
        officialWebsite: '',
        syllabus: ''
      });
      refetchExams();
    } catch (error) {
      console.error('Error adding exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam) return;
    
    setLoading(true);
    
    try {
      const examData = {
        ...editingExam,
        categoryId: parseInt(editingExam.categoryId),
        seats: parseInt(editingExam.seats),
        syllabus: typeof editingExam.syllabus === 'string' 
          ? editingExam.syllabus.split(',').map(s => s.trim())
          : editingExam.syllabus
      };

      await apiCall(`/api/exams/${editingExam.id}`, { method: 'PUT', body: examData });
      setEditingExam(null);
      refetchExams();
    } catch (error) {
      console.error('Error updating exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId: number) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    
    setLoading(true);
    
    try {
      await apiCall(`/api/exams/${examId}`, { method: 'DELETE' });
      refetchExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditingExam = (exam: any) => {
    setEditingExam({
      ...exam,
      categoryId: exam.categoryId.toString(),
      seats: exam.seats.toString(),
      syllabus: Array.isArray(exam.syllabus) ? exam.syllabus.join(', ') : exam.syllabus
    });
  };

  if (examsLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        <button
          onClick={() => setIsAddingExam(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Exam</span>
        </button>
      </div>

      {/* Add Exam Form */}
      {isAddingExam && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Exam</h2>
          <form onSubmit={handleAddExam} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Exam Name"
                value={newExam.name}
                onChange={(e) => setNewExam({...newExam, name: e.target.value})}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              />
              <select
                value={newExam.categoryId}
                onChange={(e) => setNewExam({...newExam, categoryId: e.target.value})}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Category</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <input
                type="date"
                placeholder="Exam Date"
                value={newExam.examDate}
                onChange={(e) => setNewExam({...newExam, examDate: e.target.value})}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              />
              <input
                type="date"
                placeholder="Application End Date"
                value={newExam.applicationEndDate}
                onChange={(e) => setNewExam({...newExam, applicationEndDate: e.target.value})}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              />
              <input
                type="text"
                placeholder="Fee (e.g., ₹1000)"
                value={newExam.fee}
                onChange={(e) => setNewExam({...newExam, fee: e.target.value})}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              />
              <input
                type="number"
                placeholder="Number of Seats"
                value={newExam.seats}
                onChange={(e) => setNewExam({...newExam, seats: e.target.value})}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              />
            </div>
            <textarea
              placeholder="Description"
              value={newExam.description}
              onChange={(e) => setNewExam({...newExam, description: e.target.value})}
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              rows={3}
              required
            />
            <input
              type="text"
              placeholder="Eligibility"
              value={newExam.eligibility}
              onChange={(e) => setNewExam({...newExam, eligibility: e.target.value})}
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              required
            />
            <input
              type="url"
              placeholder="Official Website"
              value={newExam.officialWebsite}
              onChange={(e) => setNewExam({...newExam, officialWebsite: e.target.value})}
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Syllabus (comma-separated)"
              value={newExam.syllabus}
              onChange={(e) => setNewExam({...newExam, syllabus: e.target.value})}
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                {loading ? <LoadingSpinner size="sm" /> : <Save size={20} />}
                <span>Save Exam</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddingExam(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Exam Form */}
      {editingExam && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit Exam</h2>
          <form onSubmit={handleEditExam} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Exam Name"
                value={editingExam.name}
                onChange={(e) => setEditingExam({...editingExam, name: e.target.value})}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              />
              <select
                value={editingExam.categoryId}
                onChange={(e) => setEditingExam({...editingExam, categoryId: e.target.value})}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Category</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={editingExam.examDate}
                onChange={(e) => setEditingExam({...editingExam, examDate: e.target.value})}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              />
              <input
                type="date"
                value={editingExam.applicationEndDate}
                onChange={(e) => setEditingExam({...editingExam, applicationEndDate: e.target.value})}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              />
              <input
                type="text"
                placeholder="Fee"
                value={editingExam.fee}
                onChange={(e) => setEditingExam({...editingExam, fee: e.target.value})}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              />
              <input
                type="number"
                placeholder="Number of Seats"
                value={editingExam.seats}
                onChange={(e) => setEditingExam({...editingExam, seats: e.target.value})}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                required
              />
            </div>
            <textarea
              placeholder="Description"
              value={editingExam.description}
              onChange={(e) => setEditingExam({...editingExam, description: e.target.value})}
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              rows={3}
              required
            />
            <input
              type="text"
              placeholder="Eligibility"
              value={editingExam.eligibility}
              onChange={(e) => setEditingExam({...editingExam, eligibility: e.target.value})}
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              required
            />
            <input
              type="url"
              placeholder="Official Website"
              value={editingExam.officialWebsite}
              onChange={(e) => setEditingExam({...editingExam, officialWebsite: e.target.value})}
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Syllabus (comma-separated)"
              value={editingExam.syllabus}
              onChange={(e) => setEditingExam({...editingExam, syllabus: e.target.value})}
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                {loading ? <LoadingSpinner size="sm" /> : <Save size={20} />}
                <span>Update Exam</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingExam(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Exams List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Exam Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Exam Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {exams?.map((exam) => (
                <tr key={exam.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {exam.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${exam.category?.color} text-white`}>
                      {exam.category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(exam.examDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      exam.status === 'Open' ? 'bg-green-100 text-green-800' : 
                      exam.status === 'Closed' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditingExam(exam)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;