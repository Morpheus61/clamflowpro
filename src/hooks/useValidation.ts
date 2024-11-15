import { z } from 'zod';

export const rawMaterialSchema = z.object({
  supplierId: z.string().min(1, 'Supplier is required'),
  weight: z.number()
    .positive('Weight must be greater than 0')
    .max(10000, 'Weight cannot exceed 10,000 kg'),
  photoUrl: z.string().min(1, 'Photo is required')
});

export const processingSchema = z.object({
  lotNumber: z.string().min(1, 'Lot number is required'),
  shellOnWeight: z.number()
    .positive('Shell-on weight must be greater than 0'),
  meatWeight: z.number()
    .positive('Meat weight must be greater than 0'),
  shellWeight: z.number()
    .positive('Shell weight must be greater than 0')
}).refine(data => {
  const totalWeight = data.shellOnWeight + data.meatWeight + data.shellWeight;
  return Math.abs(totalWeight - data.originalWeight) <= 0.1;
}, {
  message: 'Total processed weight must match raw material weight',
  path: ['totalWeight']
});

export const packagingSchema = z.object({
  lotNumber: z.string().min(1, 'Lot number is required'),
  boxNumber: z.string()
    .min(1, 'Box number is required')
    .regex(/^[A-Z]{2}\d{6}$/, 'Box number must be in format: XX000000'),
  productType: z.enum(['shell-on', 'meat'], {
    required_error: 'Product type is required'
  }),
  weight: z.number()
    .positive('Weight must be greater than 0')
    .max(25, 'Weight cannot exceed 25 kg per box')
});