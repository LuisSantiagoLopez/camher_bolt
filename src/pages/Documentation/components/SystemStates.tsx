import React from 'react';
import { FileText, ArrowRight, ArrowDown, AlertTriangle, CheckCircle, XCircle, Clock, FileSpreadsheet, DollarSign } from 'lucide-react';

const SystemStates: React.FC = () => {
  return (
    <section className="bg-white shadow rounded-lg p-8">
      <div className="flex items-center mb-6">
        <FileText className="h-8 w-8 text-primary-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Estados del Sistema</h2>
      </div>

      <div className="prose max-w-none">
        {/* Flow Diagram */}
        <div className="mb-8 overflow-x-auto">
          <div className="min-w-[1000px] p-4">
            <div className="flex flex-col items-center">
              {/* Initial States */}
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-blue-800">Reporte Inicial</h4>
                  </div>
                  <p className="text-sm text-blue-600">status_1</p>
                  <p className="text-xs text-gray-500 mt-2">Registro inicial del problema</p>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-blue-800">Orden de Trabajo</h4>
                  </div>
                  <p className="text-sm text-blue-600">status_2</p>
                  <p className="text-xs text-gray-500 mt-2">Asignación de trabajo mecánico</p>
                </div>
              </div>

              {/* Decision Point */}
              <ArrowDown className="h-8 w-8 text-gray-400 mb-4" />
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-8">
                <div className="flex items-center mb-2">
                    <FileSpreadsheet className="h-5 w-5 text-yellow-600 mr-2" />
                    <h4 className="font-semibold text-yellow-800">Solicitud de Partes</h4>
                </div>
                <p className="text-sm text-yellow-600">status_3</p>
                <p className="text-xs text-gray-500 mt-2">Listado de partes necesarias</p>
              </div>

              {/* Amount Decision */}
              <ArrowDown className="h-8 w-8 text-gray-400 mb-4" />
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-8 relative">
                <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 text-orange-600 mr-2" />
                    <h4 className="font-semibold text-orange-800">Autorización de Partes</h4>
                </div>
                <p className="text-sm text-orange-600">status_4</p>
                <p className="text-xs text-gray-500 mt-2">Evaluación del monto</p>
                <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-full">
                  <div className="flex justify-center items-center gap-4">
                    <div className="text-sm text-gray-500">Monto {'≤'} $800 MXN</div>
                    <div className="text-sm text-gray-500">Monto {'>'} $800 MXN</div>
                  </div>
                </div>
              </div>

              {/* Split Path */}
              <div className="grid grid-cols-2 gap-16 mb-8">
                <div className="flex flex-col items-center">
                  <ArrowDown className="h-8 w-8 text-gray-400 mb-4 transform -rotate-45" />
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center mb-2">
                      <FileSpreadsheet className="h-5 w-5 text-purple-600 mr-2" />
                      <h4 className="font-semibold text-purple-800">Proveedor</h4>
                    </div>
                    <p className="text-sm text-purple-600">status_6</p>
                    <p className="text-xs text-gray-500 mt-2">Aprobación del proveedor</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <ArrowDown className="h-8 w-8 text-gray-400 mb-4 transform rotate-45" />
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      <h4 className="font-semibold text-red-800">Administrador</h4>
                    </div>
                    <p className="text-sm text-red-600">status_5</p>
                    <p className="text-xs text-gray-500 mt-2">Aprobación administrativa</p>
                  </div>
                </div>
              </div>

              {/* Merge Path */}
              <div className="flex items-center justify-center mb-8">
                <ArrowDown className="h-8 w-8 text-gray-400 transform rotate-45" />
                <div className="mx-8">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-semibold text-green-800">Verificación</h4>
                    </div>
                    <p className="text-sm text-green-600">status_7</p>
                    <p className="text-xs text-gray-500 mt-2">Verificación de partes recibidas</p>
                  </div>
                </div>
                <ArrowDown className="h-8 w-8 text-gray-400 transform -rotate-45" />
              </div>

              {/* Final States */}
              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <div className="flex items-center mb-2">
                    <FileSpreadsheet className="h-5 w-5 text-indigo-600 mr-2" />
                    <h4 className="font-semibold text-indigo-800">Facturación</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="text-sm text-indigo-600">
                      <p>status_8</p>
                      <p className="text-xs text-gray-500">Subir Factura</p>
                    </div>
                    <div className="text-sm text-indigo-600">
                      <p>status_9</p>
                      <p className="text-xs text-gray-500">Número Factura</p>
                    </div>
                    <div className="text-sm text-indigo-600">
                      <p>status_10</p>
                      <p className="text-xs text-gray-500">Aprobación</p>
                    </div>
                  </div>
                </div>
                <ArrowDown className="h-8 w-8 text-gray-400 mx-auto" />
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <div className="flex items-center mb-2">
                    <FileSpreadsheet className="h-5 w-5 text-pink-600 mr-2" />
                    <h4 className="font-semibold text-pink-800">Verificación Final</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="text-sm text-pink-600">
                      <p>status_11</p>
                      <p className="text-xs text-gray-500">Verificar Factura</p>
                    </div>
                    <div className="text-sm text-pink-600">
                      <p>status_12</p>
                      <p className="text-xs text-gray-500">Contra Recibo</p>
                    </div>
                  </div>
                </div>
                <ArrowDown className="h-8 w-8 text-gray-400 mx-auto" />
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-green-800">Completada</h4>
                  </div>
                  <p className="text-sm text-green-600">status_13</p>
                  <p className="text-xs text-gray-500 mt-2">Solicitud finalizada</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Details */}
        <div className="space-y-6">
          <h3>Estados de Edición</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <XCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <h4 className="font-semibold">status_0_1: Edición Taller</h4>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Permite al taller modificar la solicitud y regresar a estados 1-6.
                  Toda la información se mantiene al cambiar de estado.
                </p>
                <ul className="text-sm text-gray-600 list-disc pl-4">
                  <li>Mantiene todos los datos previos</li>
                  <li>Permite modificar campos relevantes</li>
                  <li>Registra razón del cambio en edit_message</li>
                </ul>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <XCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <h4 className="font-semibold">status_0_2: Edición Proveedor</h4>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  El proveedor puede modificar y regresar a estados 1-10.
                  La información persiste durante todo el proceso.
                </p>
                <ul className="text-sm text-gray-600 list-disc pl-4">
                  <li>Conserva información de partes y costos</li>
                  <li>Permite actualizar detalles de proveedor</li>
                  <li>Mantiene historial de cambios</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-4">Persistencia de Datos</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Cuando una solicitud entra en modo de edición (status_0_X):
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
                <li>Todos los datos de la solicitud se mantienen intactos</li>
                <li>Los cambios se registran junto con un mensaje explicativo (edit_message)</li>
                <li>Al regresar al estado seleccionado, la información actualizada persiste</li>
                <li>No hay pérdida de datos durante las transiciones de estado</li>
              </ul>
              <div className="bg-white p-4 rounded-lg mt-4">
                <pre className="text-sm overflow-x-auto"><code>{`// Ejemplo de transición de estado con persistencia
const handleEdit = async (request: PartRequest) => {
  const { error } = await supabase
    .from('part_requests')
    .update({
      status: newStatus,        // Cambia el estado
      edit_message: message,    // Registra razón del cambio
      // Los demás campos mantienen sus valores
    })
    .eq('id', request.id);
};`}</code></pre>
              </div>
            </div>
          </div>

          <h3>Estados Especiales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <h4 className="font-semibold">status_minus_1: Cancelada</h4>
              </div>
              <p className="text-sm text-gray-600">
                Solicitud cancelada con registro de queja. Mantiene toda la información
                histórica para referencia.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <h4 className="font-semibold">status_13: Aprobación Final</h4>
              </div>
              <p className="text-sm text-gray-600">
                Solicitud completamente procesada y aprobada. Conserva todo el
                historial de la solicitud.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemStates;