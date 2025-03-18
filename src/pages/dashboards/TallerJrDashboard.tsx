import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest, Unit } from '../../types';
import { useAuthStore } from '../../store/auth';
import CreatePartRequest from '../../components/partRequest/CreatePartRequest';
import PartRequestList from '../../components/partRequest/PartRequestList';
import CreateUnit from '../../components/unit/CreateUnit';

const TallerJrDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [showCreateUnit, setShowCreateUnit] = useState(false);
  const [partRequests, setPartRequests] = useState<PartRequest[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;

    try {
      const [partRequestsResponse, unitsResponse] = await Promise.all([
        supabase
          .from('part_requests')
          .select('*, unit:units(*), provider:providers(*)')
          .eq('created_by', user.id) // Only show requests created by this user
          .order('created_at', { ascending: false }),
        supabase
          .from('units')
          .select('*')
          .order('name')
      ]);

      if (partRequestsResponse.error) throw partRequestsResponse.error;
      if (unitsResponse.error) throw unitsResponse.error;

      setPartRequests(partRequestsResponse.data);
      setUnits(unitsResponse.data);
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

    return matchesSearch && matchesStatus;
  });

  // Only show statuses -1 through 6 and 0/1
  const visibleStatuses = [
    'status_minus_1',
    'status_0_1',
    'status_1',
    'status_2',
    'status_3',
    'status_4',
    'status_5',
    'status_6'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Panel de Control de Taller Jr</h2>
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
    </div>
  );
};

export default TallerJrDashboard;