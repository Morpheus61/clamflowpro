import React from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export default function ProductionChart({ data }) {
  const chartData = React.useMemo(() => {
    if (!data) return [];

    // Group by week and product type
    const weeklyData = data.reduce((acc, record) => {
      const week = startOfWeek(new Date(record.packing_date));
      const weekKey = format(week, 'MM/dd');
      
      if (!acc[weekKey]) {
        acc[weekKey] = {
          week: weekKey,
          'shell-on': 0,
          'meat': 0
        };
      }
      
      acc[weekKey][record.product_type] += record.weight;
      return acc;
    }, {});

    return Object.values(weeklyData);
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="shell-on" name="Shell-on (kg)" fill="#059669" />
        <Bar dataKey="meat" name="Meat (kg)" fill="#dc2626" />
      </BarChart>
    </ResponsiveContainer>
  );
}