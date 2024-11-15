import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';

interface BoxQRCodeProps {
  box: {
    type: 'shell-on' | 'meat';
    boxNumber: string;
    weight: string;
    grade: string;
  };
  lotNumber: string;
  processingDate: Date;
}

export default function BoxQRCode({ box, lotNumber, processingDate }: BoxQRCodeProps) {
  const qrData = {
    lotNumber,
    boxNumber: box.boxNumber,
    type: box.type,
    weight: parseFloat(box.weight),
    grade: box.grade,
    processingDate: format(processingDate, 'yyyy-MM-dd')
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
      <QRCodeSVG
        value={JSON.stringify(qrData)}
        size={120}
        level="H"
        includeMargin
      />
      <div className="mt-2 text-center">
        <div className="font-medium">{box.boxNumber}</div>
        <div className="text-sm text-gray-500">
          {box.type === 'shell-on' ? 'Shell-on' : 'Meat'} - Grade {box.grade}
        </div>
        <div className="text-sm text-gray-500">{box.weight} kg</div>
      </div>
    </div>
  );
}