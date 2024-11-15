import React from 'react';
import { format } from 'date-fns';
import { Scale, Trash2, AlertCircle } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';

export default function ShellWeightList() {
  const { data: shellWeights, error } = useLiveQuery(
    async () => {
      try {
        // Ensure database is open
        if (!db.isOpen()) {
          await db.open();
        }
        return await db.shellWeights.orderBy('date').reverse().toArray();
      } catch (err) {
        console.error('Database error:', err);
        throw err;
      }
    },
    [],
    { data: [], error: null }
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await db.shellWeights.delete(id);
      } catch (err) {
        console.error('Error deleting record:', err);
      }
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div>
            <h3 className="font-medium text-red-800">Error Loading Records</h3>
            <p className="text-sm text-red-700 mt-1">
              There was a problem loading the shell weight records. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!shellWeights) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-[200px]"></div>
            <div className="h-4 bg-gray-200 rounded w-[150px]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (shellWeights.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No shell weight records found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shellWeights.map(record => (
        <div
          key={record.id}
          className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Scale className="h-5 w-5 text-amber-600" />
            <div>
              <div className="font-medium">{record.weight.toFixed(1)} kg</div>
              <div className="text-sm text-gray-500">
                {format(new Date(record.date), 'dd MMM yyyy')}
              </div>
              {record.notes && (
                <div className="text-sm text-gray-500 mt-1">{record.notes}</div>
              )}
            </div>
          </div>
          <button
            onClick={() => record.id && handleDelete(record.id)}
            className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}