import React from 'react';
import { Tag } from 'lucide-react';
import type { ProductGrade } from '../../../db';

interface GradeFormProps {
  formData: Omit<ProductGrade, 'id'>;
  setFormData: (data: Omit<ProductGrade, 'id'>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export default function GradeForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel,
  isEditing 
}: GradeFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? 'Edit Grade' : 'Add New Grade'}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Type
          </label>
          <select
            value={formData.productType}
            onChange={(e) => setFormData({ 
              ...formData, 
              productType: e.target.value as 'shell-on' | 'meat'
            })}
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
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Describe the grade specifications..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isEditing ? 'Update Grade' : 'Add Grade'}
          </button>
        </div>
      </form>
    </div>
  );
}