import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

interface PackagedProduct {
  id: string;
  lotNumber: string;
  boxNumber: string;
  productType: 'shell-on' | 'meat';
  weight: number;
  packingDate: string;
}

export function usePackagedProducts() {
  return useLiveQuery(async () => {
    const packages = await db.packages.toArray();
    return packages.map(pkg => ({
      id: pkg.id?.toString() || '',
      lotNumber: pkg.batchId.toString(),
      boxNumber: pkg.boxNumber,
      productType: pkg.type,
      weight: pkg.weight,
      packingDate: pkg.date.toISOString()
    }));
  });
}