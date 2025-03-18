import React, { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest } from '../../types';

interface Props {
  request: PartRequest;
  onClose: () => void;
  onApproved: () => void;
}

const ProviderApproval: React.FC<Props> = ({ request, onClose, onApproved }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parts, setParts] = useState<any[]>([]);

  React.useEffect(() => {
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
    } catch (err) {
      console.error('Error loading parts:', err);
      setError('Error al cargar las partes');
    }
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      setError('');

      const { error } = await supabase
        .from('part_requests')
        .update({
          status: 'status_7',
          edit_message: 'Solicitud aprobada por proveedor'
        })
        .eq('id', request.id);

      if (error) throw error;

      onApproved();
      onClose();
    } catch (err) {
      console.error('Error approving request:', err);
      setError('Error al aprobar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      setError('');

      const { error } = await supabase
        .from('part_requests')
        .update({
          status: 'status_0_1',
          edit_message: 'Solicitud rechazada por proveedor'
        })
        .eq('id', request.id);

      if (error) throw error;

      onApproved();
      onClose();
    } catch (err) {
      console.error('Error rejecting request:', err);
      setError('Error al rechazar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Aprobar/Rechazar Solicitud #{request.short_id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Detalles de la Solicitud</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Unidad</p>
                <p className="mt-1">{request.unit?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Descripción</p>
                <p className="mt-1">{request.problem_description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Trabajo Mecánico</p>
                <p className="mt-1">{request.mechanic_work}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Mecánico</p>
                <p className="mt-1">{request.assigned_mechanic}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Partes Solicitadas</h4>
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
                  {parts.map((part) => (
                    <tr key={part.id}>
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
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReject}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Rechazar
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Aprobar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderApproval;