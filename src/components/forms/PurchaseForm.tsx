import React from 'react';
import { Scale, DollarSign, Calendar, User } from 'lucide-react';

export default function PurchaseForm() {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">New Clam Purchase</h2>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            icon={<User className="h-5 w-5 text-gray-400" />}
            label="Supplier"
            type="select"
            placeholder="Select supplier"
          />
          
          <FormField
            icon={<Calendar className="h-5 w-5 text-gray-400" />}
            label="Date"
            type="date"
          />
          
          <FormField
            icon={<Scale className="h-5 w-5 text-gray-400" />}
            label="Quantity (kg)"
            type="number"
            placeholder="Enter quantity"
          />
          
          <FormField
            icon={<DollarSign className="h-5 w-5 text-gray-400" />}
            label="Price per kg"
            type="number"
            placeholder="Enter price"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Purchase Order
          </button>
        </div>
      </form>
    </div>
  );
}

interface FormFieldProps {
  icon: React.ReactNode;
  label: string;
  type: string;
  placeholder?: string;
}

function FormField({ icon, label, type, placeholder }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        {type === 'select' ? (
          <select className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="">{placeholder}</option>
            <option value="1">John's Fishing Co</option>
            <option value="2">Sea Harvest Ltd</option>
            <option value="3">Bay Clams Inc</option>
          </select>
        ) : (
          <input
            type={type}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}