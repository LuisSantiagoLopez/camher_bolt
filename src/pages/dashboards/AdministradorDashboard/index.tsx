import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { PartRequest, WeeklyTable, VerificationRequest } from '../../../types';
import { useLoadDashboardData } from './hooks/useLoadDashboardData';
import { useFilteredRequests } from './hooks/useFilteredRequests';
import StatisticsCards from './components/StatisticsCards';
import VerificationRequestsSection from './components/VerificationRequestsSection';
import StatusDistribution from './components/StatusDistribution';
import WeeklyTablesSection from './components/WeeklyTablesSection';
import PartRequestsSection from './components/PartRequestsSection';
import EditPartRequest from '../../../components/partRequest/EditPartRequest';

const AdministradorDashboard: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null);
  const {
    loading,
    partRequests,
    weeklyTables,
    verificationRequests,
    stats,
    loadData
  } = useLoadDashboardData();

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    invoiceFilter,
    setInvoiceFilter,
    filteredRequests
  } = useFilteredRequests(partRequests);

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

      <StatisticsCards stats={stats} />

      {verificationRequests.length > 0 && (
        <VerificationRequestsSection
          requests={verificationRequests}
          onUpdate={loadData}
        />
      )}

      <StatusDistribution requestsByStatus={stats.requestsByStatus} />

      <WeeklyTablesSection tables={weeklyTables} />

      <PartRequestsSection
        loading={loading}
        requests={filteredRequests}
        visibleStatuses={visibleStatuses}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        invoiceFilter={invoiceFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onDateFilterChange={setDateFilter}
        onInvoiceFilterChange={setInvoiceFilter}
        onRefresh={loadData}
      />

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
    </div>
  );
};

export default AdministradorDashboard;