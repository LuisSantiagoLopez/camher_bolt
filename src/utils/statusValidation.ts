import { RequestStatus, UserRole } from '../types';

export const canTransitionToStatus = (
  currentStatus: RequestStatus,
  newStatus: RequestStatus,
  userRole: UserRole,
  totalAmount?: number
): boolean => {
  // Special case for edit modes
  if (currentStatus.startsWith('status_0_')) {
    return canTransitionFromEditMode(currentStatus, newStatus, userRole);
  }

  // Handle normal status transitions
  switch (currentStatus) {
    case 'status_1':
      return ['status_2'].includes(newStatus);
    case 'status_2':
      return ['status_3'].includes(newStatus);
    case 'status_3':
      return ['status_4'].includes(newStatus);
    case 'status_4':
      // If amount > 800, must go to admin (status_5), otherwise to provider (status_6)
      return totalAmount && totalAmount > 800 
        ? ['status_5'].includes(newStatus)
        : ['status_6'].includes(newStatus);
    case 'status_5':
      return ['status_6', 'status_0_1'].includes(newStatus);
    case 'status_6':
      return ['status_7', 'status_0_1'].includes(newStatus);
    case 'status_7':
      return ['status_8', 'status_0_1', 'status_0_2', 'status_minus_1'].includes(newStatus);
    case 'status_8':
      return ['status_9'].includes(newStatus);
    case 'status_9':
      return ['status_10'].includes(newStatus);
    case 'status_10':
      return ['status_11', 'status_0_2'].includes(newStatus);
    case 'status_11':
      return ['status_12', 'status_0_2'].includes(newStatus);
    case 'status_12':
      return ['status_13'].includes(newStatus);
    case 'status_13':
      return false; // Final status, no further transitions
    default:
      return false;
  }
};

const canTransitionFromEditMode = (
  currentStatus: RequestStatus,
  newStatus: RequestStatus,
  userRole: UserRole
): boolean => {
  switch (currentStatus) {
    case 'status_0_1': // Taller edit mode
      return ['status_1', 'status_2', 'status_3', 'status_4', 'status_5', 'status_6'].includes(newStatus);
    case 'status_0_2': // Provider edit mode
      return ['status_1', 'status_2', 'status_3', 'status_4', 'status_5', 'status_6', 'status_7', 'status_8', 'status_9', 'status_10'].includes(newStatus);
    case 'status_0_3': // Admin edit mode
    case 'status_0_4': // Contador edit mode
      return true; // Can transition to any status
    default:
      return false;
  }
};