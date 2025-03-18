import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { PartRequest, RepairType, Unit, Provider } from '../../../types';
import ReporteFalla from '../steps/ReporteFalla';
import OrdenTrabajo from '../steps/OrdenTrabajo';
import SolicitudPartes from '../steps/SolicitudPartes';
import AutorizacionPartes from '../steps/AutorizacionPartes';

interface Props {
  request: PartRequest;
  onClose: () => void;
  onUpdated: () => void;
}

const TallerEditMode: React.FC<Props> = ({ request, onClose, onUpdated }) => {
  const [step, setStep] = useState(1);
  const [units, setUnits] = useState<Unit[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [parts, setParts] = useState<Array<{ name: string; description: string; cost: number; quantity: number }>>([]);
  const [error, setError] = useState('');

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load units and providers
      const [unitsResponse, providersResponse, partsResponse] = await Promise.all([
        supabase.from('units').select('*').order('name'),
        supabase.from('providers').select('*').order('name'),
        supabase.from('parts').select('*').eq('part_request_id', request.id)
      ]);

      if (unitsResponse.error) throw unitsResponse.error;
      if (providersResponse.error) throw providersResponse.error;
      if (partsResponse.error) throw partsResponse.error;

      setUnits(unitsResponse.data || []);
      setProviders(providersResponse.data || []);
      setParts(partsResponse.data?.length > 0 ? partsResponse.data : [{ name: '', description: '', cost: 0, quantity: 1 }]);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar los datos');
    }
  };

  // Form state with initial values from request
  const [reporteData, setReporteData] = useState({
    unit_id: request.unit_id || '',
    problem_location: request.problem_location || '',
    operator_detected: request.operator_detected || '',
    problem_description: request.problem_description || '',
    damaged_parts_location: request.damaged_parts_location || '',
  });

  const [ordenData, setOrdenData] = useState({
    mechanic_work: request.mechanic_work || '',
    assigned_mechanic: request.assigned_mechanic || '',
    repair_type: request.repair_type || '' as RepairType | '',
    repair_type_other: request.repair_type_other || '',
    observations: request.observations || '',
  });

  const [isImportant, setIsImportant] = useState(request.is_important || false);
  const [isCashPayment, setIsCashPayment] = useState(request.is_cash_payment || false);
  const [damagePhoto, setDamagePhoto] = useState<File | null>(null);
  const [selectedProvider, setSelectedProvider] = useState(request.provider_id || '');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [editMessage, setEditMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let photoUrl = request.damage_photo_url;

      // Handle photo upload if exists
      if (damagePhoto) {
        const fileExt = damagePhoto.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('damage_photos')
          .upload(fileName, damagePhoto);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('damage_photos')
          .getPublicUrl(fileName);

        photoUrl = publicUrl;
      }

      // Update request - only send fields that exist in the database
      const { error: updateError } = await supabase
        .from('part_requests')
        .update({
          unit_id: reporteData.unit_id,
          problem_location: reporteData.problem_location,
          operator_detected: reporteData.operator_detected,
          problem_description: reporteData.problem_description,
          damaged_parts_location: reporteData.damaged_parts_location,
          mechanic_work: ordenData.mechanic_work,
          assigned_mechanic: ordenData.assigned_mechanic,
          repair_type: ordenData.repair_type,
          repair_type_other: ordenData.repair_type_other,
          observations: ordenData.observations,
          status: selectedStatus,
          edit_message: editMessage,
          is_important: isImportant,
          is_cash_payment: isCashPayment,
          provider_id: selectedProvider,
          damage_photo_url: photoUrl,
          total_amount: parts.reduce((sum, part) => sum + (part.cost * part.quantity), 0),
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      // Update parts
      if (parts.length > 0) {
        // First delete existing parts
        await supabase
          .from('parts')
          .delete()
          .eq('part_request_id', request.id);

        // Then insert new parts
        const { error: partsError } = await supabase
          .from('parts')
          .insert(
            parts.map(part => ({
              part_request_id: request.id,
              name: part.name,
              description: part.description,
              cost: part.cost,
              quantity: part.quantity
            }))
          );

        if (partsError) throw partsError;
      }

      onUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating request:', error);
      setError('Error al actualizar la solicitud');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Editar Solicitud #{request.short_id}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              {[
                { id: 'reporte', name: 'Reporte de Falla' },
                { id: 'orden', name: 'Orden de Trabajo' },
                { id: 'solicitud', name: 'Solicitud de Partes' },
                { id: 'autorizacion', name: 'Autorización de Partes' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStep(tab.id === 'reporte' ? 1 : tab.id === 'orden' ? 2 : tab.id === 'solicitud' ? 3 : 4)}
                  className={`
                    w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                    ${step === (tab.id === 'reporte' ? 1 : tab.id === 'orden' ? 2 : tab.id === 'solicitud' ? 3 : 4)
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <ReporteFalla
                  units={units}
                  data={reporteData}
                  onChange={setReporteData}
                />
              )}

              {step === 2 && (
                <OrdenTrabajo
                  data={ordenData}
                  onChange={setOrdenData}
                />
              )}

              {step === 3 && (
                <SolicitudPartes
                  parts={parts}
                  isImportant={isImportant}
                  isCashPayment={isCashPayment}
                  onPartsChange={setParts}
                  onImportantChange={setIsImportant}
                  onCashPaymentChange={setIsCashPayment}
                />
              )}

              {step === 4 && (
                <AutorizacionPartes
                  providers={providers}
                  selectedProvider={selectedProvider}
                  damagePhoto={damagePhoto}
                  onProviderChange={setSelectedProvider}
                  onPhotoChange={setDamagePhoto}
                  existingPhotoUrl={request.damage_photo_url}
                />
              )}

              {/* Status Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Seleccionar Nuevo Estado</h3>
                <div className="space-y-2">
                  {[
                    { value: 'status_1', label: 'Reporte de Falla', description: 'La solicitud volverá a la fase inicial de reporte.' },
                    { value: 'status_2', label: 'Orden de Trabajo', description: 'Proceder con la orden de trabajo mecánico.' },
                    { value: 'status_3', label: 'Solicitud de Partes', description: 'Crear lista de partes necesarias.' },
                    { value: 'status_4', label: 'Autorización de Partes', description: 'Enviar para autorización de compra.' },
                    { value: 'status_5', label: 'Pendiente Administrador', description: 'Enviar a aprobación administrativa (monto > $800).' },
                    { value: 'status_6', label: 'Pendiente Proveedor', description: 'Enviar directamente al proveedor.' },
                  ].map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setSelectedStatus(status.value)}
                      className={`w-full p-4 text-left border rounded-lg transition-colors ${
                        selectedStatus === status.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{status.label}</div>
                      <div className="mt-1 text-sm text-gray-500">{status.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mensaje de Edición
                </label>
                <textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Explica los cambios realizados..."
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t p-6">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!selectedStatus || !editMessage}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TallerEditMode;