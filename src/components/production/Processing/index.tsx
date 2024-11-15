import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import { db } from '../../../db';
import { useLiveQuery } from 'dexie-react-hooks';
import ProcessingForm from './ProcessingForm';
import ProcessingSummary from './ProcessingSummary';
import { BoxEntry } from '../../../types/processing';

interface ProcessingProps {
  lotNumber: string;
}

export default function Processing({ lotNumber }: ProcessingProps) {
  const [boxes, setBoxes] = useState<BoxEntry[]>([]);
  const [shellWeight, setShellWeight] = useState('');
  const { addNotification } = useNotification();

  // Get lot details including depuration status
  const lot = useLiveQuery(async () => {
    if (!lotNumber) return null;
    return await db.lots.where('lotNumber').equals(lotNumber).first();
  }, [lotNumber]);

  // Check if depuration is completed
  const isDepurationCompleted = lot?.depurationData?.status === 'completed';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isDepurationCompleted) {
      addNotification('error', 'Depuration must be completed before processing');
      return;
    }

    if (boxes.length === 0) {
      addNotification('error', 'Please add at least one box');
      return;
    }

    // Validate that all boxes have weights and grades
    const invalidBoxes = boxes.some(box => !box.weight || !box.grade);
    if (invalidBoxes) {
      addNotification('error', 'Please fill in all box weights and grades');
      return;
    }

    try {
      const shellOnTotal = calculateTotalWeight('shell-on');
      const meatTotal = calculateTotalWeight('meat');
      const shellWeightNum = parseFloat(shellWeight);

      if (!shellWeightNum) {
        addNotification('error', 'Please enter shell weight');
        return;
      }

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
          status: 'completed',
          yieldPercentage: ((shellOnTotal + meatTotal) / (lot?.totalWeight || 1)) * 100
        });

        // Update lot status to processing
        await db.lots
          .where('lotNumber')
          .equals(lotNumber)
          .modify({ status: 'processing' });
      });

      addNotification('success', 'Processing data saved successfully');
      setBoxes([]);
      setShellWeight('');
    } catch (error) {
      console.error('Error saving processing data:', error);
      addNotification('error', 'Error saving processing data');
    }
  };

  const calculateTotalWeight = (type: 'shell-on' | 'meat') => {
    return boxes
      .filter(box => box.type === type)
      .reduce((sum, box) => sum + (parseFloat(box.weight) || 0), 0);
  };

  if (!lot) {
    return <div>Loading lot details...</div>;
  }

  if (!isDepurationCompleted) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <div>
            <h3 className="font-medium text-yellow-800">Depuration Required</h3>
            <p className="text-sm text-yellow-700 mt-1">
              This lot must complete the depuration process before processing can begin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProcessingForm
          lotNumber={lotNumber}
          lot={lot}
          boxes={boxes}
          setBoxes={setBoxes}
          shellWeight={shellWeight}
          setShellWeight={setShellWeight}
        />
        
        <ProcessingSummary
          shellOnTotal={calculateTotalWeight('shell-on')}
          meatTotal={calculateTotalWeight('meat')}
          shellWeight={parseFloat(shellWeight) || 0}
          totalInput={lot.totalWeight}
        />

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