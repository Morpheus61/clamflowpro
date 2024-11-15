import React, { useState } from 'react';
import { Scale, User, Calendar } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import { db } from '../../db';
import { format } from 'date-fns';

interface PurchaseOrderFormProps {
  onSuccess: () => void;
}

export default function PurchaseOrderForm({ onSuccess }: PurchaseOrderFormProps) {
  const [formData, setFormData] = useState({
    supplierId: '',
    weight: '',
    pricePerKg: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  const { addNotification } = useNotification();
  const suppliers = useLiveQuery(() => db.suppliers.toArray());

  const generatePONumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PO${year}${month}${day}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.supplierId || !formData.weight || !formData.pricePerKg) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      const poNumber = generatePONumber();
      const totalAmount = parseFloat(formData.weight) * parseFloat(formData.pricePerKg);

      // Create purchase order
      await db.transaction('rw', [db.purchaseOrders, db.rawMaterials], async () => {
        const orderId = await db.purchaseOrders.add({
          poNumber,
          supplierId: parseInt(formData.supplierId),
          date: new Date(formData.date),
          weight: parseFloat(formData.weight),
          pricePerKg: parseFloat(formData.pricePerKg),
          totalAmount,
          status: 'pending',
          createdAt: new Date()
        });

        // Create raw material entry
        await db.rawMaterials.add({
          supplierId: parseInt(formData.supplierId),
          purchaseOrderId: orderId,
          weight: parseFloat(formData.weight),
          date: new Date(formData.date),
          status: 'pending',
          lotNumber: null
        });
      });

      addNotification('success', `Purchase Order ${poNumber} created successfully`);
      onSuccess();
    } catch (error) {
      console.error('Error creating purchase order:', error);
      addNotification('error', 'Error creating purchase order');
    }
  };

  if (!suppliers) {
    return <div>Loading suppliers...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Purchase Order</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData(prev => ({ ...prev, supplierId: e.target.value }))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} - {supplier.licenseNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Scale className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                step="0.1"
                min="0"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per kg
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <span className="text-gray-400">$</span>
              </div>
              <input
                type="number"
                value={formData.pricePerKg}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerKg: e.target.value }))}
                step="0.01"
                min="0"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>

        {formData.weight && formData.pricePerKg && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-600">Total Amount:</span>
              <span className="text-lg font-semibold text-blue-900">
                ${(parseFloat(formData.weight) * parseFloat(formData.pricePerKg)).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Create Purchase Order
        </button>
      </form>
    </div>
  );
}