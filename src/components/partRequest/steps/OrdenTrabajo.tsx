import React from 'react';
import { RepairType } from '../../../types';

interface OrdenData {
  mechanic_work: string;
  assigned_mechanic: string;
  repair_type: RepairType | '';
  repair_type_other: string;
  observations: string;
}

interface Props {
  data: OrdenData;
  onChange: (data: OrdenData) => void;
}

const OrdenTrabajo: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (updates: Partial<OrdenData>) => {
    onChange({ ...data, ...updates });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Orden de Trabajo</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Trabajos a efectuar
        </label>
        <textarea
          value={data.mechanic_work}
          onChange={(e) => handleChange({ mechanic_work: e.target.value })}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Mecánico asignado
        </label>
        <input
          type="text"
          value={data.assigned_mechanic}
          onChange={(e) => handleChange({ assigned_mechanic: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de reparación
        </label>
        <select
          value={data.repair_type}
          onChange={(e) => handleChange({ repair_type: e.target.value as RepairType | '' })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Seleccionar tipo...</option>
          <option value="llantas">Llantas</option>
          <option value="motor_tren_motriz">Motor tren motriz</option>
          <option value="aceite_motor">Aceite motor</option>
          <option value="suspension_acoplamiento">Suspensión y acoplamiento</option>
          <option value="electrico">Eléctrico</option>
          <option value="frenos">Frenos</option>
          <option value="hojalateria_pintura">Hojalatería y Pintura</option>
          <option value="medidoras_bombas">Medidoras y Bombas</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {data.repair_type === 'otro' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Especificar otro tipo de reparación
          </label>
          <input
            type="text"
            value={data.repair_type_other}
            onChange={(e) => handleChange({ repair_type_other: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Observaciones
        </label>
        <textarea
          value={data.observations}
          onChange={(e) => handleChange({ observations: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
    </div>
  );
};

export default OrdenTrabajo;