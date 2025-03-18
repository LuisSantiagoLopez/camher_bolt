import React from 'react';
import { PartRequest } from '../../types';
import StatusBadge from '../StatusBadge';
import { useAuthStore } from '../../store/auth';

interface Props {
  requests: PartRequest[];
  visibleStatuses: string[];
  onRefresh: () => void;
  onEdit?: (request: PartRequest) => void;
  onPartValidation?: (request: PartRequest) => void;
  onInvoiceUpload?: (request: PartRequest) => void;
  onInvoiceNumber?: (request: PartRequest) => void;
  onInvoiceApproval?: (request: PartRequest) => void;
  onInvoiceVerification?: (request: PartRequest) => void;
  onCounterReceipt?: (request: PartRequest) => void;
}

const PartRequestList: React.FC<Props> = ({
  requests,
  visibleStatuses,
  onRefresh,
  onEdit,
  onPartValidation,
  onInvoiceUpload,
  onInvoiceNumber,
  onInvoiceApproval,
  onInvoiceVerification,
  onCounterReceipt
}) => {
  const { user } = useAuthStore();

  const canInteractWithStatus = (request: PartRequest): boolean => {
    if (!user) return false;

    // Administrator can interact with all statuses
    if (user.role === 'administrador') return true;

    switch (request.status) {
      case 'status_minus_1': // Cancelled - only admin can interact
        return false;
      case 'status_1':
      case 'status_2':
      case 'status_3':
      case 'status_4':
        return ['taller', 'taller_jr'].includes(user.role);
      case 'status_5':
        return user.role === 'administrador';
      case 'status_6':
        return user.role === 'proveedor';
      case 'status_7':
        return ['taller', 'taller_jr'].includes(user.role);
      case 'status_8':
      case 'status_9':
        return user.role === 'proveedor';
      case 'status_10':
      case 'status_11':
      case 'status_12':
        return user.role === 'contador_jr';
      case 'status_13':
        return user.role === 'contador';
      default:
        return false;
    }
  };

  const handleAction = (request: PartRequest) => {
    if (!user || !canInteractWithStatus(request)) return;

    // Special handling for administrators
    if (user.role === 'administrador') {
      if (request.status === 'status_5') {
        if (onEdit) onEdit(request);
      } else {
        if (onEdit) onEdit(request);
      }
      return;
    }

    // Normal handling for other roles
    switch (request.status) {
      case 'status_6':
        if (user.role === 'proveedor' && onEdit) {
          onEdit(request);
        }
        break;
      case 'status_7':
        if (['taller', 'taller_jr'].includes(user.role) && onPartValidation) {
          onPartValidation(request);
        }
        break;
      case 'status_8':
        if (user.role === 'proveedor' && onInvoiceUpload) {
          onInvoiceUpload(request);
        }
        break;
      case 'status_9':
        if (user.role === 'proveedor' && onInvoiceNumber) {
          onInvoiceNumber(request);
        }
        break;
      case 'status_10':
        if (user.role === 'contador_jr' && onInvoiceApproval) {
          onInvoiceApproval(request);
        }
        break;
      case 'status_11':
        if (user.role === 'contador_jr' && onInvoiceVerification) {
          onInvoiceVerification(request);
        }
        break;
      case 'status_12':
        if (user.role === 'contador_jr' && onCounterReceipt) {
          onCounterReceipt(request);
          return;
        }
        break;
      default:
        if (onEdit) onEdit(request);
    }
  };

  const getActionText = (request: PartRequest): string | null => {
    if (!canInteractWithStatus(request)) return null;

    // For administrators, always show "Ver detalles" except for status_5
    if (user?.role === 'administrador') {
      if (request.status === 'status_5') {
        return 'Aprobar/Rechazar';
      }
      return 'Ver detalles';
    }

    // For other roles, show specific action text
    switch (request.status) {
      case 'status_6':
        return user?.role === 'proveedor' ? 'Aprobar/Rechazar' : null;
      case 'status_7':
        return ['taller', 'taller_jr'].includes(user?.role || '') ? 'Verificar partes' : null;
      case 'status_8':
        return user?.role === 'proveedor' ? 'Subir factura' : null;
      case 'status_9':
        return user?.role === 'proveedor' ? 'Ingresar número' : null;
      case 'status_10':
        return user?.role === 'contador_jr' ? 'Aprobar factura' : null;
      case 'status_11':
        return user?.role === 'contador_jr' ? 'Verificar factura' : null;
      case 'status_12':
        return user?.role === 'contador_jr' ? 'Subir contra recibo' : null;
      case 'status_13':
        return user?.role === 'contador' ? 'Ver detalles' : null;
      default:
        return ['taller', 'taller_jr'].includes(user?.role || '') ? 'Ver detalles' : null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {request.short_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {(request as any).unit?.name || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={request.status} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {request.problem_description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(request.created_at).toLocaleDateString('es-MX')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getActionText(request) && (
                  <button
                    type="button"
                    onClick={() => handleAction(request)}
                    className="text-primary-600 hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 px-3 py-1 rounded-md"
                  >
                    {getActionText(request)}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartRequestList;