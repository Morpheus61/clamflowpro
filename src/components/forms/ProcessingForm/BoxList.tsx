import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Package } from 'lucide-react';
import BoxQRCode from './BoxQRCode';

interface BoxListProps {
  boxes: Array<{
    id: string;
    type: 'shell-on' | 'meat';
    boxNumber: string;
    weight: string;
    grade: string;
  }>;
  lotNumber: string;
  processingDate: Date;
}

export default function BoxList({ boxes, lotNumber, processingDate }: BoxListProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Box-List-${lotNumber}-${processingDate.toISOString().split('T')[0]}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        .qr-code-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20mm;
        }
        .qr-code-item {
          break-inside: avoid;
          page-break-inside: avoid;
          margin-bottom: 20mm;
        }
      }
    `
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Box List & QR Codes</h3>
          <p className="text-sm text-gray-600">
            Lot {lotNumber} - {boxes.length} boxes
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Printer className="h-5 w-5" />
          <span>Print QR Codes</span>
        </button>
      </div>

      <div ref={printRef}>
        <div className="qr-code-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {boxes.map(box => (
            <div key={box.id} className="qr-code-item">
              <BoxQRCode
                box={box}
                lotNumber={lotNumber}
                processingDate={processingDate}
              />
            </div>
          ))}
        </div>

        {boxes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Package className="h-12 w-12 mb-2" />
            <p>No boxes added yet</p>
          </div>
        )}
      </div>
    </div>
  );
}