import React, { useState } from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useNotification } from '../../hooks/useNotification';
import { format } from 'date-fns';

export default function LotCreation() {
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const { addNotification } = useNotification();

  // Fetch pending raw materials
  const { data: rawMaterials, isLoading } = useQuery({
    queryKey: ['rawMaterials', 'pending'],
    queryFn: async () => {
      const materialsRef = collection(db, 'rawMaterials');
      const q = query(materialsRef, where('status', '==', 'pending'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  });

  const handleCreateLot = async () => {
    if (selectedReceipts.length === 0) {
      addNotification('error', 'Please select at least one receipt');
      return;
    }

    try {
      const lotNumber = `L${format(new Date(), 'yyMMddHHmm')}`;
      const selectedMaterials = rawMaterials?.filter(m => 
        selectedReceipts.includes(m.id)
      ) || [];
      
      const totalWeight = selectedMaterials.reduce((sum, m) => 
        sum + (m.weight || 0), 0
      );

      // Create lot document
      await addDoc(collection(db, 'lots'), {
        lotNumber,
        totalWeight,
        notes: notes.trim() || null,
        status: 'pending',
        createdAt: new Date().toISOString(),
        receiptIds: selectedReceipts
      });

      // Update receipt statuses
      const batch = writeBatch(db);
      selectedReceipts.forEach(id => {
        const receiptRef = doc(db, 'rawMaterials', id);
        batch.update(receiptRef, { 
          status: 'assigned',
          lotNumber 
        });
      });
      await batch.commit();

      addNotification('success', `Lot ${lotNumber} created successfully`);
      setSelectedReceipts([]);
      setNotes('');
    } catch (error) {
      console.error('Error creating lot:', error);
      addNotification('error', 'Error creating lot');
    }
  };

  if (isLoading) {
    return <div>Loading raw materials...</div>;
  }

  if (!rawMaterials?.length) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <div>
            <h3 className="font-medium text-yellow-800">No Raw Materials Available</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Add raw materials first to create lots
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Lot</h2>
        
        <div className="space-y-4">
          {rawMaterials.map(material => (
            <div
              key={material.id}
              onClick={() => {
                setSelectedReceipts(prev =>
                  prev.includes(material.id)
                    ? prev.filter(id => id !== material.id)
                    : [...prev, material.id]
                );
              }}
              className={`p-4 rounded-lg border-2 cursor-pointer ${
                selectedReceipts.includes(material.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{material.supplierName}</div>
                  <div className="text-sm text-gray-500">{material.weight} kg</div>
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(material.date), 'dd MMM yyyy')}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Add any relevant notes about this lot..."
          />
        </div>

        <button
          onClick={handleCreateLot}
          disabled={selectedReceipts.length === 0}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Lot
        </button>
      </div>
    </div>
  );
}