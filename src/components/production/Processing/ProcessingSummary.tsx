import React from 'react';

interface ProcessingSummaryProps {
  shellOnTotal: number;
  meatTotal: number;
  shellWeight: number;
  totalInput: number;
}

export default function ProcessingSummary({
  shellOnTotal,
  meatTotal,
  shellWeight,
  totalInput
}: ProcessingSummaryProps) {
  const totalOutput = shellOnTotal + meatTotal + shellWeight;
  const yieldPercentage = ((shellOnTotal + meatTotal) / totalInput) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Processing Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-sm text-gray-600">Shell-on Total</div>
          <div className="text-xl font-medium">{shellOnTotal.toFixed(1)} kg</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Meat Total</div>
          <div className="text-xl font-medium">{meatTotal.toFixed(1)} kg</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Shell Weight</div>
          <div className="text-xl font-medium">{shellWeight.toFixed(1)} kg</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Yield</div>
          <div className="text-xl font-medium">{yieldPercentage.toFixed(1)}%</div>
        </div>
      </div>

      {Math.abs(totalOutput - totalInput) > 0.1 && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Total output ({totalOutput.toFixed(1)} kg) differs from input weight ({totalInput.toFixed(1)} kg).
            Please verify all weights are correct.
          </p>
        </div>
      )}
    </div>
  );
}