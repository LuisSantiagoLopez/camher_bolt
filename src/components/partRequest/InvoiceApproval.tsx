import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest } from '../../types';

interface Props {
  request: PartRequest;
  onClose: () => void;
  onApproved: () => void;
}

const InvoiceApproval: React.FC<Props> = ({ request, onClose, onApproved }) => {
  const [approved, setApproved] = useState<boolean | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (approved) {
        // Move to next status
        await supabase
          .from('part_requests')
          .update({
            status: 'status_11'
          })
          .eq('id', request.id);
      } else {
        // Send back to provider for editing
        await supabase
          .from('part_requests')
          .update({
            status: 'status_0_2',
            edit_message: reason
          })
          .eq('id', request.id);
      }

      onApproved();
      onClose();
    } catch (error) {
      console.error('Error processing invoice approval:', error);
      setError('Error al procesar la aprobación. Por favor intente nuevamente.');
    }
  };

  const handleDownload = async () => {
    if (!request.invoice_url) {
      setError('No hay factura disponible para descargar');
      return;
    }

    try {
      // Open invoice in new tab
      window.open(request.invoice_url, '_blank');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      setError('Error al descargar la factura');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Aprobar Factura - #{request.short_id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Invoice Download Button */}
          {request.invoice_url && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-5 w-5 mr-2" />
                Descargar Factura
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ¿Aprobar la factura?
              </label>
              <div className="mt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setApproved(true)}
                  className={`w-full p-3 text-left border rounded-lg ${
                    approved === true
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                >
                  Sí, aprobar factura
                </button>
                <button
                  type="button"
                  onClick={() => setApproved(false)}
                  className={`w-full p-3 text-left border rounded-lg ${
                    approved === false
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                >
                  No, requiere cambios
                </button>
              </div>
            </div>

            {approved === false && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Razón de Rechazo
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Explica por qué se rechaza la factura..."
                />
              </div>
            )}
          </div>

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
              disabled={approved === null || (approved === false && !reason)}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceApproval;