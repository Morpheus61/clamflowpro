import React from 'react';
import { Scale, Shell, Fish } from 'lucide-react';
import BoxEntryForm from './BoxEntryForm';
import { BoxEntry } from '../../../types/processing';
import { Lot } from '../../../types';

interface ProcessingFormProps {
  lotNumber: string;
  lot: Lot;
  boxes: BoxEntry[];
  setBoxes: React.Dispatch<React.SetStateAction<BoxEntry[]>>;
  shellWeight: string;
  setShellWeight: (weight: string) => void;
}

export default function ProcessingForm({
  lotNumber,
  lot,
  boxes,
  setBoxes,
  shellWeight,
  setShellWeight
}: ProcessingFormProps) {
  const generateBoxNumber = (type: 'shell-on' | 'meat') => {
    const prefix = type === 'shell-on' ? 'SO' : 'CM';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  const addBox = (type: 'shell-on' | 'meat') => {
    const newBox: BoxEntry = {
      id: crypto.randomUUID(),
      type,
      weight: '',
      boxNumber: generateBoxNumber(type),
      grade: ''
    };
    setBoxes(prev => [...prev, newBox]);
  };

  const removeBox = (id: string) => {
    setBoxes(prev => prev.filter(box => box.id !== id));
  };

  const updateBox = (id: string, field: keyof BoxEntry, value: string) => {
    setBoxes(prev => prev.map(box =>
      box.id === id ? { ...box, [field]: value } : box
    ));
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Process Products</h2>
            <p className="text-sm text-gray-600 mt-1">
              Lot {lotNumber} - Total Weight: {lot.totalWeight.toFixed(1)} kg
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => addBox('shell-on')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
            >
              <Shell className="h-5 w-5" />
              <span>Add Shell-on</span>
            </button>
            <button
              type="button"
              onClick={() => addBox('meat')}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            >
              <Fish className="h-5 w-5" />
              <span>Add Meat</span>
            </button>
          </div>
        </div>

        {boxes.map((box) => (
          <BoxEntryForm
            key={box.id}
            box={box}
            onUpdate={updateBox}
            onRemove={removeBox}
          />
        ))}

        {boxes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Add boxes to start processing
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Scale className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Shell Weight</h3>
        </div>
        <div className="max-w-xs">
          <input
            type="number"
            value={shellWeight}
            onChange={(e) => setShellWeight(e.target.value)}
            step="0.1"
            min="0"
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter shell weight (kg)"
            required
          />
        </div>
      </div>
    </>
  );
}