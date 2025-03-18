import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest } from '../../types';
import { useAuthStore } from '../../store/auth';
import PartRequestList from '../../components/partRequest/PartRequestList';
import EditPartRequest from '../../components/partRequest/EditPartRequest';
import InvoiceUpload from '../../components/partRequest/InvoiceUpload';
import InvoiceNumber from '../../components/partRequest/InvoiceNumber';
import ProviderApproval from '../../components/partRequest/ProviderApproval';

const ProveedorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [partRequests, setPartRequests] = useState<PartRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [invoiceFilter, setInvoiceFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null);
  const [showInvoiceUpload, setShowInvoiceUpload] = useState<PartRequest | null>(null);
  const [showInvoiceNumber, setShowInvoiceNumber] = useState<PartRequest | null>(null);
  const [showEditRequest, setShowEditRequest] = useState(false);
  const [showApproval, setShowApproval] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;

    try {
      // First get the provider record for the logged-in user
      const { data: providerData, error: providerError } = await supabase
        .from('providers')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (providerError) throw providerError;
      if (!providerData) throw new Error('Provider record not found');

      // Then get part requests for this provider
      const { data, error } = await supabase
        .from('part_requests')
        .select('*, unit:units(*), provider:providers(*)')
        .eq('provider_id', providerData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartRequests(data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRequest = (request: PartRequest) => {
    setSelectedRequest(request);
    if (request.status === 'status_6') {
      setShowApproval(true);
    } else {
      setShowEditRequest(true);
    }
  };

  const filteredRequests = partRequests.filter(request => {
    const matchesSearch = 
      request.short_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.problem_description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    const matchesInvoice = !invoiceFilter || 
      request.invoice_number?.toLowerCase().includes(invoiceFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesInvoice;
  });

  const visibleStatuses = [
    'status_0_2',
    'status_6',
    'status_7',
    'status_8',
    'status_9',
    'status_10'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Panel de Control de Proveedor</h2>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por ID o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">Todos los estados</option>
                <option value="status_6">Pendiente Aprobación</option>
                <option value="status_8">Subir Factura</option>
                <option value="status_9">Número de Factura</option>
              </select>
            </div>
          </div>
          <div className="w-64">
            <input
              type="text"
              placeholder="Filtrar por número de factura..."
              value={invoiceFilter}
              onChange={(e) => setInvoiceFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <PartRequestList
            requests={filteredRequests}
            visibleStatuses={visibleStatuses}
            onRefresh={loadData}
            onEdit={handleEditRequest}
            onInvoiceUpload={setShowInvoiceUpload}
            onInvoiceNumber={setShowInvoiceNumber}
          />
        )}
      </div>

      {showEditRequest && selectedRequest && (
        <EditPartRequest
          request={selectedRequest}
          onClose={() => {
            setShowEditRequest(false);
            setSelectedRequest(null);
          }}
          onUpdated={() => {
            loadData();
            setShowEditRequest(false);
            setSelectedRequest(null);
          }}
        />
      )}

      {showApproval && selectedRequest && (
        <ProviderApproval
          request={selectedRequest}
          onClose={() => {
            setShowApproval(false);
            setSelectedRequest(null);
          }}
          onApproved={() => {
            loadData();
            setShowApproval(false);
            setSelectedRequest(null);
          }}
        />
      )}

      {showInvoiceUpload && (
        <InvoiceUpload
          request={showInvoiceUpload}
          onClose={() => setShowInvoiceUpload(null)}
          onUploaded={() => {
            loadData();
            setShowInvoiceUpload(null);
          }}
        />
      )}

      {showInvoiceNumber && (
        <InvoiceNumber
          request={showInvoiceNumber}
          onClose={() => setShowInvoiceNumber(null)}
          onSubmitted={() => {
            loadData();
            setShowInvoiceNumber(null);
          }}
        />
      )}
    </div>
  );
};

export default ProveedorDashboard;