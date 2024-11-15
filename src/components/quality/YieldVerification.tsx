import React, { useState } from 'react';
import { Scale, Percent } from 'lucide-react';

interface YieldData {
  lotNumber: string;
  rawWeight: string;
  processedWeight: string;
  shellWeight: string;
}

export default function YieldVerification() {
  const [formData, setFormData] = useState<YieldData>({
    lotNumber: '',
    rawWeight: '',
    processedWeight: '',
    shellWeight: ''
  });

  const calculateYield = () => {
    const raw = parseFloat(formData.rawWeight) || 0;
    const processed = parseFloat(formData.processedWeight) || 0;
    if (raw === 0) return 0;
    return ((processed / raw) * 100).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Yield verification:', {
      ...formData,
      yieldPercentage: calculateYield()
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Yield Verification</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lot Number
          </label>
          <input
            type="text"
            value={formData.lotNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, lotNumber: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raw Material Weight (kg)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Scale className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={formData.rawWeight}
                onChange={(e) => setFormData(prev => ({ ...prev, rawWeight: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                required
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Processed Weight (kg)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Scale className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={formData.processedWeight}
                onChange={(e) => setFormData(prev => ({ ...prev, processedWeight: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                required
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shell Weight (kg)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Scale className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={formData.shellWeight}
              onChange={(e) => setFormData(prev => ({ ...prev, shellWeight: e.target.value }))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
              required
              step="0.01"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-900">Yield Percentage:</span>
            <div className="flex items-center text-blue-600">
              <Percent className="h-5 w-5 mr-1" />
              <span className="text-xl font-bold">{calculateYield()}%</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Verify Yield
        </button>
      </form>
    </div>
  );
}