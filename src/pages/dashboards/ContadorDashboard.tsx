import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileSpreadsheet, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest, WeeklyTable } from '../../types';
import PartRequestList from '../../components/partRequest/PartRequestList';
import EditPartRequest from '../../components/partRequest/EditPartRequest';
import CreateWeeklyTable from '../../components/weeklyTable/CreateWeeklyTable';
import WeeklyTableList from '../../components/weeklyTable/WeeklyTableList';
import UpdateWeeklyTable from '../../components/weeklyTable/UpdateWeeklyTable';
import CompletePartRequest from '../../components/partRequest/CompletePartRequest';

const ContadorDashboard: React.FC = () => {
  const [partRequests, setPartRequests] = useState<PartRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PartRequest[]>([]);
  const [weeklyTables, setWeeklyTables] = useState<WeeklyTable[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [invoiceFilter, setInvoiceFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateTable, setShowCreateTable] = useState(false);
  const [selectedTable, setSelectedTable] = useState<WeeklyTable | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null);
  const [showEditRequest, setShowEditRequest] = useState(false);
  const [showCompleteRequest, setShowCompleteRequest] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [partRequestsResponse, weeklyTablesResponse] = await Promise.all([
        supabase
          .from('part_requests')
          .select('*, unit:units(*), provider:providers(*)')
          .order('created_at', { ascending: false }),
        supabase
          .from('weekly_tables')
          .select('*')
          .order('week_start', { ascending: false })
      ]);

      if (partRequestsResponse.error) throw partRequestsResponse.error;
      if (weeklyTablesResponse.error) throw weeklyTablesResponse.error;

      setPartRequests(partRequestsResponse.data);
      setWeeklyTables(weeklyTablesResponse.data);

      // Get all request IDs that are already in tables
      const includedRequestIds = new Set<string>();
      for (const table of weeklyTablesResponse.data) {
        const { data: items } = await supabase
          .from('weekly_table_items')
          .select('part_request_id')
          .eq('weekly_table_id', table.id);
        
        if (items) {
          items.forEach(item => includedRequestIds.add(item.part_request_id));
        }
      }

      // Filter requests that are approved (status_13) but not in any table
      const pendingRequests = partRequestsResponse.data.filter(request => 
        request.status === 'status_13' && !includedRequestIds.has(request.id)
      );

      setPendingRequests(pendingRequests);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRequest = (request: PartRequest) => {
    setSelectedRequest(request);
    if (request.status === 'status_13') {
      setShowCompleteRequest(true);
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
    'status_minus_1',
    'status_0_4',
    'status_1',
    'status_2',
    'status_3',
    'status_4',
    'status_5',
    'status_6',
    'status_7',
    'status_8',
    'status_9',
    'status_10',
    'status_11',
    'status_12',
    'status_13'
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Panel de Control de Contador</h2>
        <button
          onClick={() => setShowCreateTable(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <FileSpreadsheet className="h-5 w-5 mr-2" />
          Crear Tabla de la Semana
        </button>
      </div>

      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Solicitudes Pendientes por Incluir en Tabla ({pendingRequests.length})
            </h3>
            <span className="text-sm text-gray-500">
              Estas solicitudes están aprobadas pero no han sido incluidas en ninguna tabla semanal
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.short_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.unit?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${request.total_amount?.toLocaleString('es-MX')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Weekly Tables Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tablas Semanales</h3>
        <WeeklyTableList
          tables={weeklyTables}
          onReupload={(table) => setSelectedTable(table)}
        />
      </div>

      {/* Part Requests Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Solicitudes de Partes</h3>
        
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
                <option value="status_minus_1">Cancelada</option>
                <option value="status_13">Aprobación Final</option>
                <option value="status_12">Contra Recibo</option>
                <option value="status_11">Verificación Factura</option>
                <option value="status_10">Aprobación Contador Jr</option>
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
          />
        )}
      </div>

      {showCreateTable && (
        <CreateWeeklyTable
          onClose={() => setShowCreateTable(false)}
          onCreated={() => {
            loadData();
            setShowCreateTable(false);
          }}
        />
      )}

      {selectedTable && (
        <UpdateWeeklyTable
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          onUpdated={() => {
            loadData();
            setSelectedTable(null);
          }}
        />
      )}

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

      {showCompleteRequest && selectedRequest && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Revisar Solicitud #{selectedRequest.short_id}
              </h3>
              <button
                onClick={() => {
                  setShowCompleteRequest(false);
                  setSelectedRequest(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Request Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Unidad</h4>
                    <p className="mt-1">{selectedRequest.unit?.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Problema</h4>
                    <p className="mt-1">{selectedRequest.problem_description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Proveedor</h4>
                    <p className="mt-1">{selectedRequest.provider?.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Número de Factura</h4>
                    <p className="mt-1">{selectedRequest.invoice_number}</p>
                  </div>
                </div>

                {selectedRequest.invoice_url && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Factura</h4>
                    <a
                      href={selectedRequest.invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FileSpreadsheet className="h-5 w-5 mr-2" />
                      Ver Factura
                    </a>
                  </div>
                )}

                {selectedRequest.counter_receipt_url && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Contra Recibo</h4>
                    <a
                      href={selectedRequest.counter_receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FileSpreadsheet className="h-5 w-5 mr-2" />
                      Ver Contra Recibo
                    </a>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Monto Total</h4>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    ${selectedRequest.total_amount?.toLocaleString('es-MX')} MXN
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t p-6">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCompleteRequest(false);
                    setSelectedRequest(null);
                    setShowEditRequest(true);
                  }}
                  className="px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  Enviar a Edición
                </button>
                <button
                  onClick={async () => {
                    try {
                      const { error } = await supabase
                        .from('part_requests')
                        .update({
                          status: 'status_13',
                          edit_message: 'Solicitud aprobada por contador'
                        })
                        .eq('id', selectedRequest.id);

                      if (error) throw error;
                      loadData();
                      setShowCompleteRequest(false);
                      setSelectedRequest(null);
                    } catch (error) {
                      console.error('Error approving request:', error);
                    }
                  }}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Aprobar Solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContadorDashboard;