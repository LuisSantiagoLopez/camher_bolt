import React from 'react';
import { UserRole, RequestStatus } from '../../types';

interface Props {
  status: RequestStatus;
  userRole: UserRole;
}

const EditMessage: React.FC<Props> = ({ status, userRole }) => {
  const getMessage = () => {
    switch (userRole) {
      case 'taller':
        return 'Como taller, puedes editar los detalles de la solicitud y seleccionar un nuevo estado. Solo podrás seleccionar estados del 1 al 6. Asegúrate de revisar cuidadosamente los cambios necesarios.';
      
      case 'taller_jr':
        return 'Como taller jr, puedes editar los detalles de la solicitud y seleccionar un nuevo estado. Solo podrás seleccionar estados del 1 al 6. Asegúrate de revisar cuidadosamente los cambios necesarios.';
      
      case 'proveedor':
        return 'Como proveedor, puedes editar los detalles relacionados con las partes y precios. Podrás seleccionar un nuevo estado entre las opciones 1 a 10.';
      
      case 'administrador':
        return 'Como administrador, tienes acceso completo para editar la solicitud y seleccionar cualquier estado. Por favor, verifica que los cambios sean apropiados.';
      
      case 'contador':
      case 'contador_jr':
        return 'Como contador, puedes editar los detalles financieros y seleccionar cualquier estado. Asegúrate de que toda la información contable sea correcta.';
      
      default:
        return 'Por favor, revisa y edita la información necesaria.';
    }
  };

  const getStatusSpecificMessage = () => {
    switch (status) {
      case 'status_minus_1':
        return 'La solicitud ha sido cancelada y se ha registrado una queja. Este estado es final y no puede ser modificado.';
      
      case 'status_0_1':
        return 'La solicitud está en modo de edición para taller. Revisa los detalles y selecciona el estado al que debe volver (estados 1-6).';
      
      case 'status_0_2':
        return 'La solicitud está en modo de edición para proveedor. Verifica los detalles de las partes y precios (estados 1-10).';
      
      case 'status_0_3':
        return 'La solicitud está en modo de edición para administrador. Puedes revisar y modificar todos los aspectos de la solicitud.';
      
      case 'status_0_4':
        return 'La solicitud está en modo de edición para contador. Verifica los detalles financieros y documentación.';
      
      case 'status_1':
        return 'Reporte de falla pendiente de revisión por taller. Verifica los detalles iniciales del problema.';
      
      case 'status_2':
        return 'Orden de trabajo pendiente de revisión por taller. Verifica los detalles del trabajo mecánico.';
      
      case 'status_3':
        return 'Solicitud de partes pendiente de revisión por taller. Verifica la lista de partes requeridas.';
      
      case 'status_4':
        return 'Autorización de partes pendiente. Si el monto es mayor a $800 MXN, pasará a administrador (status 5), si no, irá al proveedor (status 6).';
      
      case 'status_5':
        return 'Pendiente de aprobación por administrador debido a que el monto es mayor a $800 MXN.';
      
      case 'status_6':
        return 'Pendiente de aprobación por proveedor. El proveedor debe revisar y confirmar la solicitud.';
      
      case 'status_7':
        return 'Pendiente de verificación de partes por taller. Confirma que todas las partes fueron recibidas correctamente.';
      
      case 'status_8':
        return 'Pendiente de carga de factura por proveedor. El proveedor debe subir la factura correspondiente.';
      
      case 'status_9':
        return 'Pendiente de ingreso de número de factura por proveedor.';
      
      case 'status_10':
        return 'Pendiente de aprobación de factura por contador jr.';
      
      case 'status_11':
        return 'Pendiente de verificación de número de factura por contador jr.';
      
      case 'status_12':
        return 'Pendiente de carga de contra recibo por contador jr.';
      
      case 'status_13':
        return 'Solicitud completada y aprobada. Este estado es final.';
      
      default:
        return '';
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-6">
      <p className="text-sm text-gray-700">
        {getMessage()}
      </p>
      <p className="text-sm text-gray-600 border-t border-gray-200 pt-3">
        {getStatusSpecificMessage()}
      </p>
    </div>
  );
};

export default EditMessage;