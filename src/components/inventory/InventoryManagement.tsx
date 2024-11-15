import React, { useState } from 'react';
import { Package, QrCode, Truck, FileText, Search } from 'lucide-react';
import { usePackagedProducts } from '../../hooks/usePackagedProducts';
import QRScanner from './QRScanner';
import ShipmentCreator from './ShipmentCreator';
import InventoryTable from './InventoryTable';

export default function InventoryManagement() {
  const [showScanner, setShowScanner] = useState(false);
  const [showShipment, setShowShipment] = useState(false);
  const [selectedBoxes, setSelectedBoxes] = useState<string[]>([]);
  const { data: inventory, isLoading } = usePackagedProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const handleScan = (data: string) => {
    try {
      const scannedData = JSON.parse(data);
      // Handle scanned box data
      console.log('Scanned box:', scannedData);
      setShowScanner(false);
    } catch (error) {
      console.error('Invalid QR code data');
    }
  };

  const filteredInventory = inventory?.filter(item => 
    item.boxNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          >
            <QrCode className="h-5 w-5" />
            <span>Scan QR</span>
          </button>
          <button
            onClick={() => setShowShipment(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
          >
            <Truck className="h-5 w-5" />
            <span>Create Shipment</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by box number or lot number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Inventory Table */}
      <InventoryTable
        inventory={filteredInventory || []}
        isLoading={isLoading}
        selectedBoxes={selectedBoxes}
        onSelectBox={(boxId) => {
          setSelectedBoxes(prev => 
            prev.includes(boxId)
              ? prev.filter(id => id !== boxId)
              : [...prev, boxId]
          );
        }}
      />

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Scan QR Code</h2>
              <button onClick={() => setShowScanner(false)}>×</button>
            </div>
            <QRScanner onScan={handleScan} />
          </div>
        </div>
      )}

      {/* Shipment Creator Modal */}
      {showShipment && (
        <ShipmentCreator
          selectedBoxes={selectedBoxes}
          inventory={inventory || []}
          onClose={() => {
            setShowShipment(false);
            setSelectedBoxes([]);
          }}
        />
      )}
    </div>
  );
}