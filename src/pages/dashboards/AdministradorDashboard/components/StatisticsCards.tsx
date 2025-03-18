import React from 'react';
import { PieChart, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

interface Props {
  stats: {
    totalRequests: number;
    pendingRequests: number;
    urgentRequests: number;
    averageCompletionTime: number;
  };
}

const StatisticsCards: React.FC<Props> = ({ stats }) => {
  return (
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
  );
};

export default StatisticsCards;