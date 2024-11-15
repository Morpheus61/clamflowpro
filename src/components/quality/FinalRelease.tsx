import React, { useState } from 'react';
import { Award, Check, AlertTriangle } from 'lucide-react';

interface ReleaseChecklist {
  qualityCheckPassed: boolean;
  yieldVerified: boolean;
  documentationComplete: boolean;
  packagingCorrect: boolean;
  labelingComplete: boolean;
}

export default function FinalRelease() {
  const [lotNumber, setLotNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [checklist, setChecklist] = useState<ReleaseChecklist>({
    qualityCheckPassed: false,
    yieldVerified: false,
    documentationComplete: false,
    packagingCorrect: false,
    labelingComplete: false
  });

  const handleChecklistChange = (key: keyof ReleaseChecklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const allChecksCompleted = Object.values(checklist).every(value => value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Final release:', {
      lotNumber,
      checklist,
      notes
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Final Release Approval</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lot Number
          </label>
          <input
            type="text"
            value={lotNumber}
            onChange={(e) => setLotNumber(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="space-y-4">
          {Object.entries(checklist).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => handleChecklistChange(key as keyof ReleaseChecklist)}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  value ? 'bg-green-100 text-green-600' : 'bg-gray-200'
                }`}
              >
                <Check className="h-4 w-4" />
              </div>
              <span className="flex-1 font-medium">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Release Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Add any relevant notes about the release..."
          />
        </div>

        {!allChecksCompleted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Complete all checks before final release</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!allChecksCompleted}
        >
          Approve Final Release
        </button>
      </form>
    </div>
  );
}