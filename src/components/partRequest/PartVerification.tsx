import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest } from '../../types';

interface Props {
  request: PartRequest;
  onClose: () => void;
  onVerified: () => void;
}

const PartVerification: React.FC<Props> = ({ request, onClose, onVerified }) => {
  const [verifications, setVerifications] = useState({
    allPartsReceived: false,
    onlyRequestedParts: false,
    correctPrice: false,
  });
  const [action, setAction] = useState<'edit_provider' | 'edit_self' | 'complaint' | null>(null);

  const allVerified = Object.values(verifications).every(v => v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (allVerified) {
        // All verifications passed, move to next status
        await supabase
          .from('part_requests')
          .update({ status: 'status_8' })
          .eq('id', request.id);
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

      onVerified();
      onClose();
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
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
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allPartsReceived"
                checked={verifications.allPartsReceived}
                onChange={(e) => setVerifications(v => ({ ...v, allPartsReceived: e.target.checked }))}
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
                checked={verifications.onlyRequestedParts}
                onChange={(e) => setVerifications(v => ({ ...v, onlyRequestedParts: e.target.checked }))}
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
                checked={verifications.correctPrice}
                onChange={(e) => setVerifications(v => ({ ...v, correctPrice: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="correctPrice" className="ml-2 block text-sm text-gray-900">
                ¿El precio fue exactamente el que metiste?
              </label>
            </div>
          </div>

          {!allVerified && (
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
              disabled={!allVerified && !action}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {allVerified ? 'Confirmar Recepción' : 'Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartVerification;