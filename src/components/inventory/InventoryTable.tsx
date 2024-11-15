import React from 'react';
import { Package, Check } from 'lucide-react';

interface InventoryTableProps {
  inventory: any[];
  isLoading: boolean;
  selectedBoxes: string[];
  onSelectBox: (boxId: string) => void;
}

export default function InventoryTable({
  inventory,
  isLoading,
  selectedBoxes,
  onSelectBox
}: InventoryTableProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading inventory...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 px-6 py-3 text-left">
              <span className="sr-only">Select</span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Box Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lot Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Weight (kg)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Packing Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inventory.map((item) => (
            <tr 
              key={item.id}
              className={selectedBoxes.includes(item.id) ? 'bg-blue-50' : ''}
            >
              <td className="px-6 py-4">
                <button
                  onClick={() => onSelectBox(item.id)}
                  className={`p-2 rounded-full ${
                    selectedBoxes.includes(item.id)
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Check className="h-4 w-4" />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.boxNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.lotNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  {item.productType === 'shell-on' ? 'Shell-on Clams' : 'Clam Meat'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.weight}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(item.packingDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  In Stock
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}