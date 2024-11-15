import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useFishermen() {
  return useLiveQuery(() => db.suppliers.toArray());
}

export function useRawMaterials() {
  return useLiveQuery(() => db.rawMaterials.toArray());
}

export function useProcessingBatches() {
  return useLiveQuery(() => db.processingBatches.toArray());
}

export function usePackages() {
  return useLiveQuery(() => db.packages.toArray());
}

export function useLotNumbers() {
  return useLiveQuery(() => 
    db.rawMaterials
      .orderBy('lotNumber')
      .uniqueKeys()
  );
}