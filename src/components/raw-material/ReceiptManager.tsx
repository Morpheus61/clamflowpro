import React, { useState, useCallback } from 'react';
import { Package, Filter, Search, List, Archive } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import ReceiptList from './ReceiptList';
import LotCreator from './LotCreator';
import LotList from './LotList';

type TabType = 'receipts' | 'lots';

export default function ReceiptManager() {
  const [activeTab, setActiveTab] = useState<TabType>('receipts');
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const [showLotCreator, setShowLotCreator] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  // Fetch receipts with supplier information
  const data = useLiveQuery(async () => {
    try {
      // First get all suppliers and create a lookup map
      const suppliers = await db.suppliers.toArray();
      const supplierMap = new Map(suppliers.map(s => [s.id, s]));

      // Get pending raw materials
      const rawMaterials = await db.rawMaterials
        .where('status')
        .equals('pending')
        .toArray();

      // Map raw materials to include supplier details
      const receiptsWithSuppliers = rawMaterials.map(receipt => {
        const supplier = supplierMap.get(receipt.supplierId);
        return {
          ...receipt,
          supplier,
          supplierName: supplier?.name || 'Unknown Supplier'
        };
      });

      return {
        suppliers,
        receipts: receiptsWithSuppliers
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }, []); // Empty dependency array for initial load only

  // Fetch lots with supplier information
  const lots = useLiveQuery(async () => {
    if (!data?.suppliers) return [];

    try {
      const results = await db.lots.orderBy('createdAt').reverse().toArray();
      const supplierMap = new Map(data.suppliers.map(s => [s.id, s]));
      
      return Promise.all(
        results.map(async lot => {
          const receipts = await db.rawMaterials
            .where('lotNumber')
            .equals(lot.lotNumber)
            .toArray();

          const receiptDetails = receipts.map(r => ({
            ...r,
            supplierName: supplierMap.get(r.supplierId)?.name || 'Unknown Supplier'
          }));

          return {
            ...lot,
            receipts: receiptDetails
          };
        })
      );
    } catch (error) {
      console.error('Error fetching lots:', error);
      return [];
    }
  }, [data?.suppliers]);

  const filteredReceipts = React.useMemo(() => {
    if (!data?.receipts) return [];
    
    return data.receipts
      .filter(receipt => {
        const matchesSearch = receipt.supplierName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        if (dateRange[0] && dateRange[1]) {
          const receiptDate = new Date(receipt.date);
          return matchesSearch && 
            receiptDate >= dateRange[0] && 
            receiptDate <= dateRange[1];
        }

        return matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data?.receipts, searchTerm, dateRange]);

  const handleSelectReceipt = useCallback((id: string) => {
    setSelectedReceipts(prev =>
      prev.includes(id)
        ? prev.filter(rid => rid !== id)
        : [...prev, id]
    );
  }, []);

  const selectedReceiptDetails = React.useMemo(() => 
    filteredReceipts
      .filter(r => selectedReceipts.includes(r.id))
      .map(r => ({
        id: r.id,
        weight: r.weight,
        supplierName: r.supplierName
      })),
    [filteredReceipts, selectedReceipts]
  );

  const handleClearFilters = useCallback(() => {
    setDateRange([null, null]);
    setSearchTerm('');
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Raw Material Management</h1>
        
        {activeTab === 'receipts' && selectedReceipts.length > 0 && (
          <button
            onClick={() => setShowLotCreator(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Package className="h-5 w-5" />
            <span>Create Lot ({selectedReceipts.length})</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('receipts')}
              className={`py-4 px-1 inline-flex items-center space-x-2 border-b-2 font-medium text-sm ${
                activeTab === 'receipts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <List className="h-5 w-5" />
              <span>Pending Receipts</span>
            </button>
            <button
              onClick={() => setActiveTab('lots')}
              className={`py-4 px-1 inline-flex items-center space-x-2 border-b-2 font-medium text-sm ${
                activeTab === 'lots'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Archive className="h-5 w-5" />
              <span>Created Lots</span>
            </button>
          </nav>
        </div>

        {activeTab === 'receipts' && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-4">
                <input
                  type="date"
                  value={dateRange[0]?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setDateRange([new Date(e.target.value), dateRange[1]])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={dateRange[1]?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setDateRange([dateRange[0], new Date(e.target.value)])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleClearFilters}
                className="flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Filter className="h-5 w-5" />
                <span>Clear Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'receipts' ? (
        <ReceiptList
          receipts={filteredReceipts}
          selectedReceipts={selectedReceipts}
          onSelectReceipt={handleSelectReceipt}
        />
      ) : (
        <LotList lots={lots || []} />
      )}

      {showLotCreator && selectedReceiptDetails && (
        <LotCreator
          selectedReceipts={selectedReceiptDetails}
          onSuccess={() => {
            setShowLotCreator(false);
            setSelectedReceipts([]);
            setActiveTab('lots');
          }}
          onCancel={() => setShowLotCreator(false)}
        />
      )}
    </div>
  );
}