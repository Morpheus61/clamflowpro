import React, { useState } from 'react';
import { Clock, Thermometer, Droplets } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useNotification } from '../../hooks/useNotification';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';

interface DepurationProps {
  lotNumber: string;
}

export default function Depuration({ lotNumber }: DepurationProps) {
  const [formData, setFormData] = useState({
    tankNumber: '',
    temperature: '',
    salinity: ''
  });

  const queryClient = useQueryClient();
  const { addNotification } = useNotification();

  // Get lot details
  const { data: lot } = useQuery({
    queryKey: ['lot', lotNumber],
    queryFn: async () => {
      const docRef = doc(db, 'lots', lotNumber);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() };
    }
  });

  const startDepuration = useMutation({
    mutationFn: async () => {
      const lotRef = doc(db, 'lots', lotNumber);
      await updateDoc(lotRef, {
        'depurationData.status': 'in-progress',
        'depurationData.tankNumber': formData.tankNumber,
        'depurationData.startTime': new Date().toISOString(),
        'depurationData.startReadings': {
          temperature: formData.temperature,
          salinity: formData.salinity
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lot', lotNumber] });
      addNotification('success', 'Depuration process started');
    },
    onError: () => {
      addNotification('error', 'Failed to start depuration process');
    }
  });

  const completeDepuration = useMutation({
    mutationFn: async () => {
      const lotRef = doc(db, 'lots', lotNumber);
      await updateDoc(lotRef, {
        'depurationData.status': 'completed',
        'depurationData.completedAt': new Date().toISOString(),
        'depurationData.endReadings': {
          temperature: formData.temperature,
          salinity: formData.salinity
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lot', lotNumber] });
      addNotification('success', 'Depuration process completed');
    },
    onError: () => {
      addNotification('error', 'Failed to complete depuration process');
    }
  });

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tankNumber || !formData.temperature || !formData.salinity) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }
    startDepuration.mutate();
  };

  const handleComplete = () => {
    if (!formData.temperature || !formData.salinity) {
      addNotification('error', 'Please enter final readings');
      return;
    }
    completeDepuration.mutate();
  };

  if (!lot) {
    return <div>Loading lot details...</div>;
  }

  const isStarted = lot.depurationData?.status === 'in-progress';
  const isCompleted = lot.depurationData?.status === 'completed';
  const startTime = lot.depurationData?.startTime ? new Date(lot.depurationData.startTime) : null;

  const getElapsedTime = () => {
    if (!startTime) return null;
    const now = new Date();
    return {
      hours: differenceInHours(now, startTime),
      minutes: differenceInMinutes(now, startTime) % 60
    };
  };

  const elapsedTime = getElapsedTime();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {isCompleted ? (
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-lg font-medium text-green-900">Depuration Completed</h3>
              <p className="mt-1 text-sm text-green-700">
                Completed at: {format(new Date(lot.depurationData.completedAt), 'PPpp')}
              </p>
            </div>
          </div>
        </div>
      ) : isStarted ? (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-blue-900">Depuration in Progress</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Started: {format(startTime!, 'PPpp')}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Tank Number</div>
                <div className="font-medium">{lot.depurationData.tankNumber}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Elapsed Time</div>
                <div className="font-medium">
                  {elapsedTime ? `${elapsedTime.hours}h ${elapsedTime.minutes}m` : 'Calculating...'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Final Readings</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                  step="0.1"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salinity (ppt)
                </label>
                <input
                  type="number"
                  value={formData.salinity}
                  onChange={(e) => setFormData(prev => ({ ...prev, salinity: e.target.value }))}
                  step="0.1"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
            <button
              onClick={handleComplete}
              className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Complete Depuration
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleStart} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tank Number
            </label>
            <input
              type="text"
              value={formData.tankNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, tankNumber: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Temperature (°C)
              </label>
              <input
                type="number"
                value={formData.temperature}
                onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                step="0.1"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Salinity (ppt)
              </label>
              <input
                type="number"
                value={formData.salinity}
                onChange={(e) => setFormData(prev => ({ ...prev, salinity: e.target.value }))}
                step="0.1"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Start Depuration
          </button>
        </form>
      )}
    </div>
  );
}