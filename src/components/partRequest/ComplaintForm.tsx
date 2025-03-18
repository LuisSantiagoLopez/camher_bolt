import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest } from '../../types';
import { useAuthStore } from '../../store/auth';

interface Props {
  request: PartRequest;
  onClose: () => void;
  onSubmitted: () => void;
}

const ComplaintForm: React.FC<Props> = ({ request, onClose, onSubmitted }) => {
  const { user } = useAuthStore();
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const [complaintResponse, statusUpdateResponse] = await Promise.all([
        // Create complaint record
        supabase.from('complaints').insert({
          part_request_id: request.id,
          description,
          created_by: user.id,
        }),
        // Update part request status to cancelled (-1)
        supabase
          .from('part_requests')
          .update({
            status: 'status_minus_1',
            edit_message: description
          })
          .eq('id', request.id),
      ]);

      if (complaintResponse.error) throw complaintResponse.error;
      if (statusUpdateResponse.error) throw statusUpdateResponse.error;

      onSubmitted();
      onClose();
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Reportar Problema - Solicitud #{request.short_id}
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
              Descripción del Problema
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Describe detalladamente el problema..."
            />
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
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Enviar Reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;