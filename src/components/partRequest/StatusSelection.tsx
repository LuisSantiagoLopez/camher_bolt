import React from 'react';
import { UserRole, RequestStatus } from '../../types';

interface Props {
  userRole: UserRole;
  currentStatus: RequestStatus;
  onSelect: (status: RequestStatus) => void;
}

const StatusSelection: React.FC<Props> = ({ userRole, currentStatus, onSelect }) => {
  const getAvailableStatuses = () => {
    // For edit modes, return appropriate status ranges
    if (currentStatus.startsWith('status_0_')) {
      switch (currentStatus) {
        case 'status_0_1': // Taller edit mode
          return [
            { value: 'status_1', label: 'Reporte de Falla' },
            { value: 'status_2', label: 'Orden de Trabajo' },
            { value: 'status_3', label: 'Solicitud de Partes' },
            { value: 'status_4', label: 'Autorización de Partes' },
            { value: 'status_5', label: 'Pendiente Administrador' },
            { value: 'status_6', label: 'Pendiente Proveedor' }
          ];
        
        case 'status_0_2': // Proveedor edit mode
          return [
            { value: 'status_1', label: 'Reporte de Falla' },
            { value: 'status_2', label: 'Orden de Trabajo' },
            { value: 'status_3', label: 'Solicitud de Partes' },
            { value: 'status_4', label: 'Autorización de Partes' },
            { value: 'status_5', label: 'Pendiente Administrador' },
            { value: 'status_6', label: 'Pendiente Proveedor' },
            { value: 'status_7', label: 'Verificación de Partes' },
            { value: 'status_8', label: 'Subir Factura' },
            { value: 'status_9', label: 'Número de Factura' },
            { value: 'status_10', label: 'Aprobación Contador Jr' }
          ];
        
        case 'status_0_3': // Admin edit mode
        case 'status_0_4': // Contador edit mode
          return [
            { value: 'status_minus_1', label: 'Cancelada' },
            { value: 'status_1', label: 'Reporte de Falla' },
            { value: 'status_2', label: 'Orden de Trabajo' },
            { value: 'status_3', label: 'Solicitud de Partes' },
            { value: 'status_4', label: 'Autorización de Partes' },
            { value: 'status_5', label: 'Pendiente Administrador' },
            { value: 'status_6', label: 'Pendiente Proveedor' },
            { value: 'status_7', label: 'Verificación de Partes' },
            { value: 'status_8', label: 'Subir Factura' },
            { value: 'status_9', label: 'Número de Factura' },
            { value: 'status_10', label: 'Aprobación Contador Jr' },
            { value: 'status_11', label: 'Verificación Factura' },
            { value: 'status_12', label: 'Contra Recibo' },
            { value: 'status_13', label: 'Aprobación Final' }
          ];
        
        default:
          return [];
      }
    }

    // For normal status transitions, return next available status(es)
    switch (currentStatus) {
      case 'status_1':
        return [{ value: 'status_2', label: 'Orden de Trabajo' }];
      
      case 'status_2':
        return [{ value: 'status_3', label: 'Solicitud de Partes' }];
      
      case 'status_3':
        return [{ value: 'status_4', label: 'Autorización de Partes' }];
      
      case 'status_4':
        return [
          { value: 'status_5', label: 'Pendiente Administrador' },
          { value: 'status_6', label: 'Pendiente Proveedor' }
        ];
      
      case 'status_5':
        return [
          { value: 'status_6', label: 'Pendiente Proveedor' },
          { value: 'status_0_1', label: 'Devolver a Taller' }
        ];
      
      case 'status_6':
        return [
          { value: 'status_7', label: 'Verificación de Partes' },
          { value: 'status_0_1', label: 'Devolver a Taller' }
        ];
      
      case 'status_7':
        return [
          { value: 'status_8', label: 'Subir Factura' },
          { value: 'status_0_1', label: 'Devolver a Taller' },
          { value: 'status_0_2', label: 'Devolver a Proveedor' },
          { value: 'status_minus_1', label: 'Cancelar con Queja' }
        ];
      
      case 'status_8':
        return [{ value: 'status_9', label: 'Número de Factura' }];
      
      case 'status_9':
        return [{ value: 'status_10', label: 'Aprobación Contador Jr' }];
      
      case 'status_10':
        return [
          { value: 'status_11', label: 'Verificación Factura' },
          { value: 'status_0_2', label: 'Devolver a Proveedor' }
        ];
      
      case 'status_11':
        return [
          { value: 'status_12', label: 'Contra Recibo' },
          { value: 'status_0_2', label: 'Devolver a Proveedor' }
        ];
      
      case 'status_12':
        return [{ value: 'status_13', label: 'Aprobación Final' }];
      
      default:
        return [];
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'status_minus_1':
        return 'La solicitud será cancelada y se deberá llenar un formulario de queja.';
      case 'status_0_1':
        return 'La solicitud volverá a modo de edición para taller.';
      case 'status_0_2':
        return 'La solicitud volverá a modo de edición para proveedor.';
      case 'status_1':
        return 'La solicitud pasará a la fase de reporte de falla para su revisión.';
      case 'status_2':
        return 'La solicitud pasará a la fase de orden de trabajo.';
      case 'status_3':
        return 'Se procederá a la solicitud de partes necesarias.';
      case 'status_4':
        return 'Se requerirá autorización para las partes solicitadas.';
      case 'status_5':
        return 'La solicitud será enviada al administrador para su aprobación (monto > $800 MXN).';
      case 'status_6':
        return 'La solicitud será enviada al proveedor para su revisión y aprobación.';
      case 'status_7':
        return 'El taller deberá verificar la recepción correcta de las partes.';
      case 'status_8':
        return 'El proveedor deberá subir la factura correspondiente.';
      case 'status_9':
        return 'El proveedor deberá ingresar el número de factura.';
      case 'status_10':
        return 'La factura será enviada al contador jr para su aprobación.';
      case 'status_11':
        return 'El contador jr verificará el número de factura ingresado.';
      case 'status_12':
        return 'El contador jr deberá subir el contra recibo.';
      case 'status_13':
        return 'La solicitud será aprobada finalmente por el contador.';
      default:
        return '';
    }
  };

  const availableStatuses = getAvailableStatuses();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Seleccionar Nuevo Estado
      </h3>
      
      <p className="text-sm text-gray-500">
        Selecciona el estado al que deseas mover la solicitud.
      </p>

      <div className="space-y-2">
        {availableStatuses.map((status) => (
          <button
            key={status.value}
            type="button"
            onClick={() => onSelect(status.value as RequestStatus)}
            className={`w-full p-4 text-left border rounded-lg transition-colors ${
              currentStatus === status.value
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-300 hover:bg-primary-50'
            }`}
          >
            <div className="font-medium text-gray-900">
              {status.label}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {getStatusDescription(status.value)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusSelection;