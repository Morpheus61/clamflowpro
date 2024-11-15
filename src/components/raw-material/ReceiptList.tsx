import React from 'react';
import { format } from 'date-fns';
import { User, Scale, Check, X } from 'lucide-react';

interface Receipt {
  id: string;
  supplierId: string;
  supplierName: string;
  weight: number;
  photoUrl: string;
  date: Date;
  isSelected?: boolean;
}

interface ReceiptListProps {
  receipts: Receipt[];
  selectedReceipts: string[];
  onSelectReceipt: (id: string) => void;
}

export default function ReceiptList({ receipts, selectedReceipts, onSelectReceipt }: ReceiptListProps) {
  // Group receipts by date
  const groupedReceipts = receipts.reduce((acc, receipt) => {
    const date = format(new Date(receipt.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(receipt);
    return acc;
  }, {} as Record<string, Receipt[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedReceipts)
        .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
        .map(([date, dayReceipts]) => (
          <div key={date} className="bg-white rounded-lg shadow">
            <div className="px-4 py-3 bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-semibold">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h3>
              <p className="text-sm text-gray-600">
                Total: {dayReceipts.reduce((sum, r) => sum + r.weight, 0).toFixed(1)} kg
                from {new Set(dayReceipts.map(r => r.supplierName)).size} suppliers
              </p>
            </div>
            
            <div className="divide-y">
              {dayReceipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className={`flex items-center p-4 hover:bg-gray-50 ${
                    selectedReceipts.includes(receipt.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <button
                    onClick={() => onSelectReceipt(receipt.id)}
                    className={`p-2 rounded-full mr-4 ${
                      selectedReceipts.includes(receipt.id)
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {selectedReceipts.includes(receipt.id) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{receipt.supplierName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <Scale className="h-4 w-4" />
                      <span>{receipt.weight} kg</span>
                      <span>•</span>
                      <span>{format(new Date(receipt.date), 'HH:mm')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(receipt.photoUrl, '_blank')}
                    className="ml-4 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    View Photo
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}