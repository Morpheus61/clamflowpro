import React, { useState, useRef } from 'react';
import { Scale, Camera, User, X } from 'lucide-react';
import { format } from 'date-fns';
import { useNotification } from '../../hooks/useNotification';
import { db } from '../../db';
import { useLiveQuery } from 'dexie-react-hooks';

interface RawMaterialFormProps {
  onSuccess: () => void;
}

export default function RawMaterialForm({ onSuccess }: RawMaterialFormProps) {
  const [supplierId, setSupplierId] = useState('');
  const [weight, setWeight] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotification();

  // Fetch suppliers from database
  const suppliers = useLiveQuery(() => db.suppliers.toArray());

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
    
    if (!supplierId || !weight || !photo) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      // Create raw material record with proper supplier ID
      const rawMaterialId = await db.rawMaterials.add({
        supplierId: parseInt(supplierId, 10), // Ensure supplierId is a number
        weight: parseFloat(weight),
        photoUrl: photo,
        date: new Date(),
        status: 'pending',
        lotNumber: null
      });

      // Verify the supplier exists
      const supplier = await db.suppliers.get(parseInt(supplierId, 10));
      if (!supplier) {
        console.error('Supplier not found:', supplierId);
      }

      addNotification('success', 'Raw material data saved successfully');
      onSuccess();
    } catch (error) {
      addNotification('error', 'Error saving raw material data');
      console.error('Error:', error);
    }
  };

  if (!suppliers) {
    return <div>Loading suppliers...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Raw Material Receipt</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Supplier
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} - {supplier.licenseNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Scale className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.1"
              min="0"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter weight in kg"
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
                className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
              >
                <X className="h-4 w-4" />
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
          Submit
        </button>
      </form>
    </div>
  );
}