import React from 'react';
import { Package, Weight, BarChart, Hash } from 'lucide-react';

export default function ProductForm() {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Record Finished Product</h2>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            icon={<Hash className="h-5 w-5 text-gray-400" />}
            label="Lot Number"
            type="select"
            placeholder="Select lot"
          />
          
          <FormField
            icon={<Package className="h-5 w-5 text-gray-400" />}
            label="Product Type"
            type="select"
            placeholder="Select type"
          />
          
          <FormField
            icon={<Weight className="h-5 w-5 text-gray-400" />}
            label="Weight (kg)"
            type="number"
            placeholder="Enter weight"
          />
          
          <FormField
            icon={<BarChart className="h-5 w-5 text-gray-400" />}
            label="Yield (%)"
            type="number"
            placeholder="Enter yield"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Record Product
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
            {label === 'Product Type' ? (
              <>
                <option value="shell-on">Shell-on Clams</option>
                <option value="meat">Clam Meat</option>
              </>
            ) : (
              <>
                <option value="L001">L001</option>
                <option value="L002">L002</option>
                <option value="L003">L003</option>
              </>
            )}
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