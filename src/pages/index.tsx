import { useFlowContext } from '../context/FlowContext';
import Contaduria from '../flows/contaduria';
import Tabla from '../flows/contadorTabla';
import AdminFlow from '../flows/admin';
import TallerFlow from '../flows/taller';
import ProveedorFlow from '../flows/proveedor';

import OperadorFlow from '../flows/operador';
import DefaultFlow from '@/flows/default';

export default function Home() {
  function renderFlow() {
    const { flow } = useFlowContext();
    switch (flow) {
      case 'taller':
        return <TallerFlow />;
      case 'admin':
        return <AdminFlow />;
      case 'contador':
        return <Tabla />;
      case 'contaduria':
        return <Contaduria />;
      case 'operador':
        return <OperadorFlow />;
      case 'proveedor':
        return <ProveedorFlow />;
      default:
        return <DefaultFlow />;
    }
  }

  return (
    <div>
      <div id="tools">{renderFlow()}</div>
    </div>
  );
}
