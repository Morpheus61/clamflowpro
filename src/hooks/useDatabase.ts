import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import type { Supplier, RawMaterial, Lot, ProcessingBatch, ProductGrade } from '../db/schema';

// Suppliers
export function useSuppliers() {
  return useLiveQuery(() => db.suppliers.toArray());
}

export async function addSupplier(supplier: Omit<Supplier, 'id'>) {
  return await db.suppliers.add(supplier);
}

// Raw Materials
export function useRawMaterials(options?: { status?: 'pending' | 'assigned' }) {
  return useLiveQuery(async () => {
    let query = db.rawMaterials.orderBy('date').reverse();
    
    if (options?.status) {
      query = query.filter(rm => rm.status === options.status);
    }
    
    const materials = await query.toArray();
    const suppliers = await db.suppliers.toArray();
    
    return materials.map(material => ({
      ...material,
      supplier: suppliers.find(s => s.id === material.supplierId)
    }));
  }, [options?.status]);
}

export async function addRawMaterial(material: Omit<RawMaterial, 'id' | 'status' | 'lotNumber'>) {
  return await db.rawMaterials.add({
    ...material,
    status: 'pending',
    lotNumber: null
  });
}

// Lots
export function useLots(options?: { status?: 'pending' | 'processing' | 'completed' }) {
  return useLiveQuery(async () => {
    let query = db.lots.orderBy('createdAt').reverse();
    
    if (options?.status) {
      query = query.filter(lot => lot.status === options.status);
    }
    
    const lots = await query.toArray();
    const materials = await db.rawMaterials.toArray();
    const suppliers = await db.suppliers.toArray();
    
    return lots.map(lot => ({
      ...lot,
      receipts: materials
        .filter(m => m.lotNumber === lot.lotNumber)
        .map(m => ({
          ...m,
          supplier: suppliers.find(s => s.id === m.supplierId)
        }))
    }));
  }, [options?.status]);
}

export async function createLot(data: {
  receipts: number[];
  totalWeight: number;
  notes?: string;
}) {
  const lotNumber = `L${new Date().toISOString().slice(2,10).replace(/-/g,'')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  
  return await db.transaction('rw', [db.lots, db.rawMaterials], async () => {
    // Create lot
    await db.lots.add({
      lotNumber,
      receiptIds: data.receipts,
      totalWeight: data.totalWeight,
      notes: data.notes,
      status: 'pending',
      createdAt: new Date()
    });

    // Update receipt statuses
    await Promise.all(
      data.receipts.map(id =>
        db.rawMaterials
          .where('id')
          .equals(id)
          .modify({ lotNumber, status: 'assigned' })
      )
    );

    return lotNumber;
  });
}

// Processing Batches
export function useProcessingBatches() {
  return useLiveQuery(() => db.processingBatches.orderBy('date').reverse().toArray());
}

export async function addProcessingBatch(batch: Omit<ProcessingBatch, 'id' | 'status' | 'date' | 'yieldPercentage'>) {
  const totalInput = batch.shellOnWeight + batch.meatWeight + batch.shellWeight;
  const yieldPercentage = ((batch.shellOnWeight + batch.meatWeight) / totalInput) * 100;

  return await db.transaction('rw', [db.processingBatches, db.lots], async () => {
    // Create processing batch
    await db.processingBatches.add({
      ...batch,
      date: new Date(),
      status: 'completed',
      yieldPercentage
    });

    // Update lot status
    await db.lots
      .where('lotNumber')
      .equals(batch.lotNumber)
      .modify({ status: 'processing' });
  });
}

// Product Grades
export function useProductGrades(type?: 'shell-on' | 'meat') {
  return useLiveQuery(async () => {
    let query = db.productGrades;
    
    if (type) {
      query = query.where('productType').equals(type);
    }
    
    return query.toArray();
  }, [type]);
}

export async function addProductGrade(grade: Omit<ProductGrade, 'id'>) {
  return await db.productGrades.add(grade);
}