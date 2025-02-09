// src/components/ui/RoleRequestsManager.tsx
import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@/utils/supabase/useSupabaseClient';
import Button from './Button';
import TextInput from './TextInput';

interface RoleRequest {
  id: string;
  email: string;
  requested_role: string;
  status: string;
  created_at: string;
  admin_note?: string;
}

/**
 * Component to manage pending role requests.
 * It fetches pending requests, and allows an admin to approve or reject them.
 */
export default function RoleRequestsManager() {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState<string>('');
  const supabase = useSupabaseClient();

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('role_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
  
      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err instanceof Error ? err.message : 'Error fetching requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (request: RoleRequest) => {
    try {
      setIsLoading(true);
      const { data: userData, error: userError } = await supabase
        .from('user_roles_view')
        .select('user_id')
        .eq('email', request.email)
        .single();
  
      if (userError) throw userError;
      if (!userData?.user_id) throw new Error('User not found');
  
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userData.user_id,
          role: request.requested_role,
        });
  
      if (roleError) throw roleError;
  
      const { error: requestError } = await supabase
        .from('role_requests')
        .update({
          status: 'approved',
          admin_note: adminNote || 'Approved',
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.id);
  
      if (requestError) throw requestError;
  
      setAdminNote('');
      await fetchRequests();
    } catch (err) {
      console.error('Error approving request:', err);
      setError(err instanceof Error ? err.message : 'Error approving request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (request: RoleRequest) => {
    if (!adminNote) {
      setError('Please provide a reason for rejection');
      return;
    }
  
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('role_requests')
        .update({
          status: 'rejected',
          admin_note: adminNote,
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.id);
  
      if (error) throw error;
  
      setAdminNote('');
      await fetchRequests();
    } catch (err) {
      console.error('Error rejecting request:', err);
      setError(err instanceof Error ? err.message : 'Error rejecting request');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Solicitudes de Rol Pendientes</h2>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {requests.length === 0 ? (
        <p className="text-gray-500 text-center p-8 bg-white rounded-lg shadow">
          No hay solicitudes pendientes
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{request.email}</h3>
                  <p className="text-gray-600">
                    Rol solicitado: <span className="font-medium">{request.requested_role}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Solicitado el: {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <TextInput
                  intent="long"
                  name="Nota del administrador"
                  placeholder="Agregar una nota (requerida para rechazar)"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
                <div className="flex justify-end space-x-3">
                  <Button intent="green" onClick={() => handleApprove(request)}>
                    Aprobar
                  </Button>
                  <Button intent="red" onClick={() => handleReject(request)}>
                    Rechazar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
