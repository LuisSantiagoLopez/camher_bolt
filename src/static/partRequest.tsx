import { useState, useEffect } from 'react';
import Head from 'next/head';
import TextInput from '#/TextInput';
import Button from '#/Button';
import { motion } from 'framer-motion';
import React from 'react';
import { partPropsWithSetter } from '@/types/partTypes';
import {
  queryAllUnits,
  createLinkedPart,
  getCurrentTableID,
} from '@/helpers/helperFunUnit';
import { updatePartReq, queryPart } from '@/helpers/helperFunPart';
import { UnitT as Unit } from '@/graphql';
import UnitQueryDropdown from '@/components/ui/UnitQueryDropdown';
import ToggleButton from '@/components/ui/ToggleButton';
import NumberInput from '@/components/counterButton';

interface PartItem {
  id: number;
  description: string;
  unitaryPrice: number;
  quantity: number;
}

export default function PartRequest({ handleButton1, partID, setPartID }: partPropsWithSetter) {
  // Estado principal
  const [parts, setParts] = useState<PartItem[]>([{
    id: 1,
    description: '',
    unitaryPrice: 0,
    quantity: 1
  }]);
  
  // Estados de configuración
  const [isImportant, setIsImportant] = useState(false);
  const [isCash, setIsCash] = useState(false);
  const [unidad, setUnidad] = useState<Unit>();
  
  // Estados de datos
  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [currentTableID, setCurrentTableID] = useState('');
  const [total, setTotal] = useState(0);
  
  // Estados de UI
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        // Si estamos editando una parte existente
        if (partID) {
          const existingPart = await queryPart(partID);
          if (existingPart?.partReq) {
            const { partDescription, unitaryPrice, quantity, isCash: cashValue, isImportant: importantValue } = existingPart.partReq;
            
            if (partDescription && unitaryPrice && quantity) {
              const loadedParts = partDescription.map((desc, index) => ({
                id: index + 1,
                description: desc || '',
                unitaryPrice: unitaryPrice[index] || 0,
                quantity: quantity[index] || 1 // Ensure quantity is set with fallback to 1
              }));
              
              setParts(loadedParts);
              setIsCash(cashValue || false);
              setIsImportant(importantValue || false);
              setUnidad(existingPart.Unit);
              
              // Calculate initial total
              const initialTotal = loadedParts.reduce(
                (sum, part) => sum + (part.unitaryPrice * part.quantity), 
                0
              );
              setTotal(initialTotal);
            }
          }
        } 
        // Si es una nueva parte
        else {
          const [units, tableID] = await Promise.all([
            queryAllUnits(),
            getCurrentTableID()
          ]);
          
          if (!units?.length) {
            throw new Error('No hay unidades disponibles');
          }
          if (!tableID) {
            throw new Error('No se encontró una tabla activa');
          }
          
          setAllUnits(units);
          setCurrentTableID(tableID);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando datos');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [partID]);

  // Update total when parts change
  useEffect(() => {
    const newTotal = parts.reduce((sum, part) => 
      sum + (part.unitaryPrice * part.quantity), 
      0
    );
    setTotal(newTotal);
  }, [parts]);

  // Part management functions
  const addPart = () => {
    setParts(current => [
      ...current,
      {
        id: current.length + 1,
        description: '',
        unitaryPrice: 0,
        quantity: 1
      }
    ]);
  };

  const updatePart = (id: number, field: keyof PartItem, value: any) => {
    setParts(current => current.map(part => {
      if (part.id === id) {
        if (field === 'unitaryPrice') {
          return { ...part, [field]: parseFloat(value) || 0 };
        }
        if (field === 'quantity') {
          return { ...part, [field]: parseInt(value) || 1 };
        }
        return { ...part, [field]: value };
      }
      return part;
    }));
  };

  const removePart = (id: number) => {
    if (parts.length > 1) {
      setParts(current => current.filter(part => part.id !== id));
    }
  };

  // Form validation
  const isValid = () => {
    return parts.every(part => 
      part.description.trim() !== '' && 
      part.quantity > 0 && 
      part.unitaryPrice >= 0
    ) && (!!partID || !!unidad);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isValid()) {
      setError('Por favor complete todos los campos correctamente');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let finalPartID = partID;

      // Create new part if needed
      if (!finalPartID) {
        if (!unidad?.id || !currentTableID) {
          throw new Error('Datos de unidad o tabla faltantes');
        }
        const newPart = await createLinkedPart(unidad.id, currentTableID);
        if (!newPart?.id) {
          throw new Error('Error al crear la parte');
        }
        finalPartID = newPart.id;
        setPartID(newPart.id);
      }

      // Update the part
      await updatePartReq({
        id: finalPartID,
        status: 4,
        partReq: {
          partDescription: parts.map(p => p.description),
          price: total,
          quantity: parts.map(p => p.quantity),
          unitaryPrice: parts.map(p => p.unitaryPrice),
          isCash,
          isImportant,
        },
      });

      handleButton1();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-camherdarkyellow border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Solicitud de Partes</title>
        <meta name="description" content="Solicitud de partes Camher" />
      </Head>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-center text-4xl font-bold">Solicitud de Partes</h1>
        
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {!partID && (
          <div className="mb-8">
            <UnitQueryDropdown
              options={allUnits}
              setOption={setUnidad}
              placeholder="Seleccionar unidad..."
              className="w-full"
            />
          </div>
        )}

        <div className="space-y-6">
          {parts.map((part) => (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-white p-6 shadow-md"
            >
              <div className="space-y-4">
                <TextInput
                  intent="long"
                  placeholder="Descripción detallada de la parte"
                  value={part.description}
                  onChange={(e) => updatePart(part.id, 'description', e.target.value)}
                />
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <TextInput
                      intent="regular"
                      type="number"
                      placeholder="Precio unitario"
                      value={part.unitaryPrice || ''}
                      onChange={(e) => updatePart(part.id, 'unitaryPrice', e.target.value)}
                    />
                  </div>

                  <div className="w-32">
                    <NumberInput
                      initialValue={part.quantity}
                      title="Cantidad"
                      min={1}
                      onChange={(value) => updatePart(part.id, 'quantity', value)}
                    />
                  </div>

                  {parts.length > 1 && (
                    <button
                      onClick={() => removePart(part.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          <button
            onClick={addPart}
            className="mx-auto block rounded-full bg-camhergreen px-6 py-3 text-lg font-semibold text-black shadow-md hover:bg-green-400 transition-all"
          >
            + Agregar Parte
          </button>
        </div>

        <div className="mt-8 space-y-4">
          <ToggleButton
            title="¿Es importante?"
            toggle={isImportant}
            onChange={setIsImportant}
          />
          
          <ToggleButton
            title="¿Pago de contado?"
            toggle={isCash}
            onChange={setIsCash}
          />
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800">
            Total: ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
          </h2>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            intent="green"
            onClick={handleSubmit}
            disabled={!isValid() || isLoading}
          >
            {isLoading ? 'Procesando...' : 'IR'}
          </Button>
        </div>
      </div>
    </>
  );
}