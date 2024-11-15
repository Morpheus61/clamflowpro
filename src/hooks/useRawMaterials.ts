import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useRawMaterials() {
  const data = useLiveQuery(() => db.rawMaterials.toArray());
  const isLoading = data === undefined;

  return {
    data: data || [],
    isLoading
  };
}