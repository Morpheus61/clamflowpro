import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useProcessingData() {
  const data = useLiveQuery(() => db.processingBatches.toArray());
  const isLoading = data === undefined;

  return {
    data: data || [],
    isLoading
  };
}