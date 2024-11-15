import React from 'react';
import { Scale } from 'lucide-react';

interface ShellWeightEntryProps {
  weight: string;
  onChange: (weight: string) => void;
  disabled?: boolean;
}

export default function ShellWeightEntry({ weight, onChange, disabled }: ShellWeightEntryProps) {
  return (
    <div className="bg-amber-50 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Scale className="h-5 w-5 text-amber-600" />
        <h3 className="text-lg font-medium text-amber-900">Shell Weight</h3>
      </div>

      <div className="max-w-md">
        <label className="block text-sm font-medium text-amber-800 mb-1">
          Total Shell Weight (kg)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Scale className="h-5 w-5 text-amber-500" />
          </div>
          <input
            type="number"
            value={weight}
            onChange={(e) => onChange(e.target.value)}
            step="0.1"
            min="0"
            className="block w-full pl-10 pr-3 py-2 border border-amber-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white"
            placeholder="Enter total shell weight"
            required
            disabled={disabled}
          />
        </div>
        <p className="mt-2 text-sm text-amber-700">
          Enter the total weight of shells after meat extraction
        </p>
      </div>
    </div>
  );
}