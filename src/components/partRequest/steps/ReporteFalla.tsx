import React from 'react';
import { Unit } from '../../../types';

interface ReporteData {
  unit_id: string;
  problem_location: string;
  operator_detected: string;
  problem_description: string;
  damaged_parts_location: string;
  needs_parts: boolean | null;
  no_parts_needed: boolean;
}

interface Props {
  units: Unit[];
  data: ReporteData;
  onChange: (data: ReporteData) => void;
}

const ReporteFalla: React.FC<Props> = ({ units, data, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Reporte de Falla</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Selecciona unidad
        </label>
        <select
          value={data.unit_id}
          onChange={(e) => onChange({ ...data, unit_id: e.target.value })}
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
          value={data.problem_location}
          onChange={(e) => onChange({ ...data, problem_location: e.target.value })}
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
          value={data.operator_detected}
          onChange={(e) => onChange({ ...data, operator_detected: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Describe el problema
        </label>
        <textarea
          value={data.problem_description}
          onChange={(e) => onChange({ ...data, problem_description: e.target.value })}
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
          value={data.damaged_parts_location}
          onChange={(e) => onChange({ ...data, damaged_parts_location: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-700">Selecciona una opción:</p>

        <button
          type="button"
          onClick={() => onChange({ ...data, needs_parts: false, no_parts_needed: false })}
          className={`w-full p-4 text-left border rounded-lg ${
            data.needs_parts === false && !data.no_parts_needed
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
          onClick={() => onChange({ ...data, needs_parts: true, no_parts_needed: false })}
          className={`w-full p-4 text-left border rounded-lg ${
            data.needs_parts === true && !data.no_parts_needed
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
          onClick={() => onChange({ ...data, needs_parts: false, no_parts_needed: true })}
          className={`w-full p-4 text-left border rounded-lg ${
            data.no_parts_needed
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
  );
};

export default ReporteFalla;