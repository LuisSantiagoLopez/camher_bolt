import { PartRequest } from '../types';

export const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', ...ALLOWED_IMAGE_TYPES];

export const validateAmountTransition = (amount: number): string | null => {
  if (amount <= 0) {
    return 'El monto debe ser mayor a 0';
  }

  // For status 4->5 transition, validate amount is > 800
  if (amount <= 800) {
    return 'El monto debe ser mayor a $800 MXN para requerir aprobación del administrador';
  }

  return null;
};

export const validateFileUpload = (file: File, allowedTypes: string[], maxSize = FILE_SIZE_LIMIT): string | null => {
  if (!allowedTypes.includes(file.type)) {
    return 'Tipo de archivo no permitido';
  }
  
  if (file.size > maxSize) {
    return 'El archivo excede el tamaño máximo permitido (10MB)';
  }

  return null;
};

export const validateInvoiceNumber = (number: string): string | null => {
  // Format: LETTER-NUMBER (e.g., A-123456)
  const invoiceNumberRegex = /^[A-Z]-\d{6}$/;
  
  if (!invoiceNumberRegex.test(number)) {
    return 'El número de factura debe tener el formato: LETRA-NÚMERO (ej: A-123456)';
  }

  return null;
};

export const validatePartCost = (cost: number): string | null => {
  if (cost <= 0) {
    return 'El costo debe ser mayor a 0';
  }
  
  if (cost > 1000000) {
    return 'El costo excede el límite permitido';
  }

  return null;
};

export const validatePartQuantity = (quantity: number): string | null => {
  if (!Number.isInteger(quantity)) {
    return 'La cantidad debe ser un número entero';
  }
  
  if (quantity < 1) {
    return 'La cantidad debe ser al menos 1';
  }
  
  if (quantity > 1000) {
    return 'La cantidad excede el límite permitido';
  }

  return null;
};

export const validateWeeklyTableDates = (startDate: string, endDate: string): string | null => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start > end) {
    return 'La fecha de inicio debe ser anterior a la fecha de fin';
  }
  
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 7) {
    return 'El período no puede ser mayor a 7 días';
  }

  return null;
};

export const validateStatusTransition = (currentStatus: string, newStatus: string, userRole: string): string | null => {
  // Add validation logic for status transitions based on user role
  const allowedTransitions: Record<string, string[]> = {
    'status_4': ['status_5', 'status_6'], // From Authorization, validate amount
    'status_10': ['status_11', 'status_0_2'], // From Contador Jr approval
    'status_11': ['status_12', 'status_0_2'], // From Invoice verification
    'status_12': ['status_13'], // From Counter receipt
    'status_13': [] // Final status
  };

  if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
    return 'Transición de estado no permitida';
  }

  return null;
};