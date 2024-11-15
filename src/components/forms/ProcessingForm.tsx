import React, { useState } from 'react';
import { Scale, Shell, Fish, Plus, Trash2 } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import { db } from '../../db';

interface BoxEntry {
  id: string;
  type: 'shell-on' | 'meat';
  weight: string;
  boxNumber: string;
}

interface ProcessingFormProps {
  onSuccess: () => void;
}

export default function ProcessingForm({ onSuccess }: ProcessingFormProps) {
  const [lotId, setLotId] = useState('');
  const [boxes, setBoxes] = useState<BoxEntry[]>([]);
  const [shellWeight, setShellWeight] = useState('');
  const { addNotification } = useNotification();

  const addBox = (type: 'shell-on' | 'meat') => {
    const newBox: BoxEntry = {
      id: crypto.randomUUID(),
      type,
      weight: '',
      boxNumber: `${type === 'shell-on' ? 'SO' : 'CM'}${String(boxes.length + 1).padStart(6, '0')}`
    };
    setBoxes([...boxes, newBox]);
  };

  const removeBox = (id: string) => {
    setBoxes(boxes.filter(box => box.id !== id));
  };

  const updateBoxWeight = (id: string, weight: string) => {
    setBoxes(boxes.map(box => 
      box.id === id ? { ...box, weight } : box
    ));
  };

  const calculateTotalWeight = (type: 'shell-on' | 'meat') => 
    boxes
      .filter(box => box.type === type)
      .reduce((sum, box) => sum + (parseFloat(box.weight) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lotId || boxes.length === 0 || !shellWeight) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    const shellOnTotal = calculateTotalWeight('shell-on');
    const meatTotal = calculateTotalWeight('meat');
    const shellWeightNum = parseFloat(shellWeight);

    try {
      await db.processingBatches.add({
        lotNumber: lotId,
        shellOnWeight: shellOnTotal,
        meatWeight: meatTotal,
        shellWeight: shellWeightNum,
        boxes: boxes.map(box => ({
          type: box.type,
          weight: parseFloat(box.weight),
          boxNumber: box.boxNumber
        })),
        date: new Date(),
        yieldPercentage: ((meatTotal + shellOnTotal) / (meatTotal + shellOnTotal + shellWeightNum)) * 100
      });

      addNotification('success', 'Processing data saved successfully');
      onSuccess();
    } catch (error) {
      addNotification('error', 'Error saving processing data');
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Processing Data Entry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Lot
          </label>
          <select
            value={lotId}
            onChange={(e) => setLotId(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a lot number</option>
            <option value="L001">L001 - Pending Processing</option>
            <option value="L002">L002 - Pending Processing</option>
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Product Boxes</h3>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => addBox('shell-on')}
                className="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
              >
                <Shell className="h-4 w-4" />
                <span>Add Shell-on</span>
              </button>
              <button
                type="button"
                onClick={() => addBox('meat')}
                className="flex items-center space-x-2 px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <Fish className="h-4 w-4" />
                <span>Add Meat</span>
              </button>
            </div>
          </div>

          {boxes.map((box) => (
            <div key={box.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {box.type === 'shell-on' ? (
                    <Shell className="h-4 w-4 text-green-600" />
                  ) : (
                    <Fish className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium">
                    {box.type === 'shell-on' ? 'Shell-on Clams' : 'Clam Meat'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">Box #{box.boxNumber}</div>
              </div>
              <div className="w-48">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Scale className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={box.weight}
                    onChange={(e) => updateBoxWeight(box.id, e.target.value)}
                    step="0.1"
                    min="0"
                    className="block w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Weight (kg)"
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeBox(box.id)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
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
              value={shellWeight}
              onChange={(e) => setShellWeight(e.target.value)}
              step="0.1"
              min="0"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter shell weight"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">Shell-on Total</div>
            <div className="text-lg font-medium">{calculateTotalWeight('shell-on').toFixed(1)} kg</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Meat Total</div>
            <div className="text-lg font-medium">{calculateTotalWeight('meat').toFixed(1)} kg</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Shell Weight</div>
            <div className="text-lg font-medium">{parseFloat(shellWeight || '0').toFixed(1)} kg</div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Processing Data
        </button>
      </form>
    </div>
  );
}