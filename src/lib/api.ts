import { db } from '../db';
import type { Supplier, RawMaterial, ProcessingBatch, Package } from '../types';

// Supplier operations
export async function getSuppliers() {
  return await db.suppliers.toArray();
}

export async function addSupplier(supplier: Omit<Supplier, 'id'>) {
  return await db.suppliers.add(supplier);
}

// Raw Material operations
export async function getRawMaterials() {
  return await db.rawMaterials.toArray();
}

export async function addRawMaterial(material: Omit<RawMaterial, 'id'>) {
  return await db.rawMaterials.add(material);
}

// Processing operations
export async function getProcessingBatches() {
  return await db.processingBatches.toArray();
}

export async function addProcessingBatch(batch: Omit<ProcessingBatch, 'id'>) {
  return await db.processingBatches.add(batch);
}

// Package operations
export async function getPackages() {
  return await db.packages.toArray();
}

export async function addPackage(pkg: Omit<Package, 'id'>) {
  return await db.packages.add(pkg);
}

// Utility function to generate QR code data
export function generateQRData(packageData: Omit<Package, 'id' | 'qrCode'>) {
  return JSON.stringify({
    type: packageData.type,
    weight: packageData.weight,
    batchId: packageData.batchId,
    date: packageData.date.toISOString()
  });
}