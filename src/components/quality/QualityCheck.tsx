import React, { useState } from 'react';
import { ClipboardCheck, Check, X } from 'lucide-react';

interface QualityCheckItem {
  id: string;
  label: string;
  passed: boolean | null;
}

export default function QualityCheck() {
  const [lotNumber, setLotNumber] = useState('');
  const [checkItems, setCheckItems] = useState<QualityCheckItem[]>([
    { id: '1', label: 'Visual Inspection', passed: null },
    { id: '2', label: 'Size Verification', passed: null },
    { id: '3', label: 'Shell Integrity', passed: null },
    { id: '4', label: 'Cleanliness Check', passed: null },
    { id: '5', label: 'Temperature Control', passed: null }
  ]);

  const handleCheck = (id: string, passed: boolean) => {
    setCheckItems(items =>
      items.map(item =>
        item.id === id ? { ...item, passed } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle quality check submission
    console.log('Quality check results:', { lotNumber, checkItems });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Quality Check Form</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lot Number
          </label>
          <input
            type="text"
            value={lotNumber}
            onChange={(e) => setLotNumber(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="space-y-4">
          {checkItems.map(item => (
            <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.label}</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleCheck(item.id, true)}
                    className={`p-2 rounded-full ${
                      item.passed === true
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheck(item.id, false)}
                    className={`p-2 rounded-full ${
                      item.passed === false
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          disabled={checkItems.some(item => item.passed === null)}
        >
          Submit Quality Check
        </button>
      </form>
    </div>
  );
}