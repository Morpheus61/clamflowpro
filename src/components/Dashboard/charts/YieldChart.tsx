import React from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function YieldChart({ data }) {
  const chartData = React.useMemo(() => {
    if (!data) return [];
    
    return data.map(record => ({
      date: format(new Date(record.processing_date), 'MM/dd'),
      yield: record.yield_percentage,
      target: 85 // Target yield percentage
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="yield" 
          stroke="#2563eb" 
          name="Actual Yield %" 
        />
        <Line 
          type="monotone" 
          dataKey="target" 
          stroke="#dc2626" 
          strokeDasharray="5 5" 
          name="Target Yield" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}