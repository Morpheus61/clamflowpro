import { where } from 'firebase/firestore';
import { useCollection } from './useFirestore';
import type { Lot } from '../types';

export function useLots(status?: string) {
  const constraints = status ? [where('status', '==', status)] : [];
  return useCollection<Lot>('lots', constraints);
}

export function useDepuratedLots() {
  return useCollection<Lot>('lots', [
    where('depurationData.status', '==', 'completed')
  ]);
}