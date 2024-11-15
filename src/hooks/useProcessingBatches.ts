import { where } from 'firebase/firestore';
import { useCollection } from './useFirestore';
import type { ProcessingBatch } from '../types';

export function useProcessingBatches(lotNumber?: string) {
  const constraints = lotNumber ? [where('lotNumber', '==', lotNumber)] : [];
  return useCollection<ProcessingBatch>('processingBatches', constraints);
}