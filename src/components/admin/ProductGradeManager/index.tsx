import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';
import { useNotification } from '../../../hooks/useNotification';
import GradeForm from './GradeForm';
import GradeList from './GradeList';
import type { ProductGrade } from '../../../db';

export default function ProductGradeManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<ProductGrade | null>(null);
  const [formData, setFormData] = useState<Omit<ProductGrade, 'id'>>({
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
        await db.productGrades.update(editingGrade.id!, formData);
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

  if (!grades) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-4">Loading grades...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Product Grade Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Grade</span>
        </button>
      </div>

      {showForm && (
        <GradeForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingGrade}
        />
      )}

      <GradeList
        grades={grades}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}