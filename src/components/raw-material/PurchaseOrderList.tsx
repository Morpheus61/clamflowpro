import React from 'react';
import { format } from 'date-fns';
import { FileText, User, DollarSign } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';

export default function PurchaseOrderList() {
  const purchaseOrders = useLiveQuery(async () => {
    const orders = await db.purchaseOrders.orderBy('date').reverse().toArray();
    const suppliers = await db.suppliers.toArray();
    const supplierMap = new Map(suppliers.map(s => [s.id, s.name]));

    return orders.map(order => ({
      ...order,
      supplierName: supplierMap.get(order.supplierId) || 'Unknown Supplier'
    }));
  });

  if (!purchaseOrders) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-[200px]"></div>
            <div className="h-4 bg-gray-200 rounded w-[150px]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {purchaseOrders.map(order => (
        <div
          key={order.id}
          className="bg-white rounded-lg shadow-sm p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-gray-900">{order.poNumber}</span>
              </div>
              <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>{order.supplierName}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-gray-900">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {format(new Date(order.date), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {order.weight} kg @ ${order.pricePerKg}/kg
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              order.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : order.status === 'cancelled'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
      ))}

      {purchaseOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No purchase orders found
        </div>
      )}
    </div>
  );
}