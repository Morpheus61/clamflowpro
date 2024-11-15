import React, { useState } from 'react';
import { FileText, Printer, X } from 'lucide-react';
import { format } from 'date-fns';

interface ShipmentCreatorProps {
  selectedBoxes: string[];
  inventory: any[];
  onClose: () => void;
}

export default function ShipmentCreator({
  selectedBoxes,
  inventory,
  onClose
}: ShipmentCreatorProps) {
  const [shipmentDetails, setShipmentDetails] = useState({
    customerName: '',
    destination: '',
    transportMode: 'road',
    vehicleNumber: '',
    notes: ''
  });

  const selectedItems = inventory.filter(item => selectedBoxes.includes(item.id));
  
  const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);

  const generatePackingList = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Packing List</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .details {
              margin-bottom: 30px;
            }
            .details div {
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f8f9fa;
            }
            .summary {
              margin-top: 30px;
              text-align: right;
            }
            @media print {
              body { margin: 0; padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Packing List</h1>
            <p>Date: ${format(new Date(), 'dd/MM/yyyy')}</p>
          </div>

          <div class="details">
            <div><strong>Customer:</strong> ${shipmentDetails.customerName}</div>
            <div><strong>Destination:</strong> ${shipmentDetails.destination}</div>
            <div><strong>Transport:</strong> ${shipmentDetails.transportMode}</div>
            <div><strong>Vehicle Number:</strong> ${shipmentDetails.vehicleNumber}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Box Number</th>
                <th>Product Type</th>
                <th>Lot Number</th>
                <th>Weight (kg)</th>
              </tr>
            </thead>
            <tbody>
              ${selectedItems.map(item => `
                <tr>
                  <td>${item.boxNumber}</td>
                  <td>${item.productType === 'shell-on' ? 'Shell-on Clams' : 'Clam Meat'}</td>
                  <td>${item.lotNumber}</td>
                  <td>${item.weight}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <p><strong>Total Boxes:</strong> ${selectedItems.length}</p>
            <p><strong>Total Weight:</strong> ${totalWeight.toFixed(2)} kg</p>
          </div>

          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle shipment creation
    console.log({
      ...shipmentDetails,
      boxes: selectedBoxes,
      totalWeight,
      timestamp: new Date().toISOString()
    });
    generatePackingList();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Create Shipment</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={shipmentDetails.customerName}
                onChange={(e) => setShipmentDetails(prev => ({
                  ...prev,
                  customerName: e.target.value
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <input
                type="text"
                value={shipmentDetails.destination}
                onChange={(e) => setShipmentDetails(prev => ({
                  ...prev,
                  destination: e.target.value
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transport Mode
              </label>
              <select
                value={shipmentDetails.transportMode}
                onChange={(e) => setShipmentDetails(prev => ({
                  ...prev,
                  transportMode: e.target.value
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="road">Road</option>
                <option value="air">Air</option>
                <option value="sea">Sea</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Number
              </label>
              <input
                type="text"
                value={shipmentDetails.vehicleNumber}
                onChange={(e) => setShipmentDetails(prev => ({
                  ...prev,
                  vehicleNumber: e.target.value
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={shipmentDetails.notes}
              onChange={(e) => setShipmentDetails(prev => ({
                ...prev,
                notes: e.target.value
              }))}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Selected Items</h3>
            <div className="text-sm text-gray-600">
              <p>Total Boxes: {selectedItems.length}</p>
              <p>Total Weight: {totalWeight.toFixed(2)} kg</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FileText className="h-5 w-5" />
              <span>Generate Packing List</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}