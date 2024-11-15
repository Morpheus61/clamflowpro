import React, { useState } from 'react';
import { Database, Users, FileText, Package, Plus } from 'lucide-react';
import { useFishermen, usePurchaseOrders, useLots, useProducts } from '../hooks/useQuery';

export default function DataManager() {
  const [activeTab, setActiveTab] = useState<'fishermen' | 'orders' | 'lots' | 'products'>('fishermen');
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Database className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            <TabButton
              icon={<Users className="h-4 w-4" />}
              label="Fishermen"
              active={activeTab === 'fishermen'}
              onClick={() => setActiveTab('fishermen')}
            />
            <TabButton
              icon={<FileText className="h-4 w-4" />}
              label="Purchase Orders"
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
            />
            <TabButton
              icon={<Package className="h-4 w-4" />}
              label="Lots"
              active={activeTab === 'lots'}
              onClick={() => setActiveTab('lots')}
            />
            <TabButton
              icon={<Package className="h-4 w-4" />}
              label="Products"
              active={activeTab === 'products'}
              onClick={() => setActiveTab('products')}
            />
          </nav>
        </div>

        <div className="p-4">
          {activeTab === 'fishermen' && <FishermenTable />}
          {activeTab === 'orders' && <PurchaseOrdersTable />}
          {activeTab === 'lots' && <LotsTable />}
          {activeTab === 'products' && <ProductsTable />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon, label, active, onClick }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center space-x-2 py-4 px-3 border-b-2 font-medium text-sm
        ${active 
          ? 'border-blue-500 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function FishermenTable() {
  const { data: fishermen, isLoading } = useFishermen();

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Registered Fishermen</h2>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>Add Fisherman</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fishermen?.map((fisherman) => (
              <tr key={fisherman.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fisherman.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fisherman.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fisherman.licenseNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PurchaseOrdersTable() {
  const { data: orders, isLoading } = usePurchaseOrders();

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Purchase Orders</h2>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>New Order</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders?.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.fisherman_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity} kg</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.totalAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LotsTable() {
  const { data: lots, isLoading } = useLots();

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Processing Lots</h2>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>Create Lot</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lots?.map((lot) => (
              <tr key={lot.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lot.id.slice(0, 8)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lot.creationDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lot.quantity} kg</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${lot.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {lot.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductsTable() {
  const { data: products, isLoading } = useProducts();

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Finished Products</h2>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products?.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.processingDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity} kg</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${product.grade === 'A' ? 'bg-green-100 text-green-800' : 
                      product.grade === 'B' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    Grade {product.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}