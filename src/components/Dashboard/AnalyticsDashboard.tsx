import React from 'react';
import { Download, Filter, RefreshCw } from 'lucide-react';
import { useProcessingData } from '../../hooks/useProcessingData';
import { usePackagedProducts } from '../../hooks/usePackagedProducts';
import { useFilters } from '../../hooks/useFilters';
import { exportToCSV } from '../../utils/export';
import YieldChart from './charts/YieldChart';
import ProductionChart from './charts/ProductionChart';
import SupplierPerformance from './charts/SupplierPerformance';
import QualityMetrics from './charts/QualityMetrics';

export default function AnalyticsDashboard() {
  const { data: processingData } = useProcessingData();
  const { data: packagedProducts } = usePackagedProducts();
  const { dateRange } = useFilters();

  const handleExport = () => {
    const data = processingData?.map(record => ({
      date: record.processing_date,
      lot_number: record.lot_number,
      shell_on_weight: record.shell_on_weight,
      meat_weight: record.meat_weight,
      yield_percentage: record.yield_percentage
    }));

    if (data) {
      exportToCSV(data, `clamflow-analytics-${new Date().toISOString()}.csv`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Yield Performance</h3>
            <RefreshCw className="h-4 w-4 text-gray-400 cursor-pointer" />
          </div>
          <YieldChart data={processingData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Production Output</h3>
            <Filter className="h-4 w-4 text-gray-400 cursor-pointer" />
          </div>
          <ProductionChart data={packagedProducts} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Supplier Performance</h3>
            <Filter className="h-4 w-4 text-gray-400 cursor-pointer" />
          </div>
          <SupplierPerformance />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Quality Metrics</h3>
            <Filter className="h-4 w-4 text-gray-400 cursor-pointer" />
          </div>
          <QualityMetrics />
        </div>
      </div>
    </div>
  );
}