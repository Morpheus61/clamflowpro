import React from 'react';
import { Shell, Package, Scale, Activity } from 'lucide-react';
import { useRawMaterials } from '../hooks/useRawMaterials';
import { useProcessingData } from '../hooks/useProcessingData';
import { usePackagingData } from '../hooks/usePackagingData';

interface DashboardProps {
  onAdminClick: () => void;
}

export default function Dashboard({ onAdminClick }: DashboardProps) {
  const { data: rawMaterials, isLoading: rawLoading } = useRawMaterials();
  const { data: processingData, isLoading: processLoading } = useProcessingData();
  const { data: packagedProducts, isLoading: packageLoading } = usePackagingData();

  if (rawLoading || processLoading || packageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  const todayRawMaterial = rawMaterials.reduce((acc, curr) => {
    if (new Date(curr.date).toDateString() === new Date().toDateString()) {
      return acc + (curr.weight || 0);
    }
    return acc;
  }, 0);

  const activeLots = processingData.filter(batch => batch.status === 'processing').length;

  const totalPackaged = packagedProducts.reduce((acc, curr) => acc + (curr.weight || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={onAdminClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Administration
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Scale className="w-8 h-8 text-blue-500" />}
          title="Today's Raw Material"
          value={`${todayRawMaterial.toFixed(1)} kg`}
          change="+12.5%"
        />
        <StatCard
          icon={<Package className="w-8 h-8 text-green-500" />}
          title="Active Lots"
          value={String(activeLots)}
          change={`${activeLots > 0 ? 'Processing' : 'No active lots'}`}
        />
        <StatCard
          icon={<Shell className="w-8 h-8 text-purple-500" />}
          title="Total Packaged"
          value={`${totalPackaged.toFixed(1)} kg`}
          change="-5%"
        />
        <StatCard
          icon={<Activity className="w-8 h-8 text-red-500" />}
          title="Yield Rate"
          value={`${((totalPackaged / todayRawMaterial) * 100).toFixed(1)}%`}
          change="Average"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProcessingQueue data={processingData} />
        <RecentDeliveries data={rawMaterials} />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, change }: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  change: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className="text-sm font-medium text-gray-500">{change}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  );
}

function ProcessingQueue({ data }: { data: any[] }) {
  const activeBatches = data
    .filter(batch => batch.status === 'processing')
    .slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Processing Queue</h2>
      <div className="space-y-4">
        {activeBatches.map((batch) => (
          <div key={batch.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Lot #{batch.lotNumber}</p>
              <p className="text-sm text-gray-600">{batch.type} Processing</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              In Progress
            </span>
          </div>
        ))}
        {activeBatches.length === 0 && (
          <p className="text-gray-500 text-center py-4">No active processing batches</p>
        )}
      </div>
    </div>
  );
}

function RecentDeliveries({ data }: { data: any[] }) {
  const recentDeliveries = data
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Deliveries</h2>
      <div className="space-y-4">
        {recentDeliveries.map((delivery) => (
          <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Lot #{delivery.lotNumber || 'Pending'}</p>
              <p className="text-sm text-gray-600">{delivery.weight} kg</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Received
            </span>
          </div>
        ))}
        {recentDeliveries.length === 0 && (
          <p className="text-gray-500 text-center py-4">No recent deliveries</p>
        )}
      </div>
    </div>
  );
}