import { UserRole } from '../types';

export const canCreateUnit = (userRole: UserRole): boolean => {
  return ['taller', 'taller_jr', 'administrador'].includes(userRole);
};

export const canSelectProvider = (userRole: UserRole): boolean => {
  return ['taller', 'taller_jr', 'administrador'].includes(userRole);
};

export const canViewInvoices = (userRole: UserRole): boolean => {
  return ['administrador', 'contador', 'contador_jr', 'proveedor'].includes(userRole);
};

export const canUploadFiles = (userRole: UserRole): boolean => {
  return ['taller', 'taller_jr', 'proveedor', 'contador', 'contador_jr'].includes(userRole);
};

export const canEditRequest = (userRole: UserRole, createdBy: string, userId: string): boolean => {
  switch (userRole) {
    case 'taller':
      return true; // Taller can edit all requests
    case 'taller_jr':
      return createdBy === userId; // Taller Jr can only edit their own requests
    case 'proveedor':
      return true; // Proveedor can edit assigned requests (filtered in queries)
    case 'administrador':
    case 'contador':
    case 'contador_jr':
      return true; // These roles can edit all requests
    default:
      return false;
  }
};