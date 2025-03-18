import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest, Unit, Provider, RepairType } from '../../types';
import { useAuthStore } from '../../store/auth';
import { sendProviderNewRequestEmail } from '../../services/email';
import ReporteFalla from './steps/ReporteFalla';
import OrdenTrabajo from './steps/OrdenTrabajo';
import SolicitudPartes from './steps/SolicitudPartes';
import AutorizacionPartes from './steps/AutorizacionPartes';

interface Props {
  request?: PartRequest;
  units: Unit[];
  providers: Provider[];
  onClose: () => void;
  onSubmitted: () => void;
}

const CompletePartRequest: React.FC<Props> = ({ request, units, providers, onClose, onSubmitted }) => {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [editMessage] = useState('');
  const [returnStatus] = useState<string>('');
  const [error, setError] = useState('');

  // Form state...
  const [reporteData, setReporteData] = useState({
    unit_id: request?.unit_id || '',
    problem_location: request?.problem_location || '',
    operator_detected: request?.operator_detected || '',
    problem_description: request?.problem_description || '',
    damaged_parts_location: request?.damaged_parts_location || '',
    needs_parts: request?.status === 'status_2' ? true : null as boolean | null,
    no_parts_needed: false
  });

  const [ordenData, setOrdenData] = useState({
    mechanic_work: request?.mechanic_work || '',
    assigned_mechanic: request?.assigned_mechanic || '',
    repair_type: request?.repair_type || '' as RepairType | '',
    repair_type_other: request?.repair_type_other || '',
    observations: request?.observations || '',
  });

  const [parts, setParts] = useState<Array<{ name: string; description: string; cost: number; quantity: number }>>([
    { name: '', description: '', cost: 0, quantity: 1 }
  ]);
  const [isImportant, setIsImportant] = useState(request?.is_important || false);
  const [isCashPayment, setIsCashPayment] = useState(request?.is_cash_payment || false);

  const [damagePhoto, setDamagePhoto] = useState<File | null>(null);
  const [selectedProvider, setSelectedProvider] = useState(request?.provider_id || '');

  const getTotalAmount = () => {
    return parts.reduce((sum, part) => sum + (part.cost * part.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      let newStatus = '';
      let photoUrl = null;

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

      // Calculate total amount
      const totalAmount = getTotalAmount();

      // Determine new status based on step and conditions
      switch (step) {
        case 1:
          newStatus = 'status_2';
          break;
        case 2:
          newStatus = 'status_3';
          break;
        case 3:
          newStatus = 'status_4';
          break;
        case 4:
          newStatus = totalAmount > 800 ? 'status_5' : 'status_6';
          break;
        default:
          newStatus = returnStatus || request?.status || 'status_1';
      }

      // Create base request data
      const requestData: any = {
        id: request?.id,
        unit_id: reporteData.unit_id,
        problem_location: reporteData.problem_location,
        operator_detected: reporteData.operator_detected,
        problem_description: reporteData.problem_description,
        damaged_parts_location: reporteData.damaged_parts_location,
        status: newStatus,
        edit_message: editMessage || null,
        created_by: request?.created_by || user.id,
        mechanic_work: ordenData.mechanic_work,
        assigned_mechanic: ordenData.assigned_mechanic,
        repair_type: ordenData.repair_type as RepairType,
        repair_type_other: ordenData.repair_type_other,
        observations: ordenData.observations,
        is_important: isImportant,
        is_cash_payment: isCashPayment,
        provider_id: selectedProvider || null,
        damage_photo_url: photoUrl || request?.damage_photo_url,
        total_amount: totalAmount,
      };

      // Create or update part request
      const { data: updatedRequest, error } = await supabase
        .from('part_requests')
        .upsert(requestData)
        .select()
        .single();

      if (error) throw error;

      // Create parts records if we're at step 3 or beyond
      if (step >= 3) {
        const { error: partsError } = await supabase
          .from('parts')
          .insert(
            parts.map(part => ({
              part_request_id: updatedRequest.id,
              name: part.name,
              description: part.description,
              cost: part.cost,
              quantity: part.quantity
            }))
          );

        if (partsError) throw partsError;
      }

      // Send email to provider if status is 6 (pending provider)
      if (newStatus === 'status_6' && selectedProvider) {
        try {
          // Get provider details
          const { data: provider } = await supabase
            .from('providers')
            .select('name, email')
            .eq('id', selectedProvider)
            .single();

          if (provider && provider.email) {
            const requestDetails = `
              <ul style="list-style-type: none; padding: 0;">
                <li><strong>Unidad:</strong> ${(updatedRequest as any).unit?.name || 'N/A'}</li>
                <li><strong>Ubicación del Problema:</strong> ${updatedRequest.problem_location}</li>
                <li><strong>Descripción:</strong> ${updatedRequest.problem_description}</li>
                <li><strong>Trabajo Mecánico:</strong> ${updatedRequest.mechanic_work}</li>
                <li><strong>Mecánico Asignado:</strong> ${updatedRequest.assigned_mechanic}</li>
                <li><strong>Monto Total:</strong> $${totalAmount.toLocaleString('es-MX')} MXN</li>
              </ul>
            `;

            const emailResult = await sendProviderNewRequestEmail(
              provider.email,
              provider.name,
              updatedRequest.short_id,
              requestDetails
            );

            if (!emailResult.success) {
              console.error('Failed to send email notification:', emailResult.error);
              // We don't throw here - just log the error and continue
            }
          }
        } catch (emailError) {
          // Log email error but don't fail the request
          console.error('Error preparing/sending email notification:', emailError);
        }
      }

      onSubmitted();
      onClose();
    } catch (error) {
      console.error('Error saving part request:', error);
      setError('Error al guardar la solicitud. Por favor intente nuevamente.');
    }
  };

  // Determine if we're editing an existing request
  const isEditing = !!request;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar Solicitud' : 'Nueva Solicitud'} - Paso {step} de 4
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <div className={isEditing ? 'opacity-70 pointer-events-none' : ''}>
              <ReporteFalla
                units={units}
                data={reporteData}
                onChange={setReporteData}
              />
            </div>
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
            />
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Anterior
              </button>
            )}
            <div className="flex justify-end flex-1 ml-3">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Guardar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompletePartRequest;