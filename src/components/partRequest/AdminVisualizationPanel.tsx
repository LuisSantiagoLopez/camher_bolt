import React from 'react';
import { X, FileText, Download } from 'lucide-react';
import { PartRequest } from '../../types';
import StatusBadge from '../StatusBadge';

interface Props {
  request: PartRequest;
  onClose: () => void;
  onEdit: () => void;
}

const AdminVisualizationPanel: React.FC<Props> = ({ request, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Solicitud #{request.short_id}
            </h3>
            <StatusBadge status={request.status} />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Reporte de Falla */}
            <section>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Reporte de Falla</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Unidad</label>
                  <p className="mt-1">{request.unit?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Ubicación del Problema</label>
                  <p className="mt-1">{request.problem_location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Operador que Detectó</label>
                  <p className="mt-1">{request.operator_detected}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Ubicación de Partes Dañadas</label>
                  <p className="mt-1">{request.damaged_parts_location}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-500">Descripción del Problema</label>
                  <p className="mt-1">{request.problem_description}</p>
                </div>
              </div>
            </section>

            {/* Orden de Trabajo */}
            <section>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Orden de Trabajo</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Mecánico Asignado</label>
                  <p className="mt-1">{request.assigned_mechanic}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Tipo de Reparación</label>
                  <p className="mt-1">{request.repair_type_other || request.repair_type}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-500">Trabajo Mecánico</label>
                  <p className="mt-1">{request.mechanic_work}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-500">Observaciones</label>
                  <p className="mt-1">{request.observations}</p>
                </div>
              </div>
            </section>

            {/* Solicitud de Partes */}
            <section>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Solicitud de Partes</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {request.parts?.map((part, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{part.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${part.cost.toLocaleString('es-MX')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(part.cost * part.quantity).toLocaleString('es-MX')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Total:</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${request.total_amount?.toLocaleString('es-MX')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="mt-4 flex items-center space-x-6">
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full ${request.is_important ? 'bg-red-500' : 'bg-gray-300'} mr-2`} />
                  <span className="text-sm text-gray-500">Importante</span>
                </div>
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full ${request.is_cash_payment ? 'bg-green-500' : 'bg-gray-300'} mr-2`} />
                  <span className="text-sm text-gray-500">Pago en Efectivo</span>
                </div>
              </div>
            </section>

            {/* Autorización de Partes */}
            <section>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Autorización de Partes</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Proveedor</label>
                  <p className="mt-1">{request.provider?.name}</p>
                </div>
                {request.damage_photo_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Foto del Daño</label>
                    <a
                      href={request.damage_photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-500"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Ver Foto
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Facturación */}
            {(request.invoice_url || request.invoice_number || request.counter_receipt_url) && (
              <section>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Facturación</h4>
                <div className="grid grid-cols-2 gap-6">
                  {request.invoice_number && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Número de Factura</label>
                      <p className="mt-1">{request.invoice_number}</p>
                    </div>
                  )}
                  {request.invoice_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Factura</label>
                      <a
                        href={request.invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-500"
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        Ver Factura
                      </a>
                    </div>
                  )}
                  {request.counter_receipt_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Contra Recibo</label>
                      <a
                        href={request.counter_receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-500"
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        Ver Contra Recibo
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="border-t p-6">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Editar Parte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVisualizationPanel;