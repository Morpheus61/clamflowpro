import React from 'react';
import { Shell, Fish } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';
import { BoxEntry } from '../../../types/processing';

interface BoxEntryFormProps {
  box: BoxEntry;
  onUpdate: (id: string, field: keyof BoxEntry, value: string) => void;
  onRemove: (id: string) => void;
}

export default function BoxEntryForm({ box, onUpdate, onRemove }: BoxEntryFormProps) {
  const grades = useLiveQuery(
    () => db.productGrades.where('productType').equals(box.type).toArray(),
    [box.type]
  );

  return (
    <div className={`mb-4 p-4 rounded-lg border ${
      box.type === 'shell-on' ? 'border-green-200' : 'border-red-200'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          {box.type === 'shell-on' ? (
            <Shell className="h-5 w-5 text-green-600" />
          ) : (
            <Fish className="h-5 w-5 text-red-600" />
          )}
          <span className="font-medium">
            {box.type === 'shell-on' ? 'Shell-on Box' : 'Meat Box'}
          </span>
          <span className="text-sm text-gray-500">#{box.boxNumber}</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(box.id)}
          className="text-gray-400 hover:text-red-500"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            value={box.weight}
            onChange={(e) => onUpdate(box.id, 'weight', e.target.value)}
            step="0.1"
            min="0"
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade
          </label>
          <select
            value={box.grade}
            onChange={(e) => onUpdate(box.id, 'grade', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Grade</option>
            {grades?.map(grade => (
              <option key={grade.id} value={grade.code}>
                Grade {grade.code} - {grade.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}