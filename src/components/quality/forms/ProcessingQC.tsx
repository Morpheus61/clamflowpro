import React, { useState } from 'react';
import { Check, X, AlertTriangle, Scale } from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import { db } from '../../../db';

interface ProcessingQCProps {
  lotNumber: string;
}

export default function ProcessingQC({ lotNumber }: ProcessingQCProps) {
  const [checklist, setChecklist] = useState([
    { id: '1', label: 'Processing Area Sanitation', passed: null, notes: '' },
    { id: '2', label: 'Staff Hygiene Compliance', passed: null, notes: '' },
    { id: '3', label: 'Equipment Cleanliness', passed: null, notes: '' },
    { id: '4', label: 'Temperature Control', passed: null, notes: '' },
    { id: '5', label: 'Product Quality - Shell-on', passed: null, notes: '' },
    { id: '6', label: 'Product Quality - Meat', passed: null, notes: '' },
    { id: '7', label: 'Yield Verification', passed: null, notes: '' }
  ]);

  const [yieldData, setYieldData] = useState({
    inputWeight: '',
    shellOnWeight: '',
    meatWeight: '',
    shellWeight: ''
  });

  const { addNotification } = useNotification();

  const handleCheck = (id: string, passed: boolean) => {
    setChecklist(items =>
      items.map(item =>
        item.id === id ? { ...item, passed } : item
      )
    );
  };

  const calculateYield = () => {
    const input = parseFloat(yieldData.inputWeight) || 0;
    const shellOn = parseFloat(yieldData.shellOnWeight) || 0;
    const meat = parseFloat(yieldData.meatWeight) || 0;
    if (input === 0) return 0;
    return ((shellOn + meat) / input) * 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (checklist.some(item => item.passed === null)) {
      addNotification('error', 'Please complete all quality checks');
      return;
    }

    try {
      await db.transaction('rw', [db.lots], async () => {
        const lot = await db.lots.where('lotNumber').equals(lotNumber).first();
        if (!lot) throw new Error('Lot not found');

        await db.lots.update(lot.id!, {
          processingQC: {
            checklist,
            yieldData: {
              ...yieldData,
              yieldPercentage: calculateYield()
            },
            completedAt: new Date(),
            passed: checklist.every(item => item.passed)
          }
        });
      });

      addNotification('success', 'Processing quality control completed');
    } catch (error) {
      console.error('Error saving QC results:', error);
      addNotification('error', 'Error saving quality control results');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Yield Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Input Weight (kg)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Scale className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="number"
                value={yieldData.inputWeight}
                onChange={(e) => setYieldData(prev => ({ ...prev, inputWeight: e.target.value }))}
                step="0.1"
                className="block w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Shell-on Weight (kg)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Scale className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="number"
                value={yieldData.shellOnWeight}
                onChange={(e) => setYieldData(prev => ({ ...prev, shellOnWeight: e.target.value }))}
                step="0.1"
                className="block w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Meat Weight (kg)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Scale className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="number"
                value={yieldData.meatWeight}
                onChange={(e) => setYieldData(prev => ({ ...prev, meatWeight: e.target.value }))}
                step="0.1"
                className="block w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Shell Weight (kg)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Scale className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="number"
                value={yieldData.shellWeight}
                onChange={(e) => setYieldData(prev => ({ ...prev, shellWeight: e.target.value }))}
                step="0.1"
                className="block w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-4 text-right">
          <div className="text-sm text-blue-800">Yield Percentage:</div>
          <div className="text-2xl font-bold text-blue-900">{calculateYield().toFixed(1)}%</div>
        </div>
      </div>

      <div className="space-y-4">
        {checklist.map((item) => (
          <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{item.label}</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleCheck(item.id, true)}
                  className={`p-2 rounded-full ${
                    item.passed === true
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCheck(item.id, false)}
                  className={`p-2 rounded-full ${
                    item.passed === false
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {checklist.some(item => item.passed === false) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Some quality checks have failed. Review and take corrective actions.</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Submit Processing QC Results
      </button>
    </form>
  );
}