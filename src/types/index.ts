export interface Supplier {
  id?: string;
  name: string;
  contact: string;
  licenseNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawMaterial {
  id?: string;
  supplierId: string;
  weight: number;
  date: string;
  status: 'pending' | 'assigned';
  lotNumber: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lot {
  id?: string;
  lotNumber: string;
  totalWeight: number;
  status: 'pending' | 'processing' | 'completed';
  depurationData?: {
    status: 'pending' | 'in-progress' | 'completed';
    tankNumber: string;
    startTime: string;
    completedAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProcessingBatch {
  id?: string;
  lotNumber: string;
  shellOnWeight: number;
  meatWeight: number;
  boxes: Array<{
    type: 'shell-on' | 'meat';
    weight: number;
    boxNumber: string;
    grade: string;
  }>;
  yieldPercentage: number;
  status: 'pending' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductGrade {
  id?: string;
  code: string;
  name: string;
  description: string;
  productType: 'shell-on' | 'meat';
  createdAt?: string;
  updatedAt?: string;
}