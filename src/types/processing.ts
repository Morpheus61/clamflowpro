export interface BoxEntry {
  id: string;
  type: 'shell-on' | 'meat';
  weight: string;
  boxNumber: string;
  grade: string;
}

export interface ProcessingBatch {
  lotNumber: string;
  shellOnWeight: number;
  meatWeight: number;
  boxes: Array<{
    type: 'shell-on' | 'meat';
    weight: number;
    boxNumber: string;
    grade: string;
  }>;
  date: Date;
  status: 'pending' | 'completed';
  yieldPercentage: number;
}