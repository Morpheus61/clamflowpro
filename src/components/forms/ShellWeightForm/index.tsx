import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import { db } from '../../../db';
import { format } from 'date-fns';
import ShellWeightList from './ShellWeightList';

export default function ShellWeightForm() {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState('');
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight || !date) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      await db.shellWeights.add({
        weight: parseFloat(weight),
        date: new Date(date),
        createdAt: new Date(),
        notes: notes.trim() || undefined
      });

      addNotification('success', 'Shell weight recorded successfully');
      setWeight('');
      setNotes('');
    } catch (error) {
      addNotification('error', 'Error recording shell weight');
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Scale className="h-6 w-6 text-amber-600" />
          <h2 className="text-xl font-semibold text-gray-900">Shell Weight Entry</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shell Weight (kg)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Scale className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                step="0.1"
                min="0"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter shell weight"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="Add any relevant notes..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Record Shell Weight
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Records</h3>
        <ShellWeightList />
      </div>
    </div>
  );
}