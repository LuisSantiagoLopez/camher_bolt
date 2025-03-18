import React from 'react';
import { Component as ComponentIcon, Code, FileText } from 'lucide-react';

const MainComponents: React.FC = () => {
  return (
    <section className="bg-white shadow rounded-lg p-8">
      <div className="flex items-center mb-6">
        <ComponentIcon className="h-8 w-8 text-primary-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Componentes Principales</h2>
      </div>
      <div className="prose max-w-none">
        <h3>Estructura de Componentes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="flex items-center text-lg font-semibold mb-2">
              <Code className="h-5 w-5 mr-2" />
              Tipos TypeScript
            </h4>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
              <code>{`interface PartRequest {
  id: string;
  status: RequestStatus;
  unit_id: string;
  problem_description: string;
  // ...otros campos
}

type RequestStatus =
  | 'status_1'   // Reporte Falla
  | 'status_2'   // Orden Trabajo
  | 'status_3'   // Solicitud Partes
  // ...otros estados`}</code>
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="flex items-center text-lg font-semibold mb-2">
              <FileText className="h-5 w-5 mr-2" />
              Componente React
            </h4>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
              <code>{`const PartRequestList: React.FC<{
  requests: PartRequest[];
  onRefresh: () => void;
}> = ({ requests, onRefresh }) => {
  // Implementación
};`}</code>
            </pre>
          </div>
        </div>

        <h3>Componentes de Solicitud de Partes</h3>
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2">CreatePartRequest</h4>
            <p className="text-sm text-gray-600 mb-4">Componente para crear nuevas solicitudes de partes</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm"><code>{`type Props = {
  units: Unit[];
  onClose: () => void;
  onCreated: () => void;
}`}</code></pre>
            </div>
            {/* Example UI */}
            <div className="mt-4 border rounded-lg p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unidad</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option>Seleccionar unidad...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows={3} />
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2">PartValidation</h4>
            <p className="text-sm text-gray-600 mb-4">Componente para validar partes recibidas</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm"><code>{`interface Props {
  request: PartRequest;
  onValidated: () => void;
  onClose: () => void;
}`}</code></pre>
            </div>
            {/* Example UI */}
            <div className="mt-4 border rounded-lg p-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
                  <label className="ml-2 text-sm text-gray-700">
                    ¿Recibiste todas las partes solicitadas?
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
                  <label className="ml-2 text-sm text-gray-700">
                    ¿El precio coincide con lo acordado?
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3>Componentes de Facturación</h3>
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2">InvoiceUpload</h4>
            <p className="text-sm text-gray-600 mb-4">Componente para cargar facturas</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm"><code>{`interface Props {
  request: PartRequest;
  onUploaded: () => void;
  onClose: () => void;
}`}</code></pre>
            </div>
            {/* Example UI */}
            <div className="mt-4 border rounded-lg p-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="text-sm text-gray-600">
                  Arrastra y suelta archivos aquí o
                  <button className="text-primary-600 hover:text-primary-500 ml-1">
                    selecciona un archivo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2">CounterReceipt</h4>
            <p className="text-sm text-gray-600 mb-4">Componente para gestionar contra recibos</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm"><code>{`interface Props {
  request: PartRequest;
  onUploaded: () => void;
  onClose: () => void;
}`}</code></pre>
            </div>
            {/* Example UI */}
            <div className="mt-4 border rounded-lg p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Número de Contra Recibo
                  </label>
                  <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Archivo
                  </label>
                  <input type="file" className="mt-1 block w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3>Paneles de Control</h3>
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2">TallerDashboard</h4>
            <p className="text-sm text-gray-600 mb-4">Panel principal para usuarios de taller</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm"><code>{`const TallerDashboard: React.FC = () => {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  // ...implementación
}`}</code></pre>
            </div>
            {/* Example UI */}
            <div className="mt-4 border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h5 className="font-medium">Solicitudes Pendientes</h5>
                  <p className="text-2xl font-bold text-primary-600">12</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h5 className="font-medium">En Proceso</h5>
                  <p className="text-2xl font-bold text-yellow-600">5</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h5 className="font-medium">Completadas</h5>
                  <p className="text-2xl font-bold text-green-600">8</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2">ContadorDashboard</h4>
            <p className="text-sm text-gray-600 mb-4">Panel para gestión contable</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm"><code>{`const ContadorDashboard: React.FC = () => {
  const [weeklyTables, setWeeklyTables] = useState<WeeklyTable[]>([]);
  // ...implementación
}`}</code></pre>
            </div>
            {/* Example UI */}
            <div className="mt-4 border rounded-lg p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">Tablas Semanales</h5>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm">
                    Nueva Tabla
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Semana 12 - 2024</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Completada
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainComponents;