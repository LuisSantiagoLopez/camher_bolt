import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest } from '../../types';
import { validateInvoiceNumber } from '../../utils/validation';

interface Props {
  request: PartRequest;
  onClose: () => void;
  onVerified: () => void;
}

const InvoiceVerification: React.FC<Props> = ({ request, onClose, onVerified }) => {
  const [verificationNumber, setVerificationNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);

      // Validate invoice number format
      const validationError = validateInvoiceNumber(verificationNumber);
      if (validationError) {
        setError(validationError);
        return;
      }

      if (verificationNumber === request.invoice_number) {
        // Numbers match, proceed to next status
        const { error: updateError } = await supabase
          .from('part_requests')
          .update({
            status: 'status_12',
            edit_message: 'Número de factura verificado correctamente'
          })
          .eq('id', request.id);

        if (updateError) throw updateError;
      } else {
        // Numbers don't match, send back to provider
        const { error: updateError } = await supabase
          .from('part_requests')
          .update({
            status: 'status_0_2',
            edit_message: 'El número de factura no coincide con el registrado'
          })
          .eq('id', request.id);

        if (updateError) throw updateError;
      }

      onVerified();
      onClose();
    } catch (error) {
      console.error('Error verifying invoice:', error);
      setError('Error al verificar la factura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Verificar Número de Factura - #{request.short_id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ingresa el Número de Factura para Verificar
            </label>
            <input
              type="text"
              value={verificationNumber}
              onChange={(e) => setVerificationNumber(e.target.value)}
              required
              placeholder="Ej: A-123456"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              El número de factura debe coincidir exactamente con el registrado por el proveedor.
              Si no coincide, la solicitud será devuelta al proveedor para su corrección.
            </p>
          </div>

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
              disabled={loading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceVerification;