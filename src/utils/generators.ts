import { format } from 'date-fns';

export function generatePONumber() {
  const date = new Date();
  const timestamp = format(date, 'yyMMddHHmm');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `PO${timestamp}${random}`;
}

export function generateLotNumber() {
  const date = new Date();
  const timestamp = format(date, 'yyMMddHHmm');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `L${timestamp}${random}`;
}

export function generateBoxNumber(type: 'shell-on' | 'meat') {
  const date = new Date();
  const timestamp = format(date, 'yyMMddHHmm');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  const prefix = type === 'shell-on' ? 'SO' : 'CM';
  return `${prefix}${timestamp}${random}`;
}