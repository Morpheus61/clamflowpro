import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { ProcessingBatch } from '../db/schema';

export function useProcessingBatches(lotNumber?: string) {
  return useLiveQuery(async () => {
    let query = db.processingBatches.orderBy('date').reverse();
    
    if (lotNumber) {
      query = query.filter(batch => batch.lotNumber === lotNumber);
    }

    const batches = await query.toArray();
    const lots = await db.lots.toArray();
    
    return batches.map(batch => {
      const lot = lots.find(l => l.lotNumber === batch.lotNumber);
      return {
        ...batch,
        lot
      };
    });
  }, [lotNumber]);
}

export async function createProcessingBatch(data: Omit<ProcessingBatch, 'id' | 'status' | 'date' | 'yieldPercentage'>) {
  return await db.transaction('rw', [db.processingBatches, db.lots], async () => {
    const totalOutput = data.shellOnWeight + data.meatWeight;
    const yieldPercentage = (totalOutput / data.boxes.reduce((sum, box) => sum + box.weight, 0)) * 100;

    // Create processing batch
    await db.processingBatches.add({
      ...data,
      date: new Date(),
      status: 'completed',
      yieldPercentage
    });

    // Update lot status to processing
    await db.lots
      .where('lotNumber')
      .equals(data.lotNumber)
      .modify({ status: 'processing' });
  });
}