import React from 'react';
import { RequestStatus } from '../types';
import { AlertTriangle, Clock, FileCheck, FileText, CheckCircle, XCircle, AlertCircle, User, Truck, PenTool as Tool, DollarSign, FileSpreadsheet } from 'lucide-react';

interface Props {
  status: RequestStatus;
}

const StatusBadge: React.FC<Props> = ({ status }) => {
  const getStatusInfo = (status: RequestStatus) => {
    switch (status) {
      case 'status_minus_1':
        return {
          text: 'Cancelada',
          color: 'bg-red-100 text-red-800',
          icon: <XCircle className="h-4 w-4" />,
          description: 'La solicitud fue cancelada y se llenó un formulario de queja.'
        };
      case 'status_0_1':
        return {
          text: 'En edición (Taller)',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-4 w-4" />,
          description: 'La solicitud está siendo editada por el taller.'
        };
      case 'status_0_2':
        return {
          text: 'En edición (Proveedor)',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-4 w-4" />,
          description: 'La solicitud está siendo editada por el proveedor.'
        };
      case 'status_0_3':
        return {
          text: 'En edición (Administrador)',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-4 w-4" />,
          description: 'La solicitud está siendo editada por el administrador.'
        };
      case 'status_0_4':
        return {
          text: 'En edición (Contador)',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-4 w-4" />,
          description: 'La solicitud está siendo editada por el contador.'
        };
      case 'status_1':
        return {
          text: 'Reporte de Falla',
          color: 'bg-blue-100 text-blue-800',
          icon: <AlertCircle className="h-4 w-4" />,
          description: 'Se ha reportado una falla y se está esperando confirmación del taller.'
        };
      case 'status_2':
        return {
          text: 'Orden de Trabajo',
          color: 'bg-blue-100 text-blue-800',
          icon: <Tool className="h-4 w-4" />,
          description: 'La orden de trabajo ha sido creada y está pendiente de confirmación.'
        };
      case 'status_3':
        return {
          text: 'Solicitud de Partes',
          color: 'bg-blue-100 text-blue-800',
          icon: <Truck className="h-4 w-4" />,
          description: 'Se han solicitado las partes necesarias y está pendiente de confirmación.'
        };
      case 'status_4':
        return {
          text: 'Autorización de Partes',
          color: 'bg-blue-100 text-blue-800',
          icon: <User className="h-4 w-4" />,
          description: 'Las partes están pendientes de autorización.'
        };
      case 'status_5':
        return {
          text: 'Pendiente Administrador',
          color: 'bg-orange-100 text-orange-800',
          icon: <AlertTriangle className="h-4 w-4" />,
          description: 'La solicitud requiere aprobación del administrador (orden > $800 MXN).'
        };
      case 'status_6':
        return {
          text: 'Pendiente Proveedor',
          color: 'bg-orange-100 text-orange-800',
          icon: <Clock className="h-4 w-4" />,
          description: 'La solicitud está pendiente de aprobación por el proveedor.'
        };
      case 'status_7':
        return {
          text: 'Verificación de Partes',
          color: 'bg-purple-100 text-purple-800',
          icon: <FileCheck className="h-4 w-4" />,
          description: 'El taller debe verificar la recepción correcta de las partes.'
        };
      case 'status_8':
        return {
          text: 'Subir Factura',
          color: 'bg-indigo-100 text-indigo-800',
          icon: <FileText className="h-4 w-4" />,
          description: 'El proveedor debe subir la factura correspondiente.'
        };
      case 'status_9':
        return {
          text: 'Número de Factura',
          color: 'bg-indigo-100 text-indigo-800',
          icon: <FileText className="h-4 w-4" />,
          description: 'El proveedor debe ingresar el número de factura.'
        };
      case 'status_10':
        return {
          text: 'Aprobación Contador Jr',
          color: 'bg-pink-100 text-pink-800',
          icon: <DollarSign className="h-4 w-4" />,
          description: 'La factura está pendiente de aprobación por el contador jr.'
        };
      case 'status_11':
        return {
          text: 'Verificación Factura',
          color: 'bg-pink-100 text-pink-800',
          icon: <FileCheck className="h-4 w-4" />,
          description: 'El contador jr debe verificar el número de factura.'
        };
      case 'status_12':
        return {
          text: 'Contra Recibo',
          color: 'bg-green-100 text-green-800',
          icon: <FileSpreadsheet className="h-4 w-4" />,
          description: 'Se debe subir el contra recibo.'
        };
      case 'status_13':
        return {
          text: 'Aprobación Final',
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="h-4 w-4" />,
          description: 'La solicitud ha sido completamente aprobada.'
        };
      default:
        return {
          text: 'Desconocido',
          color: 'bg-gray-100 text-gray-800',
          icon: null,
          description: 'Estado desconocido'
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="group relative inline-block">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.icon && <span className="mr-1">{statusInfo.icon}</span>}
        {statusInfo.text}
      </span>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-10 w-64 p-2 mt-2 bg-black text-white text-xs rounded shadow-lg">
        {statusInfo.description}
      </div>
    </div>
  );
};

export default StatusBadge;