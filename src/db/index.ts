import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Collection names
const COLLECTIONS = {
  SUPPLIERS: 'suppliers',
  RAW_MATERIALS: 'rawMaterials',
  LOTS: 'lots',
  PROCESSING_BATCHES: 'processingBatches',
  SHELL_WEIGHTS: 'shellWeights',
  PACKAGES: 'packages',
  PRODUCT_GRADES: 'productGrades'
};

// Generic CRUD operations
export async function getAll(collectionName: string) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function add(collectionName: string, data: any) {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function update(collectionName: string, id: string, data: any) {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export async function remove(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}

// Export collection names
export { COLLECTIONS };