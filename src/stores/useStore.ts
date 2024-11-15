import { create } from 'zustand';
import dbClient from '../db/client';
import { Fisherman, PurchaseOrder, Lot, Product } from '../types';

interface Store {
  fishermen: Fisherman[];
  purchaseOrders: PurchaseOrder[];
  lots: Lot[];
  products: Product[];
  loading: boolean;
  error: string | null;
  
  fetchFishermen: () => Promise<void>;
  fetchPurchaseOrders: () => Promise<void>;
  fetchLots: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'id'>) => Promise<void>;
  addLot: (lot: Omit<Lot, 'id'>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  fishermen: [],
  purchaseOrders: [],
  lots: [],
  products: [],
  loading: false,
  error: null,

  fetchFishermen: async () => {
    set({ loading: true, error: null });
    try {
      const result = await dbClient.execute('SELECT * FROM fishermen ORDER BY created_at DESC');
      set({ fishermen: result.rows as Fisherman[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchPurchaseOrders: async () => {
    set({ loading: true, error: null });
    try {
      const result = await dbClient.execute('SELECT * FROM purchase_orders ORDER BY created_at DESC');
      set({ purchaseOrders: result.rows as PurchaseOrder[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchLots: async () => {
    set({ loading: true, error: null });
    try {
      const result = await dbClient.execute('SELECT * FROM lots ORDER BY created_at DESC');
      set({ lots: result.rows as Lot[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const result = await dbClient.execute('SELECT * FROM products ORDER BY created_at DESC');
      set({ products: result.rows as Product[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addPurchaseOrder: async (order) => {
    set({ loading: true, error: null });
    try {
      const id = crypto.randomUUID();
      await dbClient.execute({
        sql: `INSERT INTO purchase_orders (id, fisherman_id, date, quantity, price_per_kg, total_amount, status)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [id, order.fishermanId, order.date, order.quantity, order.pricePerKg, order.totalAmount, order.status]
      });
      get().fetchPurchaseOrders();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addLot: async (lot) => {
    set({ loading: true, error: null });
    try {
      const id = crypto.randomUUID();
      await dbClient.execute({
        sql: `INSERT INTO lots (id, purchase_order_id, creation_date, quantity, status)
              VALUES (?, ?, ?, ?, ?)`,
        args: [id, lot.purchaseOrderId, lot.creationDate, lot.quantity, lot.status]
      });
      get().fetchLots();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const id = crypto.randomUUID();
      await dbClient.execute({
        sql: `INSERT INTO products (id, lot_id, type, quantity, processing_date, grade)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [id, product.lotId, product.type, product.quantity, product.processingDate, product.grade]
      });
      get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));