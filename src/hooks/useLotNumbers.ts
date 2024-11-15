import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useLotNumbers(status?: 'pending' | 'processing' | 'completed', requireDepuration = false) {
  return useLiveQuery(async () => {
    let query = db.lots.orderBy('createdAt').reverse();
    
    if (status) {
      query = query.filter(lot => lot.status === status);
    }

    const lots = await query.toArray();
    
    // Filter lots based on depuration status if required
    const filteredLots = requireDepuration 
      ? lots.filter(lot => lot.depurationData?.status === 'completed')
      : lots;

    const rawMaterials = await db.rawMaterials.toArray();
    const suppliers = await db.suppliers.toArray();
    const supplierMap = new Map(suppliers.map(s => [s.id, s.name]));

    return filteredLots.map(lot => ({
      lotNumber: lot.lotNumber,
      status: lot.status,
      createdAt: lot.createdAt,
      totalWeight: lot.totalWeight,
      depurationStatus: lot.depurationData?.status || 'pending',
      depurationCompletedAt: lot.depurationData?.completedAt,
      suppliers: rawMaterials
        .filter(rm => rm.lotNumber === lot.lotNumber)
        .map(rm => supplierMap.get(rm.supplierId) || 'Unknown')
        .filter((v, i, a) => a.indexOf(v) === i)
    }));
  }, [status, requireDepuration]);
}