import React, { useState } from 'react';
import { Package, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNotification } from '../../hooks/useNotification';
import { db } from '../../db';

interface LotCreatorProps {
  selectedReceipts: {
    id: string;
    weight: number;
    supplierName: string;
  }[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function LotCreator({ selectedReceipts, onSuccess, onCancel }: LotCreatorProps) {
  const [notes, setNotes] = useState('');
  const { addNotification } = useNotification();

  const totalWeight = selectedReceipts.reduce((sum, r) => sum + r.weight, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Generate lot number in format L + YYMMDDHHmm
      const lotNumber = `L${format(new Date(), 'yyMMddHHmm')}`;
      
      // Create the lot
      await db.lots.add({
        lotNumber,
        receiptIds: selectedReceipts.map(r => r.id),
        totalWeight,
        notes,
        status: 'pending',
        createdAt: new Date()
      });

      // Update receipt statuses
      await Promise.all(
        selectedReceipts.map(receipt =>
          db.rawMaterials
            .where('id')
            .equals(receipt.id)
            .modify({ lotNumber, status: 'assigned' })
        )
      );

      addNotification('success', `Lot ${lotNumber} created successfully`);
      onSuccess();
    } catch (error) {
      addNotification('error', 'Error creating lot');
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Create New Lot</h2>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                Creating a lot from {selectedReceipts.length} receipts:
              </p>
              <ul className="mt-2 text-sm text-blue-600 space-y-1">
                {selectedReceipts.map(receipt => (
                  <li key={receipt.id}>
                    • {receipt.supplierName} - {receipt.weight} kg
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-medium text-blue-800">
                Total Weight: {totalWeight.toFixed(1)} kg
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any relevant notes about this lot..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Package className="h-5 w-5" />
              <span>Create Lot</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}