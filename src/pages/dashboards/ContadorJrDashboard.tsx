import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest } from '../../types';
import { useAuthStore } from '../../store/auth';
import PartRequestList from '../../components/partRequest/PartRequestList';
import EditPartRequest from '../../components/partRequest/EditPartRequest';
import InvoiceApproval from '../../components/partRequest/InvoiceApproval';
import InvoiceVerification from '../../components/partRequest/InvoiceVerification';
import CounterReceipt from '../../components/partRequest/CounterReceipt';

const ContadorJrDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [partRequests, setPartRequests] = useState<PartRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [invoiceFilter, setInvoiceFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null);
  const [showInvoiceApproval, setShowInvoiceApproval] = useState<PartRequest | null>(null);
  const [showInvoiceVerification, setShowInvoiceVerification] = useState<PartRequest | null>(null);
  const [showCounterReceipt, setShowCounterReceipt] = useState<PartRequest | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from('part_requests')
        .select('*, unit:units(*), provider:providers(*)')
        .in('status', ['status_10', 'status_11', 'status_12']) // Added status_12
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartRequests(data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
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

  // Contador Jr can see and handle status 10, 11, and 12
  const visibleStatuses = [
    'status_0_4',
    'status_10',
    'status_11',
    'status_12'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Panel de Control de Contador Jr</h2>
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
                <option value="status_10">Pendiente Aprobación</option>
                <option value="status_11">Verificación Factura</option>
                <option value="status_12">Contra Recibo</option>
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
            onEdit={setSelectedRequest}
            onInvoiceApproval={setShowInvoiceApproval}
            onInvoiceVerification={setShowInvoiceVerification}
            onCounterReceipt={setShowCounterReceipt}
          />
        )}
      </div>

      {selectedRequest && (
        <EditPartRequest
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdated={() => {
            loadData();
            setSelectedRequest(null);
          }}
        />
      )}

      {showInvoiceApproval && (
        <InvoiceApproval
          request={showInvoiceApproval}
          onClose={() => setShowInvoiceApproval(null)}
          onApproved={() => {
            loadData();
            setShowInvoiceApproval(null);
          }}
        />
      )}

      {showInvoiceVerification && (
        <InvoiceVerification
          request={showInvoiceVerification}
          onClose={() => setShowInvoiceVerification(null)}
          onVerified={() => {
            loadData();
            setShowInvoiceVerification(null);
          }}
        />
      )}

      {showCounterReceipt && (
        <CounterReceipt
          request={showCounterReceipt}
          onClose={() => setShowCounterReceipt(null)}
          onUploaded={() => {
            loadData();
            setShowCounterReceipt(null);
          }}
        />
      )}
    </div>
  );
};

export default ContadorJrDashboard;