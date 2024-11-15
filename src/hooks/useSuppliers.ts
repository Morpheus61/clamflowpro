import { collection, getDocs } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { db } from '../lib/firebase';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  licenseNumber: string;
}

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, 'suppliers'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Supplier[];
    }
  });
}