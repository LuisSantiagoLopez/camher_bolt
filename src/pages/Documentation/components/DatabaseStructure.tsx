import React from 'react';
import { Database, Key, Link, Table, Lock, FileText, User, Truck, Package, FileSpreadsheet, AlertTriangle } from 'lucide-react';

const DatabaseStructure: React.FC = () => {
  return (
    <section className="bg-white shadow rounded-lg p-8">
      <div className="flex items-center mb-6">
        <Database className="h-8 w-8 text-primary-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Estructura de la Base de Datos</h2>
      </div>

      <div className="prose max-w-none">
        {/* Schema Diagram */}
        <div className="mb-8 overflow-x-auto">
          <div className="min-w-[1200px] p-4">
            <div className="relative">
              {/* Core Tables */}
              <div className="grid grid-cols-3 gap-8 mb-16">
                {/* Profiles */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-blue-800">profiles</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Key className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-mono">id</span>
                      <span className="text-gray-500 ml-2">uuid</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">role</span>
                      <span className="text-gray-500 ml-2">user_role</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">email</span>
                      <span className="text-gray-500 ml-2">text</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">is_verified</span>
                      <span className="text-gray-500 ml-2">boolean</span>
                    </div>
                  </div>
                </div>

                {/* Units */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <Truck className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-green-800">units</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Key className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-mono">id</span>
                      <span className="text-gray-500 ml-2">uuid</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">name</span>
                      <span className="text-gray-500 ml-2">text</span>
                    </div>
                    <div className="flex items-center">
                      <Link className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="font-mono">created_by</span>
                      <span className="text-gray-500 ml-2">uuid → profiles</span>
                    </div>
                  </div>
                </div>

                {/* Providers */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center mb-2">
                    <Package className="h-5 w-5 text-purple-600 mr-2" />
                    <h4 className="font-semibold text-purple-800">providers</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Key className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-mono">id</span>
                      <span className="text-gray-500 ml-2">uuid</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">name</span>
                      <span className="text-gray-500 ml-2">text</span>
                    </div>
                    <div className="flex items-center">
                      <Link className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="font-mono">profile_id</span>
                      <span className="text-gray-500 ml-2">uuid → profiles</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">email</span>
                      <span className="text-gray-500 ml-2">text</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Request Tables */}
              <div className="grid grid-cols-2 gap-8 mb-16">
                {/* Part Requests */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-orange-600 mr-2" />
                    <h4 className="font-semibold text-orange-800">part_requests</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Key className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-mono">id</span>
                        <span className="text-gray-500 ml-2">uuid</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-mono">short_id</span>
                        <span className="text-gray-500 ml-2">text</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-mono">status</span>
                        <span className="text-gray-500 ml-2">request_status</span>
                      </div>
                      <div className="flex items-center">
                        <Link className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="font-mono">unit_id</span>
                        <span className="text-gray-500 ml-2">uuid → units</span>
                      </div>
                      <div className="flex items-center">
                        <Link className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="font-mono">created_by</span>
                        <span className="text-gray-500 ml-2">uuid → profiles</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <span className="font-mono">problem_description</span>
                        <span className="text-gray-500 ml-2">text</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-mono">mechanic_work</span>
                        <span className="text-gray-500 ml-2">text</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-mono">total_amount</span>
                        <span className="text-gray-500 ml-2">decimal</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-mono">invoice_number</span>
                        <span className="text-gray-500 ml-2">text</span>
                      </div>
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-600">Row Level Security</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parts */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <Package className="h-5 w-5 text-yellow-600 mr-2" />
                    <h4 className="font-semibold text-yellow-800">parts</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Key className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-mono">id</span>
                      <span className="text-gray-500 ml-2">uuid</span>
                    </div>
                    <div className="flex items-center">
                      <Link className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="font-mono">part_request_id</span>
                      <span className="text-gray-500 ml-2">uuid → part_requests</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">name</span>
                      <span className="text-gray-500 ml-2">text</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">cost</span>
                      <span className="text-gray-500 ml-2">decimal</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">quantity</span>
                      <span className="text-gray-500 ml-2">integer</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supporting Tables */}
              <div className="grid grid-cols-3 gap-8">
                {/* Weekly Tables */}
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <div className="flex items-center mb-2">
                    <FileSpreadsheet className="h-5 w-5 text-indigo-600 mr-2" />
                    <h4 className="font-semibold text-indigo-800">weekly_tables</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Key className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-mono">id</span>
                      <span className="text-gray-500 ml-2">uuid</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">week_start</span>
                      <span className="text-gray-500 ml-2">date</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">week_end</span>
                      <span className="text-gray-500 ml-2">date</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">status</span>
                      <span className="text-gray-500 ml-2">integer</span>
                    </div>
                  </div>
                </div>

                {/* Complaints */}
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <h4 className="font-semibold text-red-800">complaints</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Key className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-mono">id</span>
                      <span className="text-gray-500 ml-2">uuid</span>
                    </div>
                    <div className="flex items-center">
                      <Link className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="font-mono">part_request_id</span>
                      <span className="text-gray-500 ml-2">uuid → part_requests</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">description</span>
                      <span className="text-gray-500 ml-2">text</span>
                    </div>
                  </div>
                </div>

                {/* Verification Requests */}
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 text-pink-600 mr-2" />
                    <h4 className="font-semibold text-pink-800">verification_requests</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Key className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-mono">id</span>
                      <span className="text-gray-500 ml-2">uuid</span>
                    </div>
                    <div className="flex items-center">
                      <Link className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="font-mono">profile_id</span>
                      <span className="text-gray-500 ml-2">uuid → profiles</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono">status</span>
                      <span className="text-gray-500 ml-2">text</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Relationship Lines */}
              <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                  </marker>
                </defs>
                {/* Add your relationship lines here */}
              </svg>
            </div>
          </div>
        </div>

        {/* Enums Section */}
        <div className="space-y-6">
          <h3>Tipos Enumerados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">user_role</h4>
              <div className="space-y-1 text-sm">
                <div className="font-mono">taller</div>
                <div className="font-mono">taller_jr</div>
                <div className="font-mono">proveedor</div>
                <div className="font-mono">administrador</div>
                <div className="font-mono">contador</div>
                <div className="font-mono">contador_jr</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">repair_type</h4>
              <div className="space-y-1 text-sm">
                <div className="font-mono">llantas</div>
                <div className="font-mono">motor_tren_motriz</div>
                <div className="font-mono">aceite_motor</div>
                <div className="font-mono">suspension_acoplamiento</div>
                <div className="font-mono">electrico</div>
                <div className="font-mono">frenos</div>
                <div className="font-mono">hojalateria_pintura</div>
                <div className="font-mono">medidoras_bombas</div>
                <div className="font-mono">otro</div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Section */}
        <div className="mt-8">
          <h3>Almacenamiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 text-gray-600 mr-2" />
                <h4 className="font-semibold">damage_photos</h4>
              </div>
              <p className="text-sm text-gray-600">Fotos de daños en unidades</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FileSpreadsheet className="h-5 w-5 text-gray-600 mr-2" />
                <h4 className="font-semibold">invoices</h4>
              </div>
              <p className="text-sm text-gray-600">Facturas de proveedores</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FileSpreadsheet className="h-5 w-5 text-gray-600 mr-2" />
                <h4 className="font-semibold">counter_receipts</h4>
              </div>
              <p className="text-sm text-gray-600">Contra recibos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DatabaseStructure;