import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { PartRequest } from '../../../types';
import SolicitudPartes from '../steps/SolicitudPartes';

interface Props {
  request: PartRequest;
  onClose: () => void;
  onUpdated: () => void;
}

const ProveedorEditMode: React.FC<Props> = ({ request, onClose, onUpdated }) => {
  const [parts, setParts] = useState<Array<{ name: string; description: string; cost: number; quantity: number }>>([]);
  const [isImportant, setIsImportant] = useState(request.is_important || false);
  const [isCashPayment, setIsCashPayment] = useState(request.is_cash_payment || false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [editMessage, setEditMessage] = useState('');
  const [error, setError] = useState('');

  // Load existing parts
  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .eq('part_request_id', request.id);

      if (error) throw error;
      setParts(data?.length > 0 ? data : [{ name: '', description: '', cost: 0, quantity: 1 }]);
    } catch (error) {
      console.error('Error loading parts:', error);
      setError('Error al cargar las partes');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Update request with new total amount and status
      const { error: updateError } = await supabase
        .from('part_requests')
        .update({
          status: selectedStatus,
          edit_message: editMessage,
          is_important: isImportant,
          is_cash_payment: isCashPayment,
          total_amount: parts.reduce((sum, part) => sum + (part.cost * part.quantity), 0),
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      // Update parts
      if (parts.length > 0) {
        // First delete existing parts
        await supabase
          .from('parts')
          .delete()
          .eq('part_request_id', request.id);

        // Then insert new parts
        const { error: partsError } = await supabase
          .from('parts')
          .insert(
            parts.map(part => ({
              part_request_id: request.id,
              name: part.name,
              description: part.description,
              cost: part.cost,
              quantity: part.quantity
            }))
          );

        if (partsError) throw partsError;
      }

      onUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating request:', error);
      setError('Error al actualizar la solicitud');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Editar Solicitud #{request.short_id}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Only show parts section */}
            <SolicitudPartes
              parts={parts}
              isImportant={isImportant}
              isCashPayment={isCashPayment}
              onPartsChange={setParts}
              onImportantChange={setIsImportant}
              onCashPaymentChange={setIsCashPayment}
            />

            {/* Status Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Seleccionar Nuevo Estado</h3>
              <div className="space-y-2">
                {[
                  { value: 'status_1', label: 'Reporte de Falla', description: 'Volver al inicio del proceso.' },
                  { value: 'status_2', label: 'Orden de Trabajo', description: 'Volver a la orden de trabajo.' },
                  { value: 'status_3', label: 'Solicitud de Partes', description: 'Volver a la solicitud de partes.' },
                  { value: 'status_4', label: 'Autorización de Partes', description: 'Volver a autorización.' },
                  { value: 'status_5', label: 'Pendiente Administrador', description: 'Enviar a aprobación administrativa.' },
                  { value: 'status_6', label: 'Pendiente Proveedor', description: 'Volver a aprobación de proveedor.' },
                  { value: 'status_7', label: 'Verificación de Partes', description: 'Enviar a verificación.' },
                  { value: 'status_8', label: 'Subir Factura', description: 'Proceder a subir factura.' },
                  { value: 'status_9', label: 'Número de Factura', description: 'Ingresar número de factura.' },
                  { value: 'status_10', label: 'Aprobación Contador Jr', description: 'Enviar a aprobación contable.' },
                ].map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setSelectedStatus(status.value)}
                    className={`w-full p-4 text-left border rounded-lg transition-colors ${
                      selectedStatus === status.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{status.label}</div>
                    <div className="mt-1 text-sm text-gray-500">{status.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mensaje de Edición
              </label>
              <textarea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Explica los cambios realizados..."
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </form>
        </div>

        <div className="border-t p-6">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!selectedStatus || !editMessage}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProveedorEditMode;