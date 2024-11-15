import { db } from '../db';
import { useOfflineStorage } from './useOfflineStorage';

export function useRawMaterialSubmit() {
  const addPendingUpload = useOfflineStorage(state => state.addPendingUpload);

  return {
    mutate: async (data: any) => {
      try {
        await db.rawMaterials.add(data);
      } catch (error) {
        // Store for offline sync
        addPendingUpload('rawMaterial', data);
        throw error;
      }
    }
  };
}

export function useProcessingSubmit() {
  const addPendingUpload = useOfflineStorage(state => state.addPendingUpload);

  return {
    mutate: async (data: any) => {
      try {
        await db.processingBatches.add(data);
      } catch (error) {
        addPendingUpload('processing', data);
        throw error;
      }
    }
  };
}

export function usePackagingSubmit() {
  const addPendingUpload = useOfflineStorage(state => state.addPendingUpload);

  return {
    mutate: async (data: any) => {
      try {
        await db.packages.add(data);
      } catch (error) {
        addPendingUpload('packaging', data);
        throw error;
      }
    }
  };
}