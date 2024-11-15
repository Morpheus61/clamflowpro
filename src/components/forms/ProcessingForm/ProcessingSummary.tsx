import React from 'react';

interface ProcessingSummaryProps {
  shellOnTotal: number;
  meatTotal: number;
  totalInput: number;
}

export default function ProcessingSummary({
  shellOnTotal,
  meatTotal,
  totalInput
}: ProcessingSummaryProps) {
  const totalOutput = shellOnTotal + meatTotal;
  const yieldPercentage = (totalOutput / totalInput) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Processing Summary</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="text-sm font-medium text-gray-500">Shell-on Total</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {shellOnTotal.toFixed(1)} kg
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-500">Meat Total</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {meatTotal.toFixed(1)} kg
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-500">Total Output</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {totalOutput.toFixed(1)} kg
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-500">Yield</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {yieldPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Note:</strong> Shell weight will be recorded separately in Shell Weight Management
        </div>
      </div>
    </div>
  );
}