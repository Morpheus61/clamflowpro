import React, { useState } from 'react';
import { Scale, Calendar } from 'lucide-react';

interface ShellWeightData {
  weight: string;
  date: string;
  notes: string;
  location: string;
}

export default function ShellWeight() {
  const [formData, setFormData] = useState<ShellWeightData>({
    weight: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Shell weight data:', formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Shell Weight Entry</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shell Weight (kg)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Scale className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
              required
              step="0.1"
              placeholder="Enter shell weight"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Storage Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter storage location"
          />
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Add any notes about the shell weight..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Record Shell Weight
        </button>
      </form>
    </div>
  );
}