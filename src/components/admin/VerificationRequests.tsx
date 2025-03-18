import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { VerificationRequest } from '../../types';

interface Props {
  requests: VerificationRequest[];
  onUpdate: () => void;
}

const VerificationRequests: React.FC<Props> = ({ requests, onUpdate }) => {
  const handleVerification = async (requestId: string, approved: boolean, notes: string = '') => {
    try {
      const { data: request } = await supabase
        .from('verification_requests')
        .select('profile_id')
        .eq('id', requestId)
        .single();

      if (!request) return;

      // Update verification request status
      const { error: requestError } = await supabase
        .from('verification_requests')
        .update({
          status: approved ? 'approved' : 'rejected',
          admin_notes: notes
        })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Update profile verification status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_verified: approved })
        .eq('id', request.profile_id);

      if (profileError) throw profileError;

      onUpdate();
    } catch (error) {
      console.error('Error processing verification:', error);
    }
  };

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {request.role}
              </h3>
              <p className="text-sm text-gray-500">
                Fecha: {new Date(request.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleVerification(request.id, true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprobar
              </button>
              <button
                onClick={() => handleVerification(request.id, false, 'Solicitud rechazada')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rechazar
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {requests.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No hay solicitudes pendientes de verificación
        </div>
      )}
    </div>
  );
};

export default VerificationRequests;