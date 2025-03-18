import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { PartRequest, RepairType } from '../../../types';
import ReporteFalla from '../steps/ReporteFalla';
import OrdenTrabajo from '../steps/OrdenTrabajo';
import SolicitudPartes from '../steps/SolicitudPartes';
import AutorizacionPartes from '../steps/AutorizacionPartes';

interface Props {
  request: PartRequest;
  onClose: () => void;
  onUpdated: () => void;
}

const AdminEditMode: React.FC<Props> = ({ request, onClose, onUpdated }) => {
  const [step, setStep] = useState(1);
  const [units, setUnits] = useState([]);
  const [providers, setProviders] = useState([]);
  const [parts, setParts] = useState<Array<{ name: string; description: string; cost: number; quantity: number }>>(
    request.parts || [{ name: '', description: '', cost: 0, quantity: 1 }]
  );
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [editMessage, setEditMessage] = useState('');

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
  const [invoiceNumber, setInvoiceNumber] = useState(request.invoice_number || '');

  // Add new state variables for file uploads
  const [newInvoice, setNewInvoice] = useState<File | null>(null);
  const [newCounterReceipt, setNewCounterReceipt] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [unitsResponse, providersResponse] = await Promise.all([
        supabase.from('units').select('*').order('name'),
        supabase.from('providers').select('*').order('name')
      ]);

      if (unitsResponse.error) throw unitsResponse.error;
      if (providersResponse.error) throw providersResponse.error;

      setUnits(unitsResponse.data || []);
      setProviders(providersResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar los datos');
    }
  };

  // Add file upload handlers
  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewInvoice(e.target.files[0]);
    }
  };

  const handleCounterReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCounterReceipt(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus || !editMessage) return;

    try {
      let photoUrl = request.damage_photo_url;
      let invoiceUrl = request.invoice_url;
      let counterReceiptUrl = request.counter_receipt_url;

      // Handle damage photo upload
      if (damagePhoto) {
        const fileExt = damagePhoto.name.split('.').pop();
        const fileName = `${Date.now()}-damage.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('damage_photos')
          .upload(fileName, damagePhoto);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('damage_photos')
          .getPublicUrl(fileName);

        photoUrl = publicUrl;
      }

      // Handle invoice upload
      if (newInvoice) {
        const fileExt = newInvoice.name.split('.').pop();
        const fileName = `${Date.now()}-invoice.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('invoices')
          .upload(fileName, newInvoice);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('invoices')
          .getPublicUrl(fileName);

        invoiceUrl = publicUrl;
      }

      // Handle counter receipt upload
      if (newCounterReceipt) {
        const fileExt = newCounterReceipt.name.split('.').pop();
        const fileName = `${Date.now()}-counter-receipt.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('counter_receipts')
          .upload(fileName, newCounterReceipt);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('counter_receipts')
          .getPublicUrl(fileName);

        counterReceiptUrl = publicUrl;
      }

      // Update request
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
          is_important: isImportant,
          is_cash_payment: isCashPayment,
          provider_id: selectedProvider,
          damage_photo_url: photoUrl,
          invoice_url: invoiceUrl,
          counter_receipt_url: counterReceiptUrl,
          invoice_number: invoiceNumber,
          total_amount: parts.reduce((sum, part) => sum + (part.cost * part.quantity), 0),
          status: selectedStatus,
          edit_message: editMessage,
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      // Update parts
      if (parts.length > 0) {
        await supabase
          .from('parts')
          .delete()
          .eq('part_request_id', request.id);

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

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {[
              { id: 1, name: 'Reporte de Falla' },
              { id: 2, name: 'Orden de Trabajo' },
              { id: 3, name: 'Solicitud de Partes' },
              { id: 4, name: 'Autorización de Partes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStep(tab.id)}
                className={`
                  w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                  ${step === tab.id
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

        <div className="flex-1 overflow-y-auto p-6">
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
              <>
                <AutorizacionPartes
                  providers={providers}
                  selectedProvider={selectedProvider}
                  damagePhoto={damagePhoto}
                  onProviderChange={setSelectedProvider}
                  onPhotoChange={setDamagePhoto}
                  existingPhotoUrl={request.damage_photo_url}
                />

                <div className="space-y-6 mt-6">
                  <h4 className="text-lg font-medium text-gray-900">Gestión de Archivos</h4>
                  
                  {/* Invoice Management */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Factura
                    </label>
                    {request.invoice_url && (
                      <div className="mt-2 flex items-center space-x-4">
                        <a
                          href={request.invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-500"
                        >
                          Ver factura actual
                        </a>
                      </div>
                    )}
                    <div className="mt-2">
                      <input
                        type="file"
                        onChange={handleInvoiceChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                      {newInvoice && (
                        <p className="mt-2 text-sm text-gray-500">
                          Nueva factura seleccionada: {newInvoice.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Counter Receipt Management */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contra Recibo
                    </label>
                    {request.counter_receipt_url && (
                      <div className="mt-2 flex items-center space-x-4">
                        <a
                          href={request.counter_receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-500"
                        >
                          Ver contra recibo actual
                        </a>
                      </div>
                    )}
                    <div className="mt-2">
                      <input
                        type="file"
                        onChange={handleCounterReceiptChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                      {newCounterReceipt && (
                        <p className="mt-2 text-sm text-gray-500">
                          Nuevo contra recibo seleccionado: {newCounterReceipt.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status 13 Revocation */}
                  {request.status === 'status_13' && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h5 className="text-sm font-medium text-red-800">Revocar Aprobación Final</h5>
                      <p className="mt-1 text-sm text-red-600">
                        Al cambiar el estado de esta solicitud, se revocará la aprobación final.
                        Asegúrate de incluir una razón clara en el mensaje de edición.
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Facturación fields */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Número de Factura
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </>
            )}

            {/* Status Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Seleccionar Nuevo Estado</h3>
              <div className="space-y-2">
                {[
                  { value: 'status_minus_1', label: 'Cancelada', description: 'Cancelar la solicitud permanentemente.' },
                  { value: 'status_1', label: 'Reporte de Falla', description: 'Volver al inicio del proceso.' },
                  { value: 'status_2', label: 'Orden de Trabajo', description: 'Volver a la orden de trabajo.' },
                  { value: 'status_3', label: 'Solicitud de Partes', description: 'Volver a la solicitud de partes.' },
                  { value: 'status_4', label: 'Autorización de Partes', description: 'Volver a autorización.' },
                  { value: 'status_5', label: 'Pendiente Administrador', description: 'Enviar a aprobación administrativa.' },
                  { value: 'status_6', label: 'Pendiente Proveedor', description: 'Enviar a proveedor.' },
                  { value: 'status_7', label: 'Verificación de Partes', description: 'Enviar a verificación.' },
                  { value: 'status_8', label: 'Subir Factura', description: 'Proceder a subir factura.' },
                  { value: 'status_9', label: 'Número de Factura', description: 'Ingresar número de factura.' },
                  { value: 'status_10', label: 'Aprobación Contador Jr', description: 'Enviar a aprobación contable.' },
                  { value: 'status_11', label: 'Verificación Factura', description: 'Verificar número de factura.' },
                  { value: 'status_12', label: 'Contra Recibo', description: 'Subir contra recibo.' },
                  { value: 'status_13', label: 'Aprobación Final', description: 'Aprobar finalmente la solicitud.' },
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

export default AdminEditMode;