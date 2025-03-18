import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest, Unit, Provider } from '../../types';
import CreatePartRequest from '../../components/partRequest/CreatePartRequest';
import PartRequestList from '../../components/partRequest/PartRequestList';
import CreateUnit from '../../components/unit/CreateUnit';
import EditPartRequest from '../../components/partRequest/EditPartRequest';
import CompletePartRequest from '../../components/partRequest/CompletePartRequest';
import PartValidation from '../../components/partRequest/PartValidation';
import CounterReceipt from '../../components/partRequest/CounterReceipt';

const TallerDashboard: React.FC = () => {
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [showCreateUnit, setShowCreateUnit] = useState(false);
  const [partRequests, setPartRequests] = useState<PartRequest[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null);
  const [showEditRequest, setShowEditRequest] = useState(false);
  const [showCompleteRequest, setShowCompleteRequest] = useState(false);
  const [showPartValidation, setShowPartValidation] = useState(false);
  const [showCounterReceipt, setShowCounterReceipt] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [partRequestsResponse, unitsResponse, providersResponse] = await Promise.all([
        supabase
          .from('part_requests')
          .select('*, unit:units(*), provider:providers(*)')
          .order('created_at', { ascending: false }),
        supabase
          .from('units')
          .select('*')
          .order('name'),
        supabase
          .from('providers')
          .select('*')
          .order('name')
      ]);

      if (partRequestsResponse.error) throw partRequestsResponse.error;
      if (unitsResponse.error) throw unitsResponse.error;
      if (providersResponse.error) throw providersResponse.error;

      setPartRequests(partRequestsResponse.data);
      setUnits(unitsResponse.data);
      setProviders(providersResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRequest = (request: PartRequest) => {
    setSelectedRequest(request);
    if (request.status === 'status_0_1') {
      setShowEditRequest(true);
    } else {
      setShowCompleteRequest(true);
    }
  };

  const handlePartValidation = (request: PartRequest) => {
    setSelectedRequest(request);
    setShowPartValidation(true);
  };

  const handleCounterReceipt = (request: PartRequest) => {
    setSelectedRequest(request);
    setShowCounterReceipt(true);
  };

  const filteredRequests = partRequests.filter(request => {
    const matchesSearch = 
      request.short_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.problem_description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const visibleStatuses = [
    'status_minus_1',
    'status_0_1',
    'status_1',
    'status_2',
    'status_3',
    'status_4',
    'status_5',
    'status_6',
    'status_7',
    'status_12'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Panel de Control de Taller</h2>
        <div className="space-x-4">
          <button
            onClick={() => setShowCreateUnit(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Unidad
          </button>
          <button
            onClick={() => setShowCreateRequest(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Solicitud
          </button>
        </div>
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
                <option value="status_minus_1">Cancelada</option>
                <option value="status_1">Reporte de Falla</option>
                <option value="status_2">Orden de Trabajo</option>
                <option value="status_3">Solicitud de Partes</option>
                <option value="status_4">Autorización de Partes</option>
                <option value="status_5">Pendiente Administrador</option>
                <option value="status_6">Pendiente Proveedor</option>
                <option value="status_7">Verificación de Partes</option>
                <option value="status_12">Contra Recibo</option>
              </select>
            </div>
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
            onPartValidation={handlePartValidation}
            onCounterReceipt={handleCounterReceipt}
          />
        )}
      </div>

      {showCreateUnit && (
        <CreateUnit
          onClose={() => setShowCreateUnit(false)}
          onCreated={() => {
            loadData();
            setShowCreateUnit(false);
          }}
        />
      )}

      {showCreateRequest && (
        <CreatePartRequest
          units={units}
          onClose={() => setShowCreateRequest(false)}
          onCreated={() => {
            loadData();
            setShowCreateRequest(false);
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
        <CompletePartRequest
          request={selectedRequest}
          units={units}
          providers={providers}
          onClose={() => {
            setShowCompleteRequest(false);
            setSelectedRequest(null);
          }}
          onSubmitted={() => {
            loadData();
            setShowCompleteRequest(false);
            setSelectedRequest(null);
          }}
        />
      )}

      {showPartValidation && selectedRequest && (
        <PartValidation
          request={selectedRequest}
          onClose={() => {
            setShowPartValidation(false);
            setSelectedRequest(null);
          }}
          onValidated={() => {
            loadData();
            setShowPartValidation(false);
            setSelectedRequest(null);
          }}
        />
      )}

      {showCounterReceipt && selectedRequest && (
        <CounterReceipt
          request={selectedRequest}
          onClose={() => {
            setShowCounterReceipt(false);
            setSelectedRequest(null);
          }}
          onUploaded={() => {
            loadData();
            setShowCounterReceipt(false);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
};

export default TallerDashboard;