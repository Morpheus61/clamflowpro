import React, { useState } from 'react';
import { Scale, User, Calendar } from 'lucide-react';
import { useRawMaterialSubmit } from '../../hooks/useRawMaterialSubmit';
import { useNotification } from '../../hooks/useNotification';
import { useSuppliers } from '../../hooks/useSuppliers';

export default function RawMaterialEntry() {
  const [formData, setFormData] = useState({
    supplierId: '',
    weight: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { submit } = useRawMaterialSubmit();
  const { addNotification } = useNotification();
  const { data: suppliers, isLoading } = useSuppliers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.supplierId || !formData.weight) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await submit({
        supplierId: formData.supplierId,
        weight: parseFloat(formData.weight),
        date: formData.date
      });

      // Reset form
      setFormData({
        supplierId: '',
        weight: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading suppliers...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Raw Material Entry</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData(prev => ({ ...prev, supplierId: e.target.value }))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            >
              <option value="">Select Supplier</option>
              {suppliers?.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Scale className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              step="0.1"
              min="0"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter weight in kg"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Raw Material Entry'}
        </button>
      </form>
    </div>
  );
}