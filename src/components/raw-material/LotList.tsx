import React from 'react';
import { format } from 'date-fns';
import { Package, ChevronDown, ChevronUp, Scale, User } from 'lucide-react';

interface LotListProps {
  lots: Array<{
    lotNumber: string;
    totalWeight: number;
    status: string;
    createdAt: Date;
    notes?: string;
    receipts: Array<{
      supplierName: string;
      weight: number;
      date: Date;
    }>;
  }>;
}

export default function LotList({ lots }: LotListProps) {
  const [expandedLots, setExpandedLots] = React.useState<string[]>([]);

  const toggleLot = (lotNumber: string) => {
    setExpandedLots(prev =>
      prev.includes(lotNumber)
        ? prev.filter(ln => ln !== lotNumber)
        : [...prev, lotNumber]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {lots.map((lot) => (
        <div key={lot.lotNumber} className="bg-white rounded-lg shadow">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleLot(lot.lotNumber)}
          >
            <div className="flex items-center space-x-4">
              <Package className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Lot #{lot.lotNumber}
                </h3>
                <p className="text-sm text-gray-500">
                  Created on {format(new Date(lot.createdAt), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lot.status)}`}>
                {lot.status.charAt(0).toUpperCase() + lot.status.slice(1)}
              </span>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {lot.totalWeight.toFixed(1)} kg
                </div>
                <div className="text-sm text-gray-500">
                  {lot.receipts.length} receipts
                </div>
              </div>
              {expandedLots.includes(lot.lotNumber) ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>

          {expandedLots.includes(lot.lotNumber) && (
            <div className="border-t border-gray-200 px-4 py-3">
              {lot.notes && (
                <div className="mb-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <span className="font-medium">Notes:</span> {lot.notes}
                </div>
              )}
              <div className="space-y-2">
                {lot.receipts.map((receipt, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{receipt.supplierName}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Scale className="h-4 w-4" />
                        <span>{receipt.weight} kg</span>
                      </div>
                      <span className="text-gray-500">
                        {format(new Date(receipt.date), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}