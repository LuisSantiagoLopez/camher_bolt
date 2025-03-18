import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest } from '../../types';
import { sendProviderPartsVerifiedEmail } from '../../services/email';

interface Props {
  request: PartRequest;
  onClose: () => void;
  onValidated: () => void;
}

const PartValidation: React.FC<Props> = ({ request, onClose, onValidated }) => {
  const [validations, setValidations] = useState({
    allPartsReceived: false,
    onlyRequestedParts: false,
    correctPrice: false,
  });
  const [action, setAction] = useState<'edit_provider' | 'edit_self' | 'complaint' | null>(null);
  const [error, setError] = useState('');
  const [parts, setParts] = useState<Array<{ name: string; description: string; cost: number; quantity: number }>>([]);

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
      setParts(data || []);
    } catch (error) {
      console.error('Error loading parts:', error);
      setError('Error al cargar las partes');
    }
  };

  const allValidated = Object.values(validations).every(v => v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (allValidated) {
        // All validations passed, move to next status
        await supabase
          .from('part_requests')
          .update({ status: 'status_8' })
          .eq('id', request.id);

        // Try to send email notification, but don't block on failure
        if (request.provider?.profile_id) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', request.provider.profile_id)
              .single();

            if (profile?.email) {
              await sendProviderPartsVerifiedEmail(
                profile.email,
                request.provider.name,
                request.short_id
              ).catch(err => {
                console.error('Failed to send email notification:', err);
              });
            }
          } catch (emailError) {
            console.error('Error preparing email notification:', emailError);
          }
        }
      } else {
        // Handle different actions based on selection
        let newStatus = '';
        switch (action) {
          case 'edit_provider':
            newStatus = 'status_0_2';
            break;
          case 'edit_self':
            newStatus = 'status_0_1';
            break;
          case 'complaint':
            newStatus = 'status_minus_1';
            break;
          default:
            throw new Error('Invalid action');
        }

        await supabase
          .from('part_requests')
          .update({ status: newStatus })
          .eq('id', request.id);
      }

      onValidated();
      onClose();
    } catch (error) {
      console.error('Error updating validation:', error);
      setError('Error al actualizar la validación. Por favor intente nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Verificación de Partes - #{request.short_id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Parts Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parts.map((part, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {part.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {part.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {part.quantity}
                    </td>
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
                  <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    Total:
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parts.reduce((sum, part) => sum + (part.cost * part.quantity), 0).toLocaleString('es-MX')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allPartsReceived"
                checked={validations.allPartsReceived}
                onChange={(e) => setValidations(v => ({ ...v, allPartsReceived: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="allPartsReceived" className="ml-2 block text-sm text-gray-900">
                De las partes que pediste en tu solicitud, ¿recibiste todas las partes que pediste?
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="onlyRequestedParts"
                checked={validations.onlyRequestedParts}
                onChange={(e) => setValidations(v => ({ ...v, onlyRequestedParts: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="onlyRequestedParts" className="ml-2 block text-sm text-gray-900">
                ¿Recibiste solamente las partes que pediste?
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="correctPrice"
                checked={validations.correctPrice}
                onChange={(e) => setValidations(v => ({ ...v, correctPrice: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="correctPrice" className="ml-2 block text-sm text-gray-900">
                ¿El precio fue exactamente el que metiste?
              </label>
            </div>
          </div>

          {!allValidated && (
            <div className="space-y-4 mt-6">
              <p className="text-sm font-medium text-gray-700">
                Selecciona una acción:
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setAction('edit_provider')}
                  className={`w-full p-3 text-left border rounded-lg ${
                    action === 'edit_provider'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                >
                  Quiero que el proveedor edite la solicitud de partes
                </button>

                <button
                  type="button"
                  onClick={() => setAction('edit_self')}
                  className={`w-full p-3 text-left border rounded-lg ${
                    action === 'edit_self'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                >
                  Yo quiero editar mi solicitud de partes
                </button>

                <button
                  type="button"
                  onClick={() => setAction('complaint')}
                  className={`w-full p-3 text-left border rounded-lg ${
                    action === 'complaint'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                >
                  Quiero subir un reporte y cancelar la solicitud de partes
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

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
              disabled={!allValidated && !action}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {allValidated ? 'Confirmar Recepción' : 'Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartValidation;