export interface PurchaseOrder {
  id: string;
  fishermanId: string;
  date: string;
  quantity: number;
  pricePerKg: number;
  totalAmount: number;
  status: 'pending' | 'received' | 'completed';
}

export interface Lot {
  id: string;
  purchaseOrderId: string;
  creationDate: string;
  initialWeight: number;
  status: 'processing' | 'completed';
}

export interface Product {
  id: string;
  lotId: string;
  type: 'shell-on' | 'meat';
  weight: number;
  processingDate: string;
  yield: number;
}

export interface Fisherman {
  id: string;
  name: string;
  contact: string;
  totalSupplied: number;
}