import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';
import { useProcessingData } from '../../hooks/useProcessingData';

export default function Analytics() {
  const { data: processingData } = useProcessingData();

  const chartData = React.useMemo(() => {
    if (!processingData) return [];

    return processingData.map(record => ({
      date: format(new Date(record.processing_date), 'MM/dd'),
      yield: record.yield_percentage,
      shellOn: record.shell_on_weight,
      meat: record.meat_weight
    }));
  }, [processingData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Processing Analytics</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Yield Trend</h3>
          <LineChart width={800} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="yield" 
              stroke="#2563eb" 
              name="Yield %" 
            />
          </LineChart>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Production Output</h3>
          <LineChart width={800} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="shellOn" 
              stroke="#059669" 
              name="Shell-on (kg)" 
            />
            <Line 
              type="monotone" 
              dataKey="meat" 
              stroke="#dc2626" 
              name="Meat (kg)" 
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
}