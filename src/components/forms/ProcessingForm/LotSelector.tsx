import React from 'react';
import { Package } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';
import { format } from 'date-fns';

interface LotSelectorProps {
  selectedLot: string;
  onLotSelect: (lotNumber: string) => void;
}

export default function LotSelector({ selectedLot, onLotSelect }: LotSelectorProps) {
  // Fetch only pending lots (those created in Raw Material Management but not yet processed)
  const lots = useLiveQuery(async () => {
    try {
      // Get lots with 'pending' status
      const pendingLots = await db.lots
        .where('status')
        .equals('pending')
        .toArray();

      // Get raw materials for these lots
      const rawMaterials = await db.rawMaterials
        .where('status')
        .equals('assigned')
        .toArray();

      // Get all suppliers for lookup
      const suppliers = await db.suppliers.toArray();
      const supplierMap = new Map(suppliers.map(s => [s.id, s.name]));

      // Process lot details
      const lotsWithDetails = pendingLots.map(lot => {
        const lotMaterials = rawMaterials.filter(rm => rm.lotNumber === lot.lotNumber);
        
        // Get unique suppliers for this lot
        const lotSuppliers = [...new Set(lotMaterials.map(rm => {
          const supplier = supplierMap.get(rm.supplierId);
          return supplier?.name || 'Unknown';
        }))];

        return {
          ...lot,
          suppliers: lotSuppliers,
          receiptCount: lotMaterials.length
        };
      });

      // Sort by creation date, newest first
      return lotsWithDetails.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching lots:', error);
      return [];
    }
  }, []);

  if (!lots) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg h-10"></div>
    );
  }

  if (lots.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Package className="h-5 w-5 text-yellow-600" />
          <div>
            <h3 className="font-medium text-yellow-800">No Lots Available</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Create new lots in Raw Material Management first. They will appear here once ready for processing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Lot for Processing
      </label>
      <select
        value={selectedLot}
        onChange={(e) => onLotSelect(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        required
      >
        <option value="">Select a lot</option>
        {lots.map(lot => (
          <option key={lot.lotNumber} value={lot.lotNumber}>
            Lot {lot.lotNumber} - {lot.totalWeight.toFixed(1)} kg from {lot.suppliers.join(', ')} 
            ({format(new Date(lot.createdAt), 'dd MMM yyyy')})
          </option>
        ))}
      </select>
      {selectedLot && lots.find(l => l.lotNumber === selectedLot) && (
        <div className="mt-2 text-sm text-gray-600">
          <p>Selected lot contains {lots.find(l => l.lotNumber === selectedLot)?.receiptCount} receipt(s)</p>
          <p className="mt-1">Total weight: {lots.find(l => l.lotNumber === selectedLot)?.totalWeight.toFixed(1)} kg</p>
        </div>
      )}
    </div>
  );
}