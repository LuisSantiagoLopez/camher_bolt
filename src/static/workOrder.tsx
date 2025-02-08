import { useState, useEffect } from 'react';
import TextInput from '#/TextInput';
import Dropdown from '#/Dropdown';
import Button from '#/Button';
import Head from 'next/head';
import { buttonAndPartProps } from '@/types/partTypes';
import { updateWorkOrder, queryPart } from '@/helpers/helperFunPart';

export default function WorkOrder({
  handleButton1,
  partID,
}: buttonAndPartProps) {
  const [trabajos, setTrabajos] = useState('');
  const [asignado, setAsignado] = useState('');
  const [refaccion, setRefaccion] = useState('');
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    const loadExistingWorkOrder = async () => {
      if (partID) {
        const part = await queryPart(partID);
        if (part && part.workOrder) {
          setTrabajos(part.workOrder.jobToBeDone || '');
          setAsignado(part.workOrder.personInCharge || '');
          setRefaccion(part.workOrder.sparePart || '');
          setObservaciones(part.workOrder.observation || '');
        }
      }
    };

    loadExistingWorkOrder();
  }, [partID]);

  const handleClick = async () => {
    if (!validateFields()) {
      alert('Llena todos los campos para continuar');
      return;
    }

    handleButton1();

    const WorkOrderPart = {
      id: partID,
      status: 3,
      workOrder: {
        jobToBeDone: trabajos,
        personInCharge: asignado,
        sparePart: refaccion,
        observation: observaciones,
      },
    };

    try {
      await updateWorkOrder(WorkOrderPart);
    } catch (error) {
      console.error('Error updating part', error);
    }
  };

  function validateFields() {
    return (
      trabajos.trim() !== '' &&
      asignado.trim() !== ' ' &&
      refaccion.trim() !== '' &&
      observaciones.trim() !== ''
    );
  }

  return (
    <>
      <Head>
        <title>Orden de Trabajo</title>
        <meta name="description" content="Camher" />
      </Head>
      <div className="mt-20 flex flex-col items-center justify-center gap-1">
        <h1 className="mb-5 self-center text-5xl">Orden de Trabajo</h1>
        <TextInput
          intent={'long'}
          placeholder="Trabajos a efectuar"
          value={trabajos}
          onChange={(e) => setTrabajos(e.target.value)}
        />
        <TextInput
          intent={'regular'}
          placeholder="Mecánico asignado"
          value={asignado}
          onChange={(e) => setAsignado(e.target.value)}
        />
        <Dropdown
          value={refaccion}
          onChange={(e) => setRefaccion(e.target.value)}
        >
          <option value=" ">Tipo de reparación...</option>
          <option value="Llantas">Llantas</option>
          <option value="Motor tren motriz">Motor tren motriz</option>
          <option value="Aceite motor">Aceite motor</option>
          <option value="Suspensión y acomplamiento">
            Suspensión y acomplamiento
          </option>
          <option value="Eléctrico">Eléctrico</option>
          <option value="Frenos">Frenos</option>
          <option value="Hojalateria y Pintura">Hojalateria y Pintura</option>
          <option value="Medidoras y Bombas">Medidoras y Bombas</option>
          <option value="Reparación de Pipas">Reparación de Pipas</option>
          <option value="Accesorios para descargas">
            Accesorios para descargas
          </option>
        </Dropdown>
        <TextInput
          intent={'long'}
          placeholder="Observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
        <Button intent={'green'} className="mt-5" onClick={handleClick}>
          {'  '}IR{'  '}
        </Button>
      </div>
    </>
  );
}