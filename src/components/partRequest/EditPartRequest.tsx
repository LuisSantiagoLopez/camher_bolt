import React from 'react';
import { PartRequest } from '../../types';
import TallerEditMode from './editModes/TallerEditMode';
import ProveedorEditMode from './editModes/ProveedorEditMode';
import AdminEditMode from './editModes/AdminEditMode';
import ContadorEditMode from './editModes/ContadorEditMode';
import { useAuthStore } from '../../store/auth';

interface Props {
  request: PartRequest;
  onClose: () => void;
  onUpdated: () => void;
}

const EditPartRequest: React.FC<Props> = ({ request, onClose, onUpdated }) => {
  const { user } = useAuthStore();

  // If the request is in taller edit mode (status_0_1), only allow taller and admin to edit
  if (request.status === 'status_0_1' && !['taller', 'administrador'].includes(user?.role || '')) {
    return null;
  }

  // Select the appropriate edit mode component based on the request status
  switch (request.status) {
    case 'status_0_1':
      return <TallerEditMode request={request} onClose={onClose} onUpdated={onUpdated} />;
    case 'status_0_2':
      return <ProveedorEditMode request={request} onClose={onClose} onUpdated={onUpdated} />;
    case 'status_0_3':
      return <AdminEditMode request={request} onClose={onClose} onUpdated={onUpdated} />;
    case 'status_0_4':
      return <ContadorEditMode request={request} onClose={onClose} onUpdated={onUpdated} />;
    default:
      return null;
  }
};

export default EditPartRequest;