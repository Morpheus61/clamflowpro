import React, { useState } from 'react';
import { Scale, Shell, Fish, Plus, AlertTriangle } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import { collection, doc, getDoc, updateDoc, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { db } from '../../lib/firebase';

interface BoxEntry {
  id: string;
  type: 'shell-on' | 'meat';
  weight: string;
  boxNumber: string;
  grade: string;
}

interface ProcessingProps {
  lotNumber: string;
}

export default function Processing({ lotNumber }: ProcessingProps) {
  const [boxes, setBoxes] = useState<BoxEntry[]>([]);
  const [shellWeight, setShellWeight] = useState('');
  const { addNotification } = useNotification();

  // Get lot details including depuration status
  const { data: lot, isLoading } = useQuery({
    queryKey: ['lot', lotNumber],
    queryFn: async () => {
      const lotsRef = collection(db, 'lots');
      const q = query(lotsRef, where('lotNumber', '==', lotNumber));
      const snapshot = await getDoc(doc(lotsRef, lotNumber));
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() };
    }
  });

  // Check if depuration is completed
  const isDepurationCompleted = lot?.depurationData?.status === 'completed';

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

  const calculateTotalWeight = (type: 'shell-on' | 'meat') => {
    return boxes
      .filter(box => box.type === type)
      .reduce((sum, box) => sum + (parseFloat(box.weight) || 0), 0);
  };

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

      // Create processing batch
      await addDoc(collection(db, 'processingBatches'), {
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
        yieldPercentage: ((shellOnTotal + meatTotal) / (lot?.totalWeight || 1)) * 100,
        createdAt: new Date()
      });

      // Update lot status
      const lotRef = doc(db, 'lots', lot!.id);
      await updateDoc(lotRef, {
        status: 'processing',
        updatedAt: new Date()
      });

      addNotification('success', 'Processing data saved successfully');
      setBoxes([]);
      setShellWeight('');
    } catch (error) {
      console.error('Error saving processing data:', error);
      addNotification('error', 'Error saving processing data');
    }
  };

  if (isLoading) {
    return <div>Loading lot details...</div>;
  }

  if (!lot) {
    return <div>Lot not found</div>;
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
            <BoxEntry
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

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Processing Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Shell-on Total</div>
              <div className="text-xl font-medium">{calculateTotalWeight('shell-on').toFixed(1)} kg</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Meat Total</div>
              <div className="text-xl font-medium">{calculateTotalWeight('meat').toFixed(1)} kg</div>
            </div>
          </div>
        </div>

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

interface BoxEntryProps {
  box: BoxEntry;
  onUpdate: (id: string, field: keyof BoxEntry, value: string) => void;
  onRemove: (id: string) => void;
}

function BoxEntry({ box, onUpdate, onRemove }: BoxEntryProps) {
  const { data: grades } = useQuery({
    queryKey: ['grades', box.type],
    queryFn: async () => {
      const gradesRef = collection(db, 'productGrades');
      const q = query(gradesRef, where('productType', '==', box.type));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  });

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