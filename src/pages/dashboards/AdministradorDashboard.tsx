import React, { useState, useEffect } from 'react';
import { Search, Filter, FileSpreadsheet, PieChart, TrendingUp, AlertTriangle, Clock, UserCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest, WeeklyTable, VerificationRequest, Provider } from '../../types';
import PartRequestList from '../../components/partRequest/PartRequestList';
import EditPartRequest from '../../components/partRequest/EditPartRequest';
import WeeklyTableList from '../../components/weeklyTable/WeeklyTableList';
import StatusBadge from '../../components/StatusBadge';
import VerificationRequests from '../../components/admin/VerificationRequests';
import AdminVisualizationPanel from '../../components/partRequest/AdminVisualizationPanel';

const AdministradorDashboard: React.FC = () => {
  const [partRequests, setPartRequests] = useState<PartRequest[]>([]);
  const [weeklyTables, setWeeklyTables] = useState<WeeklyTable[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [invoiceFilter, setInvoiceFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null);
  const [showEditRequest, setShowEditRequest] = useState(false);
  const [showVisualizationPanel, setShowVisualizationPanel] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalAmount: 0,
    urgentRequests: 0,
    averageCompletionTime: 0,
    requestsByStatus: {} as Record<string, number>,
    pendingVerifications: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [partRequestsResponse, weeklyTablesResponse, verificationRequestsResponse, providersResponse] = await Promise.all([
        supabase
          .from('part_requests')
          .select(`
            *,
            unit:units(*),
            provider:providers(*),
            parts(*)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('weekly_tables')
          .select('*')
          .order('week_start', { ascending: false }),
        supabase
          .from('verification_requests')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
        supabase
          .from('providers')
          .select('*')
          .order('name')
      ]);

      if (partRequestsResponse.error) throw partRequestsResponse.error;
      if (weeklyTablesResponse.error) throw weeklyTablesResponse.error;
      if (verificationRequestsResponse.error) throw verificationRequestsResponse.error;
      if (providersResponse.error) throw providersResponse.error;

      const requests = partRequestsResponse.data;
      setPartRequests(requests);
      setWeeklyTables(weeklyTablesResponse.data);
      setVerificationRequests(verificationRequestsResponse.data);
      setProviders(providersResponse.data);

      // Calculate statistics
      const statusCounts = requests.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const completedRequests = requests.filter(r => r.status === 'status_13');
      const avgTime = completedRequests.length > 0
        ? completedRequests.reduce((sum, r) => {
            const created = new Date(r.created_at);
            const completed = new Date(r.updated_at);
            return sum + (completed.getTime() - created.getTime());
          }, 0) / completedRequests.length / (1000 * 60 * 60 * 24) // Convert to days
        : 0;

      setStats({
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => !['status_13', 'status_minus_1'].includes(r.status)).length,
        completedRequests: completedRequests.length,
        totalAmount: requests.reduce((sum, r) => sum + (r.total_amount || 0), 0),
        urgentRequests: requests.filter(r => r.is_important).length,
        averageCompletionTime: Math.round(avgTime * 10) / 10,
        requestsByStatus: statusCounts,
        pendingVerifications: verificationRequestsResponse.data.length
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRequest = (request: PartRequest) => {
    setSelectedRequest(request);
    // Always show visualization panel first, regardless of status
    setShowVisualizationPanel(true);
  };

  const handleStartEdit = () => {
    if (selectedRequest) {
      setShowVisualizationPanel(false);
      // Update request status to admin edit mode
      supabase
        .from('part_requests')
        .update({
          status: 'status_0_3',
          edit_message: 'Solicitud en edición por administrador'
        })
        .eq('id', selectedRequest.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error updating request status:', error);
            return;
          }
          setShowEditRequest(true);
          loadData(); // Reload data to get updated status
        });
    }
  };

  const getDateFilteredRequests = (requests: PartRequest[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (dateFilter) {
      case 'today':
        return requests.filter(r => new Date(r.created_at) >= today);
      case 'week':
        return requests.filter(r => new Date(r.created_at) >= weekAgo);
      case 'month':
        return requests.filter(r => new Date(r.created_at) >= monthAgo);
      default:
        return requests;
    }
  };

  const filteredRequests = getDateFilteredRequests(partRequests).filter(request => {
    const matchesSearch = 
      request.short_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.problem_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.unit?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    const matchesInvoice = !invoiceFilter || 
      request.invoice_number?.toLowerCase().includes(invoiceFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesInvoice;
  });

  const visibleStatuses = [
    'status_minus_1',
    'status_0_1',
    'status_0_2',
    'status_0_3',
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
        <h2 className="text-2xl font-bold text-gray-900">Panel de Control de Administrador</h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-full">
              <PieChart className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Solicitudes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Urgentes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.urgentRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tiempo Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.averageCompletionTime} días
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Requests Section */}
      {verificationRequests.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Solicitudes de Verificación Pendientes
            </h3>
            <div className="p-2 bg-yellow-100 rounded-full">
              <UserCheck className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <VerificationRequests
            requests={verificationRequests}
            onUpdate={loadData}
          />
        </div>
      )}

      {/* Status Distribution */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución por Estado</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.requestsByStatus).map(([status, count]) => (
            <div key={status} className="p-4 border rounded-lg">
              <StatusBadge status={status as any} />
              <p className="mt-2 text-2xl font-semibold text-gray-900">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Tables Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tablas Semanales</h3>
        <WeeklyTableList
          tables={weeklyTables}
          onReupload={() => {}} // Administrators can't reupload tables
        />
      </div>

      {/* Part Requests Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Solicitudes de Partes</h3>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por ID, descripción o unidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">Todos los estados</option>
                <option value="status_minus_1">Cancelada</option>
                <option value="status_5">Pendiente Aprobación</option>
                <option value="status_13">Completada</option>
              </select>
            </div>
          </div>

          <div className="w-48">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>

          <div className="w-48">
            <input
              type="text"
              placeholder="Filtrar por factura..."
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

      {showVisualizationPanel && selectedRequest && (
        <AdminVisualizationPanel
          request={selectedRequest}
          onClose={() => {
            setShowVisualizationPanel(false);
            setSelectedRequest(null);
          }}
          onEdit={handleStartEdit}
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
    </div>
  );
};

export default AdministradorDashboard;