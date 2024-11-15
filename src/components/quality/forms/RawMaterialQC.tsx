import React, { useState } from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import { db } from '../../../db';

interface RawMaterialQCProps {
  lotNumber: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  passed: boolean | null;
  notes: string;
}

export default function RawMaterialQC({ lotNumber }: RawMaterialQCProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', label: 'Visual Inspection - No visible contamination', passed: null, notes: '' },
    { id: '2', label: 'Temperature Check - Within acceptable range', passed: null, notes: '' },
    { id: '3', label: 'Weight Verification - Matches documentation', passed: null, notes: '' },
    { id: '4', label: 'Supplier Documentation Complete', passed: null, notes: '' },
    { id: '5', label: 'Transport Conditions Met', passed: null, notes: '' }
  ]);

  const { addNotification } = useNotification();

  const handleCheck = (id: string, passed: boolean) => {
    setChecklist(items =>
      items.map(item =>
        item.id === id ? { ...item, passed } : item
      )
    );
  };

  const handleNotes = (id: string, notes: string) => {
    setChecklist(items =>
      items.map(item =>
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checklist.some(item => item.passed === null)) {
      addNotification('error', 'Please complete all quality checks');
      return;
    }

    try {
      await db.transaction('rw', [db.lots], async () => {
        const lot = await db.lots.where('lotNumber').equals(lotNumber).first();
        if (!lot) throw new Error('Lot not found');

        // Update lot with QC results
        await db.lots.update(lot.id!, {
          rawMaterialQC: {
            checklist,
            completedAt: new Date(),
            passed: checklist.every(item => item.passed)
          }
        });
      });

      addNotification('success', 'Raw material quality control completed');
    } catch (error) {
      console.error('Error saving QC results:', error);
      addNotification('error', 'Error saving quality control results');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {checklist.map((item) => (
          <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
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
            <textarea
              value={item.notes}
              onChange={(e) => handleNotes(item.id, e.target.value)}
              placeholder="Add notes (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              rows={2}
            />
          </div>
        ))}
      </div>

      {checklist.some(item => item.passed === false) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Some checks have failed. Add detailed notes for failed items.</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Submit Quality Control Results
      </button>
    </form>
  );
}