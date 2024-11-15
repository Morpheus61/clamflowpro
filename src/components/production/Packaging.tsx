import React, { useState } from 'react';
import { Box, QrCode, Tag, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface PackagingData {
  lotNumber: string;
  boxNumber: string;
  productType: 'shell-on' | 'meat';
  weight: string;
  grade: string;
  packingDate: string;
}

export default function Packaging() {
  const [formData, setFormData] = useState<PackagingData>({
    lotNumber: '',
    boxNumber: '',
    productType: 'shell-on',
    weight: '',
    grade: '',
    packingDate: new Date().toISOString().split('T')[0]
  });

  const [showQR, setShowQR] = useState(false);

  // Mock data for lots - replace with actual data from your database
  const availableLots = [
    { id: 'L240115001', label: 'L240115001 - Supplier 1' },
    { id: 'L240115002', label: 'L240115002 - Supplier 2' }
  ];

  const generateQRData = () => {
    return JSON.stringify({
      lotNumber: formData.lotNumber,
      boxNumber: formData.boxNumber,
      type: formData.productType,
      weight: formData.weight,
      grade: formData.grade,
      packingDate: formData.packingDate
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Box Label - ${formData.boxNumber}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .label { border: 1px solid #000; padding: 20px; width: 300px; }
            .title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
            .info { margin: 5px 0; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="title">ClamFlow™ Pro</div>
            <div class="info">Lot: ${formData.lotNumber}</div>
            <div class="info">Box: ${formData.boxNumber}</div>
            <div class="info">Type: ${formData.productType === 'shell-on' ? 'Shell-on Clams' : 'Clam Meat'}</div>
            <div class="info">Weight: ${formData.weight} kg</div>
            <div class="info">Grade: ${formData.grade}</div>
            <div class="info">Date: ${new Date(formData.packingDate).toLocaleDateString()}</div>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowQR(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Packaging Details</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Lot
          </label>
          <select
            value={formData.lotNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, lotNumber: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select a lot</option>
            {availableLots.map(lot => (
              <option key={lot.id} value={lot.id}>{lot.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Box Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Box className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.boxNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, boxNumber: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type
            </label>
            <select
              value={formData.productType}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                productType: e.target.value as 'shell-on' | 'meat'
              }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="shell-on">Shell-on Clams</option>
              <option value="meat">Clam Meat</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Grade</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Generate Box Label
        </button>
      </form>

      {showQR && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Box Label</h3>
          <div className="flex justify-center mb-4">
            <QRCodeSVG value={generateQRData()} size={200} />
          </div>
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            <Printer className="h-5 w-5" />
            <span>Print Label</span>
          </button>
        </div>
      )}
    </div>
  );
}