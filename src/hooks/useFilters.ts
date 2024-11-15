import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterState {
  dateRange: [Date | null, Date | null];
  status: string;
  supplier: string;
  productType: string;
  setDateRange: (range: [Date | null, Date | null]) => void;
  setFilter: (key: 'status' | 'supplier' | 'productType', value: string) => void;
  resetFilters: () => void;
}

export const useFilters = create<FilterState>()(
  persist(
    (set) => ({
      dateRange: [null, null],
      status: '',
      supplier: '',
      productType: '',
      setDateRange: (range) => set({ dateRange: range }),
      setFilter: (key, value) => set({ [key]: value }),
      resetFilters: () => set({
        dateRange: [null, null],
        status: '',
        supplier: '',
        productType: ''
      })
    }),
    {
      name: 'clamflow-filters'
    }
  )
);