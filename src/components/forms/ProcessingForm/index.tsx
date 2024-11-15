import React, { useState } from 'react';
import { Shell, Fish } from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import { db } from '../../../db';
import { generateBoxNumber } from '../../../utils/generators';
import BoxEntry from './BoxEntry';
import ProcessingSummary from './ProcessingSummary';
import { useLiveQuery } from 'dexie-react-hooks';

interface BoxEntry {
  id: string;
  type: 'shell-on' | 'meat';
  weight: string;
  boxNumber: string;
  grade: string;
}

interface ProcessingFormProps {
  lotNumber: string;
  onSuccess?: () => void;
}

export default function ProcessingForm({ lotNumber, onSuccess }: ProcessingFormProps) {
  const [boxes, setBoxes] = useState<BoxEntry[]>([]);
  const { addNotification } = useNotification();

  // Get lot details including depuration status
  const lot = useLiveQuery(
    async () => {
      const foundLot = await db.lots.where('lotNumber').equals(lotNumber).first();
      if (!foundLot) return null;

      // Verify depuration is completed
      if (!foundLot.depurationData?.completedAt) {
        throw new Error('Depuration must be completed before processing');
      }

      return foundLot;
    },
    [lotNumber]
  );

  const addBox = (type: 'shell-on' | 'meat') => {
    const newBox: BoxEntry = {
      id: crypto.randomUUID(),
      type,
      weight: '',
      boxNumber: generateBoxNumber(type),
      grade: ''
    };
    setBoxes([...boxes, newBox]);
  };

  const removeBox = (id: string) => {
    setBoxes(boxes.filter(box => box.id !== id));
  };

  const updateBox = (id: string, field: keyof BoxEntry, value: string) => {
    setBoxes(boxes.map(box => 
      box.id === id ? { ...box, [field]: value } : box
    ));
  };

  const calculateTotalWeight = (type: 'shell-on' | 'meat') => 
    boxes
      .filter(box => box.type === type)
      .reduce((sum, box) => sum + (parseFloat(box.weight) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lotNumber || boxes.length === 0) {
      addNotification('error', 'Please add at least one box');
      return;
    }

    if (!lot?.depurationData?.completedAt) {
      addNotification('error', 'Depuration must be completed before processing');
      return;
    }

    // Validate that all boxes have grades
    const missingGrades = boxes.some(box => !box.grade);
    if (missingGrades) {
      addNotification('error', 'Please assign grades to all products');
      return;
    }

    const shellOnTotal = calculateTotalWeight('shell-on');
    const meatTotal = calculateTotalWeight('meat');

    try {
      await db.transaction('rw', [db.processingBatches, db.lots], async () => {
        // Create processing batch
        await db.processingBatches.add({
          lotNumber,
          shellOnWeight: shellOnTotal,
          meatWeight: meatTotal,
          boxes: boxes.map(box => ({
            type: box.type,
            weight: parseFloat(box.weight),
            boxNumber: box.boxNumber,
            grade: box.grade
          })),
          date: new Date(),
          yieldPercentage: ((shellOnTotal + meatTotal) / (lot?.totalWeight || 1)) * 100,
          status: 'completed'
        });

        // Update lot status to processing
        await db.lots
          .where('lotNumber')
          .equals(lotNumber)
          .modify({ status: 'processing' });
      });

      addNotification('success', 'Processing data saved successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error saving processing data:', error);
      addNotification('error', 'Error saving processing data');
    }
  };

  if (!lot) {
    return <div>Loading lot details...</div>;
  }

  if (!lot.depurationData?.completedAt) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-yellow-800">
          <span>Depuration must be completed before processing this lot</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Process Products</h2>
            
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

          <div className="space-y-4">
            {boxes.map((box) => (
              <BoxEntry
                key={box.id}
                {...box}
                onWeightChange={(id, value) => updateBox(id, 'weight', value)}
                onGradeChange={(id, value) => updateBox(id, 'grade', value)}
                onRemove={removeBox}
              />
            ))}

            {boxes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Add boxes to start processing
              </div>
            )}
          </div>
        </div>

        {boxes.length > 0 && (
          <ProcessingSummary
            shellOnTotal={calculateTotalWeight('shell-on')}
            meatTotal={calculateTotalWeight('meat')}
            totalInput={lot.totalWeight}
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={boxes.length === 0}
        >
          Submit Processing Data
        </button>
      </form>
    </div>
  );
}