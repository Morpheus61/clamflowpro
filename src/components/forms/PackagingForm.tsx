import React, { useState } from 'react';
import { Package, Scale, QrCode, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { useNotification } from '../../hooks/useNotification';
import { db } from '../../db';
import { useLiveQuery } from 'dexie-react-hooks';

interface PackagingFormProps {
  onSuccess: () => void;
}

export default function PackagingForm({ onSuccess }: PackagingFormProps) {
  const [lotNumber, setLotNumber] = useState('');
  const [productType, setProductType] = useState<'shell-on' | 'meat'>('shell-on');
  const [boxNumber, setBoxNumber] = useState('');
  const [weight, setWeight] = useState('');
  const [qrData, setQrData] = useState<string | null>(null);
  const { addNotification } = useNotification();

  // Fetch lots that have been processed
  const processedLots = useLiveQuery(async () => {
    const lots = await db.lots
      .where('status')
      .equals('processing')
      .toArray();

    const lotsWithProcessing = await Promise.all(
      lots.map(async lot => {
        const processingBatch = await db.processingBatches
          .where('lotNumber')
          .equals(lot.lotNumber)
          .first();

        return {
          lotNumber: lot.lotNumber,
          totalWeight: lot.totalWeight,
          processedWeight: processingBatch ? 
            (processingBatch.shellOnWeight + processingBatch.meatWeight) : 0
        };
      })
    );

    return lotsWithProcessing;
  });

  // Auto-generate box number when product type or lot changes
  React.useEffect(() => {
    if (!lotNumber) return;
    const generateBoxNumber = () => {
      const date = format(new Date(), 'yyMMdd');
      const prefix = productType === 'shell-on' ? 'SO' : 'CM';
      const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setBoxNumber(`${prefix}${date}${sequence}`);
    };
    generateBoxNumber();
  }, [productType, lotNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lotNumber || !boxNumber || !weight) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      await db.packages.add({
        lotNumber,
        type: productType,
        boxNumber,
        weight: parseFloat(weight),
        qrCode: qrData || '',
        date: new Date()
      });

      addNotification('success', 'Package details saved successfully');
      onSuccess();
    } catch (error) {
      addNotification('error', 'Error saving package details');
      console.error('Error:', error);
    }
  };

  if (!processedLots) {
    return <div className="text-center py-4">Loading available lots...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Packaging Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Lot
          </label>
          <select
            value={lotNumber}
            onChange={(e) => setLotNumber(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a lot number</option>
            {processedLots.map(lot => (
              <option key={lot.lotNumber} value={lot.lotNumber}>
                {lot.lotNumber} - {lot.processedWeight.toFixed(1)} kg processed
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Type
          </label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value as 'shell-on' | 'meat')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="shell-on">Shell-on Clams</option>
            <option value="meat">Clam Meat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Box Number (Auto-generated)
          </label>
          <input
            type="text"
            value={boxNumber}
            readOnly
            className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            step="0.1"
            min="0"
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter weight"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Package Details
        </button>
      </form>
    </div>
  );
}