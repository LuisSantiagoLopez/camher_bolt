import React from 'react';
import StatusBadge from '../../../../components/StatusBadge';

interface Props {
  requestsByStatus: Record<string, number>;
}

const StatusDistribution: React.FC<Props> = ({ requestsByStatus }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución por Estado</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(requestsByStatus).map(([status, count]) => (
          <div key={status} className="p-4 border rounded-lg">
            <StatusBadge status={status as any} />
            <p className="mt-2 text-2xl font-semibold text-gray-900">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDistribution;