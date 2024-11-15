import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';

interface ProductGrade {
  id: string;
  code: string;
  name: string;
  description: string;
  productType: 'shell-on' | 'meat';
}

interface GradeFormData {
  code: string;
  name: string;
  description: string;
  productType: 'shell-on' | 'meat';
}

export default function ProductGradeManagement() {
  const [grades, setGrades] = useState<ProductGrade[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<ProductGrade | null>(null);
  const [formData, setFormData] = useState<GradeFormData>({
    code: '',
    name: '',
    description: '',
    productType: 'shell-on'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGrade) {
      setGrades(prev => prev.map(grade =>
        grade.id === editingGrade.id
          ? { ...grade, ...formData }
          : grade
      ));
    } else {
      const newGrade: ProductGrade = {
        id: crypto.randomUUID(),
        ...formData
      };
      setGrades(prev => [...prev, newGrade]);
    }
    
    resetForm();
  };

  const handleEdit = (grade: ProductGrade) => {
    setEditingGrade(grade);
    setFormData({
      code: grade.code,
      name: grade.name,
      description: grade.description,
      productType: grade.productType
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      setGrades(prev => prev.filter(grade => grade.id !== id));
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

  const shellOnGrades = grades.filter(g => g.productType === 'shell-on');
  const meatGrades = grades.filter(g => g.productType === 'meat');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Product Grade Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Grade</span>
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-4">
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="shell-on">Shell-on Clams</option>
                <option value="meat">Clam Meat</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                  placeholder="e.g., Premium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
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