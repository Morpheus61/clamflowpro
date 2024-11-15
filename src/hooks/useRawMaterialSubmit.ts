import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNotification } from './useNotification';

interface RawMaterialData {
  supplierId: string;
  weight: number;
  date: string;
}

export function useRawMaterialSubmit() {
  const { addNotification } = useNotification();

  const submit = async (data: RawMaterialData) => {
    try {
      const docRef = await addDoc(collection(db, 'rawMaterials'), {
        ...data,
        createdAt: new Date().toISOString(),
        status: 'pending',
        lotNumber: null
      });

      if (!docRef.id) {
        throw new Error('Failed to create document');
      }

      addNotification('success', 'Raw material entry created successfully');
      return true;
    } catch (error) {
      console.error('Error creating raw material entry:', error);
      addNotification('error', 'Failed to create raw material entry');
      throw error;
    }
  };

  return { submit };
}