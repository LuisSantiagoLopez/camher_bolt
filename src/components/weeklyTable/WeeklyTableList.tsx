import React from 'react';
import { FileSpreadsheet, CheckCircle, XCircle, ArrowUpCircle, Download } from 'lucide-react';
import { WeeklyTable } from '../../types';

interface Props {
  tables: WeeklyTable[];
  onReupload: (table: WeeklyTable) => void;
}

const WeeklyTableList: React.FC<Props> = ({ tables, onReupload }) => {
  const formatDate = (dateString: string) => {
    // Add one day to show the actual inclusive end date
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return {
          label: 'Pendiente de Confirmación',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <XCircle className="h-5 w-5 mr-2" />
        };
      case 1:
        return {
          label: 'Confirmada',
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="h-5 w-5 mr-2" />
        };
      default:
        return {
          label: 'Estado Desconocido',
          color: 'bg-gray-100 text-gray-800',
          icon: null
        };
    }
  };

  const handleDownload = (url: string | null) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Semana
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Archivo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tables.map((table) => {
            const statusInfo = getStatusInfo(table.status);
            
            return (
              <tr key={table.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(table.week_start).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} - {formatDate(table.week_end)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {table.table_url && (
                    <button
                      onClick={() => handleDownload(table.table_url)}
                      className="inline-flex items-center text-primary-600 hover:text-primary-900"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Descargar Excel
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {table.status === 0 && (
                    <button
                      onClick={() => onReupload(table)}
                      className="inline-flex items-center text-primary-600 hover:text-primary-900"
                    >
                      <ArrowUpCircle className="h-5 w-5 mr-2" />
                      Actualizar y Confirmar
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
          {tables.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                No hay tablas semanales
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyTableList;