import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { ShellWeight } from '../db/schema';

export function useShellWeights() {
  return useLiveQuery(() => 
    db.shellWeights
      .orderBy('date')
      .reverse()
      .toArray()
  );
}

export async function addShellWeight(data: Omit<ShellWeight, 'id' | 'createdAt'>) {
  return await db.shellWeights.add({
    ...data,
    createdAt: new Date()
  });
}

export async function deleteShellWeight(id: number) {
  return await db.shellWeights.delete(id);
}