import React, { useState } from 'react';
import { Check, X, AlertTriangle, Thermometer, Droplets } from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import { db } from '../../../db';

interface DepurationQCProps {
  lotNumber: string;
}

interface DepurationParameters {
  temperature: string;
  salinity: string;
  waterFlow: string;
  timeElapsed: string;
}

export default function DepurationQC({ lotNumber }: DepurationQCProps) {
  const [parameters, setParameters] = useState<DepurationParameters>({
    temperature: '',
    salinity: '',
    waterFlow: '',
    timeElapsed: ''
  });

  const [checklist, setChecklist] = useState([
    { id: '1', label: 'Water Temperature (18-22°C)', passed: null, notes: '' },
    { id: '2', label: 'Salinity Level (28-35 ppt)', passed: null, notes: '' },
    { id: '3', label: 'Water Flow Rate Check', passed: null, notes: '' },
    { id: '4', label: 'UV Sterilizer Operation', passed: null, notes: '' },
    { id: '5', label: 'Tank Cleanliness', passed: null, notes: '' },
    { id: '6', label: 'Clam Activity/Response', passed: null, notes: '' }
  ]);

  const { addNotification } = useNotification();

  const handleCheck = (id: string, passed: boolean) => {
    setChecklist(items =>
      items.map(item =>
        item.id === id ? { ...item, passed } : item
      )
    );
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
          depurationQC: {
            checklist,
            parameters,
            completedAt: new Date(),
            passed: checklist.every(item => item.passed)
          }
        });
      });

      addNotification('success', 'Depuration quality control completed');
    } catch (error) {
      console.error('Error saving QC results:', error);
      addNotification('error', 'Error saving quality control results');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperature (°C)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Thermometer className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={parameters.temperature}
              onChange={(e) => setParameters(prev => ({ ...prev, temperature: e.target.value }))}
              step="0.1"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salinity (ppt)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Droplets className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={parameters.salinity}
              onChange={(e) => setParameters(prev => ({ ...prev, salinity: e.target.value }))}
              step="0.1"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
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
            <span>Some parameters are out of acceptable range. Review and adjust as needed.</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Submit Depuration QC Results
      </button>
    </form>
  );
}