import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import { db } from '../../db';
import { useLiveQuery } from 'dexie-react-hooks';

interface GradeFormData {
  code: string;
  name: string;
  description: string;
  productType: 'shell-on' | 'meat';
}

export default function ProductGradeManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<any>(null);
  const [formData, setFormData] = useState<GradeFormData>({
    code: '',
    name: '',
    description: '',
    productType: 'shell-on'
  });

  const { addNotification } = useNotification();
  const grades = useLiveQuery(() => db.productGrades.toArray());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingGrade) {
        await db.productGrades.update(editingGrade.id, formData);
        addNotification('success', 'Grade updated successfully');
      } else {
        await db.productGrades.add(formData);
        addNotification('success', 'Grade added successfully');
      }
      
      resetForm();
    } catch (error) {
      addNotification('error', 'Error saving grade');
      console.error('Error:', error);
    }
  };

  const handleEdit = (grade: any) => {
    setEditingGrade(grade);
    setFormData({
      code: grade.code,
      name: grade.name,
      description: grade.description,
      productType: grade.productType
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await db.productGrades.delete(id);
        addNotification('success', 'Grade deleted successfully');
      } catch (error) {
        addNotification('error', 'Error deleting grade');
        console.error('Error:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      productType: 'shell-on'
    });
    setEditingGrade(null);
    setShowForm(false);
  };

  const shellOnGrades = grades?.filter(g => g.productType === 'shell-on') || [];
  const meatGrades = grades?.filter(g => g.productType === 'meat') || [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Product Grade Management</h2>
        <p className="text-sm text-gray-600 mt-1">Define and manage product quality grades</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Grade</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingGrade ? 'Edit Grade' : 'Add New Grade'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Type
              </label>
              <select
                value={formData.productType}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  productType: e.target.value as 'shell-on' | 'meat'
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="shell-on">Shell-on Clams</option>
                <option value="meat">Clam Meat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="e.g., A, B, C"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="e.g., Premium, Standard"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Describe the grade specifications..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingGrade ? 'Update Grade' : 'Add Grade'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 bg-green-50 rounded-t-lg">
            <h3 className="text-lg font-semibold text-green-800">Shell-on Grades</h3>
          </div>
          <div className="divide-y">
            {shellOnGrades.map((grade) => (
              <div key={grade.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Tag className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">
                        Grade {grade.code} - {grade.name}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{grade.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(grade)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(grade.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {shellOnGrades.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No shell-on grades defined
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 bg-red-50 rounded-t-lg">
            <h3 className="text-lg font-semibold text-red-800">Meat Grades</h3>
          </div>
          <div className="divide-y">
            {meatGrades.map((grade) => (
              <div key={grade.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Tag className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-gray-900">
                        Grade {grade.code} - {grade.name}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{grade.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(grade)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(grade.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {meatGrades.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No meat grades defined
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}