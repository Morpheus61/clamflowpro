import React, { useState } from 'react';
import { Package, Filter, Scale, Box } from 'lucide-react';
import RawMaterialEntry from './RawMaterialEntry';
import LotCreation from './LotCreation';
import Depuration from './Depuration';
import Processing from './Processing';
import Packaging from './Packaging';
import ShellWeight from './ShellWeight';
import LotSelector from '../LotSelector';

type ProductionStep = 'raw' | 'lot' | 'depuration' | 'processing' | 'packaging' | 'shell';

export default function ProductionStream() {
  const [activeStep, setActiveStep] = useState<ProductionStep>('raw');
  const [selectedLot, setSelectedLot] = useState('');

  // Determine if we need to show lot selector and if depuration is required
  const showLotSelector = ['depuration', 'processing', 'packaging'].includes(activeStep);
  const requireDepuration = activeStep === 'processing';

  // Reset selected lot when changing steps that don't need depuration
  const handleStepChange = (step: ProductionStep) => {
    setActiveStep(step);
    if (!['depuration', 'processing', 'packaging'].includes(step)) {
      setSelectedLot('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Production Stream</h1>
        
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <StepButton
            icon={<Package />}
            label="Raw Material"
            active={activeStep === 'raw'}
            onClick={() => handleStepChange('raw')}
          />
          <StepButton
            icon={<Package />}
            label="Lot Creation"
            active={activeStep === 'lot'}
            onClick={() => handleStepChange('lot')}
          />
          <StepButton
            icon={<Filter />}
            label="Depuration"
            active={activeStep === 'depuration'}
            onClick={() => handleStepChange('depuration')}
          />
          <StepButton
            icon={<Scale />}
            label="Processing"
            active={activeStep === 'processing'}
            onClick={() => handleStepChange('processing')}
          />
          <StepButton
            icon={<Box />}
            label="Packaging"
            active={activeStep === 'packaging'}
            onClick={() => handleStepChange('packaging')}
          />
          <StepButton
            icon={<Scale />}
            label="Shell Weight"
            active={activeStep === 'shell'}
            onClick={() => handleStepChange('shell')}
          />
        </div>
      </div>

      {showLotSelector && (
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {activeStep === 'processing' 
              ? 'Select Depurated Lot for Processing'
              : 'Select Lot Number'}
          </label>
          <LotSelector
            value={selectedLot}
            onChange={setSelectedLot}
            status={activeStep === 'depuration' ? 'pending' : 'processing'}
            requireDepuration={requireDepuration}
            required
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        {activeStep === 'raw' && <RawMaterialEntry />}
        {activeStep === 'lot' && <LotCreation />}
        {activeStep === 'depuration' && selectedLot && <Depuration lotNumber={selectedLot} />}
        {activeStep === 'processing' && selectedLot && <Processing lotNumber={selectedLot} />}
        {activeStep === 'packaging' && selectedLot && <Packaging lotNumber={selectedLot} />}
        {activeStep === 'shell' && <ShellWeight />}

        {showLotSelector && !selectedLot && (
          <div className="text-center py-8 text-gray-500">
            {requireDepuration ? (
              <p>Please select a lot that has completed depuration</p>
            ) : (
              <p>Please select a lot number to continue</p>
            )}
          </div>
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