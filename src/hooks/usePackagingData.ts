import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function usePackagingData() {
  const data = useLiveQuery(async () => {
    try {
      // Ensure database is open
      if (!db.isOpen()) {
        await db.open();
      }
      return await db.packages.toArray();
    } catch (error) {
      console.error('Error fetching packaging data:', error);
      return [];
    }
  }, [], []);

  return {
    data: data || [],
    isLoading: data === undefined
  };
}