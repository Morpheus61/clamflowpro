import React, { useState } from 'react';
import { Scale, User, Calendar, Camera } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import { db } from '../../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';

interface RawMaterialFormProps {
  onSuccess: () => void;
}

export default function RawMaterialForm({ onSuccess }: RawMaterialFormProps) {
  const [formData, setFormData] = useState({
    supplierId: '',
    weight: '',
    pricePerKg: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { addNotification } = useNotification();
  const suppliers = useLiveQuery(() => db.suppliers.toArray());

  const generatePONumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const time = format(date, 'HHmm');
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `PO${year}${month}${day}${time}${random}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.supplierId || !formData.weight || !photo) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      const poNumber = generatePONumber();
      const totalAmount = parseFloat(formData.weight) * parseFloat(formData.pricePerKg || '0');

      await db.transaction('rw', [db.purchaseOrders, db.rawMaterials], async () => {
        // Create purchase order
        const orderId = await db.purchaseOrders.add({
          poNumber,
          supplierId: parseInt(formData.supplierId),
          date: new Date(formData.date),
          weight: parseFloat(formData.weight),
          pricePerKg: parseFloat(formData.pricePerKg || '0'),
          totalAmount,
          status: 'pending',
          createdAt: new Date()
        });

        // Create raw material entry
        await db.rawMaterials.add({
          supplierId: parseInt(formData.supplierId),
          purchaseOrderId: orderId,
          weight: parseFloat(formData.weight),
          photoUrl: photo,
          date: new Date(formData.date),
          status: 'pending',
          lotNumber: null
        });
      });

      addNotification('success', `Raw material entry created with PO: ${poNumber}`);
      onSuccess();
    } catch (error) {
      console.error('Error creating raw material entry:', error);
      addNotification('error', 'Error creating raw material entry');
    }
  };

  if (!suppliers) {
    return <div>Loading suppliers...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Raw Material Entry</h2>

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
              Price per kg (Optional)
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight Photo
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {photo ? (
            <div className="relative">
              <img
                src={photo}
                alt="Weight measurement"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setPhoto(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="absolute top-2 right-2 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500"
            >
              <Camera className="h-5 w-5" />
              <span>Take Weight Photo</span>
            </button>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Raw Material Entry
        </button>
      </form>
    </div>
  );
}