import { useState, useEffect } from 'react';
import Head from 'next/head';
import TextInput from '#/TextInput';
import Button from '#/Button';
import { partPropsWithSetter } from '@/types/partTypes';
import {
  queryAllUnits,
  createLinkedPart,
  getCurrentTableID,
} from '@/helpers/helperFunUnit';
import { updateFailureReport, queryPart } from '@/helpers/helperFunPart';
import { UnitT as Unit } from '@/graphql';
import UnitQueryDropdown from '@/components/ui/UnitQueryDropdown';

export default function FailureReport({
  handleButton1,
  setPartID,
  partID,
}: partPropsWithSetter) {
  const [unidad, setUnidad] = useState<Unit>();
  const [localizacion, setLocalizacion] = useState('');
  const [operador, setOperador] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [currentTableID, setCurrentTableID] = useState('');

  useEffect(() => {
    getUnits();
    getCurrentTable();
    
    // Load existing part data if editing
    const loadExistingPart = async () => {
      if (partID) {
        const part = await queryPart(partID);
        if (part && part.failureReport) {
          setLocalizacion(part.failureReport.problemLocation || '');
          setOperador(part.failureReport.operator || '');
          setDescripcion(part.failureReport.description || '');
          if (part.Unit) {
            setUnidad(part.Unit);
          }
        }
      }
    };
    
    loadExistingPart();
  }, [partID]);

  const getUnits = async () => {
    try {
      const units = await queryAllUnits();
      if (!units || units.length === 0) {
        console.warn('No units found.');
        alert('No se encontraron unidades. Verifica tu conexión o datos.');
        return;
      }
      setAllUnits(units);
    } catch (error) {
      console.error('Error getting Units:', error);
    }
  };

  const getCurrentTable = async () => {
    try {
      const currentTableID = await getCurrentTableID();
      if (!currentTableID) {
        console.warn('No current table found.');
        alert('No hay una tabla actual. Por favor, crea una antes de continuar.');
        return;
      }
      setCurrentTableID(currentTableID);
    } catch (error) {
      console.error('Error fetching current table:', error);
      alert(`Error obteniendo la tabla actual: ${error}`);
    }
  };

  async function handleButtonClick() {
    if (!validateFields()) {
      alert('Llena todos los campos para continuar');
      return;
    }

    if (!unidad && !partID) {
      alert('Selecciona una unidad para continuar');
      return;
    }

    if (!currentTableID && !partID) {
      alert('No se encontró una tabla actual. Por favor, crea una antes de continuar.');
      return;
    }

    try {
      let localPart = partID;
      
      if (!localPart) {
        console.log('Creating linked part with unidad:', unidad, 'and tableID:', currentTableID);
        const part = await createLinkedPart(unidad!.id, currentTableID);
        if (!part) {
          console.warn('No part was created.');
          alert('No se pudo crear la refacción. Intenta de nuevo.');
          return;
        }
        localPart = part.id;
        setPartID(part.id);
      }

      console.log('Updating failure report for part:', localPart);

      const currentTime = new Date();
      const MutationPart = {
        id: localPart,
        status: 1,
        reqDate: currentTime.toISOString(),
        failureReport: {
          problemLocation: localizacion,
          operator: operador,
          description: descripcion,
        },
      };

      await updateFailureReport(MutationPart);
      console.log('Failure report updated successfully');
      handleButton1();
    } catch (error) {
      console.error('Error in handleButtonClick:', error);
      let errorMessage = 'Revisa tu conexión y vuelve a intentarlo.';
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      alert(`Error procesando la solicitud: ${errorMessage}`);
    }
  }

  function validateFields() {
    return (
      localizacion.trim().length > 0 &&
      operador.trim().length > 0 &&
      descripcion.trim().length > 0
    );
  }

  return (
    <>
      <Head>
        <title>Reporte de Falla</title>
        <meta name="description" content="Camher" />
      </Head>
      <div className="mt-20 flex flex-col items-center justify-center gap-1">
        <h1 className="mb-5 self-center text-5xl">Reporte de Falla</h1>
        <h2 className="text-2xl self-center">
          Reporta la falla de la unidad <br /> 
          para después pedir piezas a proveedor. <br /> 
        </h2>

        {!partID && (
          <UnitQueryDropdown
            options={allUnits}
            setOption={setUnidad}
            placeholder="Unidad"
          />
        )}

        <TextInput
          intent="long"
          placeholder="Localiza el problema"
          value={localizacion}
          onChange={(e) => setLocalizacion(e.target.value)}
        />

        <TextInput
          intent="regular"
          placeholder="Operador"
          value={operador}
          onChange={(e) => setOperador(e.target.value)}
        />

        <TextInput
          intent="long"
          placeholder="Describe la falla principal"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        
        <Button intent="green" onClick={handleButtonClick}>
          {'  '}REGISTRAR FALLA{'  '}
        </Button>
      </div>
    </>
  );
}