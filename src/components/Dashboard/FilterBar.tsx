import React from 'react';
import { Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface FilterBarProps {
  dateRange: [Date | null, Date | null];
  onDateRangeChange: (range: [Date | null, Date | null]) => void;
  filters: {
    status?: string;
    supplier?: string;
    productType?: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export default function FilterBar({
  dateRange,
  onDateRangeChange,
  filters,
  onFilterChange
}: FilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : ''}
            onChange={(e) => onDateRangeChange([new Date(e.target.value), dateRange[1]])}
            className="border rounded-md px-2 py-1"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange[1] ? format(dateRange[1], 'yyyy-MM-dd') : ''}
            onChange={(e) => onDateRangeChange([dateRange[0], new Date(e.target.value)])}
            className="border rounded-md px-2 py-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="border rounded-md px-2 py-1"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.supplier}
            onChange={(e) => onFilterChange('supplier', e.target.value)}
            className="border rounded-md px-2 py-1"
          >
            <option value="">All Suppliers</option>
            <option value="sup1">Supplier 1</option>
            <option value="sup2">Supplier 2</option>
          </select>

          <select
            value={filters.productType}
            onChange={(e) => onFilterChange('productType', e.target.value)}
            className="border rounded-md px-2 py-1"
          >
            <option value="">All Products</option>
            <option value="shell-on">Shell-on</option>
            <option value="meat">Meat</option>
          </select>
        </div>
      </div>
    </div>
  );
}