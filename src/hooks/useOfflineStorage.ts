import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useFirebase } from '../components/providers/FirebaseProvider';

interface OfflineData {
  pendingUploads: {
    id: string;
    type: 'rawMaterial' | 'processing' | 'packaging';
    data: any;
    timestamp: string;
  }[];
  addPendingUpload: (type: 'rawMaterial' | 'processing' | 'packaging', data: any) => void;
  removePendingUpload: (id: string) => void;
  getPendingUploads: () => void;
}

export const useOfflineStorage = create<OfflineData>()(
  persist(
    (set, get) => ({
      pendingUploads: [],
      addPendingUpload: (type, data) => set(state => ({
        pendingUploads: [...state.pendingUploads, {
          id: crypto.randomUUID(),
          type,
          data,
          timestamp: new Date().toISOString()
        }]
      })),
      removePendingUpload: (id) => set(state => ({
        pendingUploads: state.pendingUploads.filter(upload => upload.id !== id)
      })),
      getPendingUploads: () => get().pendingUploads
    }),
    {
      name: 'clamflow-offline-storage'
    }
  )
);