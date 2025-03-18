import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface Part {
  name: string;
  description: string;
  cost: number;
  quantity: number;
}

interface Props {
  parts: Part[];
  isImportant: boolean;
  isCashPayment: boolean;
  onPartsChange: (parts: Part[]) => void;
  onImportantChange: (value: boolean) => void;
  onCashPaymentChange: (value: boolean) => void;
}

const SolicitudPartes: React.FC<Props> = ({
  parts,
  isImportant,
  isCashPayment,
  onPartsChange,
  onImportantChange,
  onCashPaymentChange
}) => {
  const addPart = () => {
    onPartsChange([...parts, { name: '', description: '', cost: 0, quantity: 1 }]);
  };

  const removePart = (index: number) => {
    onPartsChange(parts.filter((_, i) => i !== index));
  };

  const updatePart = (index: number, field: keyof Part, value: string | number) => {
    const newParts = [...parts];
    if (field === 'cost') {
      // Ensure cost is a valid number or 0
      const numValue = parseFloat(value.toString()) || 0;
      newParts[index] = { ...newParts[index], [field]: numValue };
    } else if (field === 'quantity') {
      // Ensure quantity is a valid integer or 1
      const numValue = parseInt(value.toString()) || 1;
      newParts[index] = { ...newParts[index], [field]: numValue };
    } else {
      newParts[index] = { ...newParts[index], [field]: value };
    }
    onPartsChange(newParts);
  };

  const getTotalAmount = () => {
    return parts.reduce((sum, part) => sum + (part.cost * part.quantity), 0);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Solicitud de Partes</h3>
      
      {parts.map((part, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">Parte {index + 1}</h4>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removePart(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Minus className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                value={part.name}
                onChange={(e) => updatePart(index, 'name', e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <input
                type="text"
                value={part.description}
                onChange={(e) => updatePart(index, 'description', e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Costo (MXN)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={part.cost.toString()}
                onChange={(e) => updatePart(index, 'cost', e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={part.quantity.toString()}
                onChange={(e) => updatePart(index, 'quantity', e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addPart}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
      >
        <Plus className="h-5 w-5 mr-2" />
        Añadir otra parte
      </button>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isImportant}
            onChange={(e) => onImportantChange(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">¿Importante?</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isCashPayment}
            onChange={(e) => onCashPaymentChange(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">¿Será pago de contado?</span>
        </label>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-lg font-medium text-gray-900">
          Total: ${getTotalAmount().toLocaleString('es-MX')} MXN
        </p>
      </div>
    </div>
  );
};

export default SolicitudPartes;