import React from 'react';
import { Code, Lock, Shield, Users, Key, Database, FileText, User, Truck, Package, FileSpreadsheet } from 'lucide-react';

const SecurityPermissions: React.FC = () => {
  return (
    <section className="bg-white shadow rounded-lg p-8">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 text-primary-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Seguridad y Permisos</h2>
      </div>

      <div className="prose max-w-none">
        {/* Role-Based Access Control */}
        <div className="mb-12">
          <h3 className="flex items-center">
            <Users className="h-6 w-6 mr-2 text-blue-600" />
            Permisos por Rol
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Taller */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-3">
                <Truck className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-800">Taller</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Crear y editar solicitudes
                </li>
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Crear unidades
                </li>
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Verificar partes recibidas
                </li>
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Crear quejas
                </li>
              </ul>
            </div>

            {/* Taller Jr */}
            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
              <div className="flex items-center mb-3">
                <Truck className="h-5 w-5 text-cyan-600 mr-2" />
                <h4 className="font-semibold text-cyan-800">Taller Jr</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Crear solicitudes
                </li>
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Editar solicitudes propias
                </li>
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Crear unidades
                </li>
              </ul>
            </div>

            {/* Proveedor */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-3">
                <Package className="h-5 w-5 text-purple-600 mr-2" />
                <h4 className="font-semibold text-purple-800">Proveedor</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Ver solicitudes asignadas
                </li>
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Subir facturas
                </li>
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Ingresar números de factura
                </li>
              </ul>
            </div>

            {/* Administrador */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-red-600 mr-2" />
                <h4 className="font-semibold text-red-800">Administrador</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Acceso completo
                </li>
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Gestionar proveedores
                </li>
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Aprobar verificaciones
                </li>
              </ul>
            </div>

            {/* Contador */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-3">
                <FileSpreadsheet className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-800">Contador</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Crear tablas semanales
                </li>
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Aprobar solicitudes finales
                </li>
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Ver todas las solicitudes
                </li>
              </ul>
            </div>

            {/* Contador Jr */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center mb-3">
                <FileText className="h-5 w-5 text-yellow-600 mr-2" />
                <h4 className="font-semibold text-yellow-800">Contador Jr</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Aprobar facturas
                </li>
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Verificar números de factura
                </li>
                <li className="flex items-center">
                  <Key className="h-4 w-4 text-green-500 mr-2" />
                  Subir contra recibos
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Row Level Security */}
        <div className="mb-12">
          <h3 className="flex items-center">
            <Lock className="h-6 w-6 mr-2 text-indigo-600" />
            Row Level Security (RLS)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Table Policies */}
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold mb-4">Políticas por Tabla</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Database className="h-4 w-4 text-indigo-600 mr-2" />
                    <span className="font-medium">part_requests</span>
                  </div>
                  <ul className="text-sm space-y-1 ml-6">
                    <li>• Taller: Ver todas las solicitudes</li>
                    <li>• Taller Jr: Solo solicitudes propias</li>
                    <li>• Proveedor: Solo solicitudes asignadas</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <Database className="h-4 w-4 text-indigo-600 mr-2" />
                    <span className="font-medium">providers</span>
                  </div>
                  <ul className="text-sm space-y-1 ml-6">
                    <li>• Admin: Control total</li>
                    <li>• Proveedor: Solo su registro</li>
                    <li>• Otros: Solo lectura</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Rules */}
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold mb-4">Reglas de Seguridad</h4>
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-md">
                  <pre className="text-sm overflow-x-auto"><code>{`-- Ejemplo de política RLS
CREATE POLICY "Users can read own data"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);`}</code></pre>
                </div>
                <div className="bg-white p-3 rounded-md">
                  <pre className="text-sm overflow-x-auto"><code>{`-- Política para proveedores
CREATE POLICY "Providers see assigned requests"
  ON part_requests
  FOR SELECT
  USING (provider_id = auth.uid());`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Security */}
        <div>
          <h3 className="flex items-center">
            <FileText className="h-6 w-6 mr-2 text-pink-600" />
            Seguridad de Almacenamiento
          </h3>
          
          {/* Storage Tables */}
          <div className="mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bucket</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permisos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validaciones</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Políticas</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* damage_photos */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-mono text-sm">damage_photos</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center">
                          <Key className="h-4 w-4 text-green-500 mr-2" />
                          Lectura: Pública
                        </li>
                        <li className="flex items-center">
                          <Key className="h-4 w-4 text-green-500 mr-2" />
                          Escritura: Taller
                        </li>
                      </ul>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-sm space-y-1">
                        <li>• Máximo 10MB</li>
                        <li>• Solo imágenes</li>
                        <li>• JPG, PNG</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4">
                      <pre className="text-xs bg-gray-50 p-2 rounded"><code>{`CREATE POLICY "Public read"
  ON storage.objects
  FOR SELECT USING (
    bucket_id = 'damage_photos'
  );`}</code></pre>
                    </td>
                  </tr>

                  {/* invoices */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileSpreadsheet className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-mono text-sm">invoices</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center">
                          <Key className="h-4 w-4 text-green-500 mr-2" />
                          Lectura: Restringida
                        </li>
                        <li className="flex items-center">
                          <Key className="h-4 w-4 text-green-500 mr-2" />
                          Escritura: Proveedor
                        </li>
                      </ul>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-sm space-y-1">
                        <li>• Máximo 10MB</li>
                        <li>• PDF o imágenes</li>
                        <li>• Validación de formato</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4">
                      <pre className="text-xs bg-gray-50 p-2 rounded"><code>{`CREATE POLICY "Provider upload"
  ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'invoices' AND
    auth.role() = 'proveedor'
  );`}</code></pre>
                    </td>
                  </tr>

                  {/* counter_receipts */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileSpreadsheet className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-mono text-sm">counter_receipts</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center">
                          <Key className="h-4 w-4 text-green-500 mr-2" />
                          Lectura: Restringida
                        </li>
                        <li className="flex items-center">
                          <Key className="h-4 w-4 text-green-500 mr-2" />
                          Escritura: Contador
                        </li>
                      </ul>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-sm space-y-1">
                        <li>• Máximo 10MB</li>
                        <li>• PDF o imágenes</li>
                        <li>• Nombre específico</li>
                      </ul>
                    </td>
                    <td className="px-6 py-4">
                      <pre className="text-xs bg-gray-50 p-2 rounded"><code>{`CREATE POLICY "Contador upload"
  ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'counter_receipts' AND
    auth.role() IN ('contador', 'contador_jr')
  );`}</code></pre>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Storage Buckets Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h4 className="font-semibold mb-2">damage_photos</h4>
              <ul className="text-sm space-y-1">
                <li>• Acceso público para lectura</li>
                <li>• Solo taller puede subir</li>
                <li>• Máximo 10MB por archivo</li>
                <li>• Formatos: JPG, PNG</li>
                <li>• Nombres únicos con timestamp</li>
              </ul>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h4 className="font-semibold mb-2">invoices</h4>
              <ul className="text-sm space-y-1">
                <li>• Acceso restringido</li>
                <li>• Solo proveedor puede subir</li>
                <li>• Solo PDF y formatos de imagen</li>
                <li>• Validación de tamaño</li>
                <li>• Nombres basados en request_id</li>
              </ul>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h4 className="font-semibold mb-2">counter_receipts</h4>
              <ul className="text-sm space-y-1">
                <li>• Acceso restringido</li>
                <li>• Solo contador puede subir</li>
                <li>• Validación de formato</li>
                <li>• Nombres estandarizados</li>
                <li>• Backup automático</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityPermissions;