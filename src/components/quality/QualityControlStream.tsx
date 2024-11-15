import React, { useState } from 'react';
import { ClipboardCheck, FileText, Package, Filter, Box } from 'lucide-react';
import RawMaterialQC from './forms/RawMaterialQC';
import DepurationQC from './forms/DepurationQC';
import ProcessingQC from './forms/ProcessingQC';
import PackagingQC from './forms/PackagingQC';
import LotSelector from '../LotSelector'; // Changed to default import

type QCStep = 'raw' | 'depuration' | 'processing' | 'packaging';

export default function QualityControlStream() {
  const [activeStep, setActiveStep] = useState<QCStep>('raw');
  const [selectedLot, setSelectedLot] = useState('');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Quality Control Stream</h1>
        
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <StepButton
            icon={<ClipboardCheck />}
            label="Raw Material QC"
            active={activeStep === 'raw'}
            onClick={() => setActiveStep('raw')}
          />
          <StepButton
            icon={<Filter />}
            label="Depuration QC"
            active={activeStep === 'depuration'}
            onClick={() => setActiveStep('depuration')}
          />
          <StepButton
            icon={<FileText />}
            label="Processing QC"
            active={activeStep === 'processing'}
            onClick={() => setActiveStep('processing')}
          />
          <StepButton
            icon={<Box />}
            label="Packaging QC"
            active={activeStep === 'packaging'}
            onClick={() => setActiveStep('packaging')}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Lot for Quality Control
          </label>
          <LotSelector
            value={selectedLot}
            onChange={setSelectedLot}
            required
          />
        </div>

        {selectedLot && (
          <>
            {activeStep === 'raw' && <RawMaterialQC lotNumber={selectedLot} />}
            {activeStep === 'depuration' && <DepurationQC lotNumber={selectedLot} />}
            {activeStep === 'processing' && <ProcessingQC lotNumber={selectedLot} />}
            {activeStep === 'packaging' && <PackagingQC lotNumber={selectedLot} />}
          </>
        )}
      </div>
    </div>
  );
}

interface StepButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function StepButton({ icon, label, active, onClick }: StepButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-4 rounded-lg transition-colors whitespace-nowrap ${
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-500 hover:bg-gray-50'
      }`}
    >
      <div className="h-8 w-8">{icon}</div>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </button>
  );
}