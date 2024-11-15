import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Firestore, enableIndexedDbPersistence } from '@firebase/firestore';
import { Storage } from '@firebase/storage';
import { Analytics } from '@firebase/analytics';
import { db, storage, analytics } from '../../lib/firebase';

interface FirebaseContextType {
  db: Firestore;
  storage: Storage;
  analytics: Analytics | null;
  initialized: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeFirestore = async () => {
      try {
        await enableIndexedDbPersistence(db);
        console.log('Offline persistence enabled');
      } catch (err: any) {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence enabled in first tab only');
        } else if (err.code === 'unimplemented') {
          console.warn('Browser doesn\'t support persistence');
        }
      } finally {
        setInitialized(true);
      }
    };

    initializeFirestore();
  }, []);

  const value = React.useMemo(() => ({
    db,
    storage,
    analytics,
    initialized
  }), [initialized]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing app...</p>
        </div>
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}