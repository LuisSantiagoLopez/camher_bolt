import React from 'react';
import { UserCheck } from 'lucide-react';
import { VerificationRequest } from '../../../../types';
import VerificationRequests from '../../../../components/admin/VerificationRequests';

interface Props {
  requests: VerificationRequest[];
  onUpdate: () => void;
}

const VerificationRequestsSection: React.FC<Props> = ({ requests, onUpdate }) => {
  return (
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
        requests={requests}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default VerificationRequestsSection;