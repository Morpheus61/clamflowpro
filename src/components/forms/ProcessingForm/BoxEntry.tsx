import React from 'react';
import { Scale, Shell, Fish, Trash2, Tag, QrCode } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';
import { generateBoxNumber } from '../../../utils/generators';
import QRCode from 'qrcode.react';

interface BoxEntryProps {
  id: string;
  type: 'shell-on' | 'meat';
  weight: string;
  boxNumber: string;
  grade: string;
  onWeightChange: (id: string, weight: string) => void;
  onGradeChange: (id: string, grade: string) => void;
  onRemove: (id: string) => void;
}

export default function BoxEntry({
  id,
  type,
  weight,
  boxNumber,
  grade,
  onWeightChange,
  onGradeChange,
  onRemove
}: BoxEntryProps) {
  const [showQR, setShowQR] = React.useState(false);
  const grades = useLiveQuery(
    () => db.productGrades.where('productType').equals(type).toArray(),
    [type]
  );

  const qrData = {
    boxNumber,
    type,
    weight,
    grade,
    processedAt: new Date().toISOString()
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${
      type === 'shell-on' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {type === 'shell-on' ? (
            <Shell className="h-5 w-5 text-green-600" />
          ) : (
            <Fish className="h-5 w-5 text-red-600" />
          )}
          <span className="text-lg font-medium">
            {type === 'shell-on' ? 'Shell-on Clams' : 'Clam Meat'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">Box #{boxNumber}</div>
          <button
            type="button"
            onClick={() => setShowQR(!showQR)}
            className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100"
          >
            <QrCode className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(id)}
            className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Scale className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={weight}
              onChange={(e) => onWeightChange(id, e.target.value)}
              step="0.1"
              min="0"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter weight"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={grade}
              onChange={(e) => onGradeChange(id, e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Grade</option>
              {grades?.map(g => (
                <option key={g.id} value={g.code}>
                  Grade {g.code} - {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showQR && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col items-center">
            <QRCode value={JSON.stringify(qrData)} size={150} level="H" />
            <div className="mt-2 text-sm text-gray-600">
              Scan to track box between locations
            </div>
          </div>
        </div>
      )}
    </div>
  );
}