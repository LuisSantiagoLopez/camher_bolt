import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Unit } from '../../types';
import { useAuthStore } from '../../store/auth';

interface Props {
  units: Unit[];
  onClose: () => void;
  onCreated: () => void;
}

const CreatePartRequest: React.FC<Props> = ({ units, onClose, onCreated }) => {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    unit_id: '',
    problem_location: '',
    operator_detected: '',
    problem_description: '',
    damaged_parts_location: '',
    needs_parts: null as boolean | null,
    no_parts_needed: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('part_requests').insert({
        unit_id: formData.unit_id,
        problem_location: formData.problem_location,
        operator_detected: formData.operator_detected,
        problem_description: formData.problem_description,
        damaged_parts_location: formData.damaged_parts_location,
        status: formData.no_parts_needed ? 'status_13' : formData.needs_parts === false ? 'status_1' : 'status_2',
        created_by: user.id,
      });

      if (error) throw error;

      onCreated();
    } catch (error) {
      console.error('Error creating part request:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Nueva Solicitud de Partes
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Selecciona unidad
                </label>
                <select
                  value={formData.unit_id}
                  onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Seleccionar unidad...</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Describe dónde está el problema
                </label>
                <input
                  type="text"
                  value={formData.problem_location}
                  onChange={(e) => setFormData({ ...formData, problem_location: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ¿Qué operador detectó la falla?
                </label>
                <input
                  type="text"
                  value={formData.operator_detected}
                  onChange={(e) => setFormData({ ...formData, operator_detected: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Describe el problema
                </label>
                <textarea
                  value={formData.problem_description}
                  onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ¿Dónde están las partes dañadas?
                </label>
                <input
                  type="text"
                  value={formData.damaged_parts_location}
                  onChange={(e) => setFormData({ ...formData, damaged_parts_location: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Siguiente
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-4">
                <p className="text-lg font-medium text-gray-900">
                  ¿Qué deseas hacer con esta solicitud?
                </p>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, needs_parts: false, no_parts_needed: false })}
                    className={`w-full p-4 text-left border rounded-lg ${
                      formData.needs_parts === false && !formData.no_parts_needed
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="font-medium">
                      Voy a esperar a que un mecánico decida si se tienen que comprar refacciones
                    </div>
                    <div className="text-sm text-gray-500">
                      La solicitud quedará en espera hasta que se determine si se necesitan piezas
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, needs_parts: true, no_parts_needed: false })}
                    className={`w-full p-4 text-left border rounded-lg ${
                      formData.needs_parts === true && !formData.no_parts_needed
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="font-medium">
                      El mecánico ya revisó la unidad y decidió que sí se tienen que comprar piezas
                    </div>
                    <div className="text-sm text-gray-500">
                      Continuaremos con el proceso de solicitud de piezas
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, needs_parts: false, no_parts_needed: true })}
                    className={`w-full p-4 text-left border rounded-lg ${
                      formData.no_parts_needed
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="font-medium">
                      El mecánico decidió que no se tienen que comprar partes
                    </div>
                    <div className="text-sm text-gray-500">
                      La solicitud se cerrará permanentemente sin necesidad de comprar partes
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button
                  type="submit"
                  disabled={formData.needs_parts === null && !formData.no_parts_needed}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  Crear Solicitud
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePartRequest;