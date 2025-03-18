import React from 'react';
import { Search, Filter } from 'lucide-react';
import { PartRequest } from '../../../../types';
import PartRequestList from '../../../../components/partRequest/PartRequestList';

interface Props {
  loading: boolean;
  requests: PartRequest[];
  visibleStatuses: string[];
  searchTerm: string;
  statusFilter: string;
  dateFilter: 'today' | 'week' | 'month' | 'all';
  invoiceFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onDateFilterChange: (value: 'today' | 'week' | 'month' | 'all') => void;
  onInvoiceFilterChange: (value: string) => void;
  onRefresh: () => void;
}

const PartRequestsSection: React.FC<Props> = ({
  loading,
  requests,
  visibleStatuses,
  searchTerm,
  statusFilter,
  dateFilter,
  invoiceFilter,
  onSearchChange,
  onStatusFilterChange,
  onDateFilterChange,
  onInvoiceFilterChange,
  onRefresh
}) => {
  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="w-48">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
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
            onChange={(e) => onDateFilterChange(e.target.value as any)}
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
            onChange={(e) => onInvoiceFilterChange(e.target.value)}
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
          requests={requests}
          visibleStatuses={visibleStatuses}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};

export default PartRequestsSection;