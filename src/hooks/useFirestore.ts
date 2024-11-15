import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  QueryConstraint
} from '@firebase/firestore';
import { useFirebase } from '../components/providers/FirebaseProvider';
import { useEffect, useState } from 'react';

// Generic type for Firestore documents
type FirestoreDoc = {
  id?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export function useCollection<T extends FirestoreDoc>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
) {
  const { db } = useFirebase();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      ...queryConstraints,
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, {
      next: (snapshot) => {
        const documents = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as T[];
        setData(documents);
        setLoading(false);
      },
      error: (err) => {
        console.error('Firestore error:', err);
        setError(err);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [db, collectionName, JSON.stringify(queryConstraints)]);

  const add = async (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding document:', err);
      throw err;
    }
  };

  const update = async (id: string, data: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      console.error('Error updating document:', err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error('Error deleting document:', err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    add,
    update,
    remove
  };
}

// Helper function to convert Firestore Timestamp to Date
export function timestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate();
}

// Helper function to convert Date to Firestore Timestamp
export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}