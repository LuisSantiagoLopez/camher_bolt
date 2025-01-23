import React, { useState } from 'react';
import SubmitButton from '#/Button';
import { buttonAndPartProps } from '@/types/partTypes';
import ToggleButton from '@/components/ui/ToggleButton';
import TextInput from '@/components/ui/TextInput';
import { updateValidationChecks } from '@/helpers/helperFunPart';

const CheckScreen = ({ handleButton1, partID }: buttonAndPartProps) => {
  const [validationState, setValidationState] = useState({
    contactProvider: false,
    correctPart: false,
    partDelivered: false,
    partInstalled: false,
  });
  const [partStatus, setPartStatus] = useState('');

  const handleSubmit = async () => {
    if (!partStatus.trim()) {
      alert('Por favor describe qué pasó con la parte dañada');
      return;
    }

    try {
      await updateValidationChecks(partID, {
        ...validationState,
        partStatus,
        validatedAt: new Date().toISOString(),
        validatedBy: 'current-user',
      });

      if (Object.values(validationState).every(Boolean)) {
        handleButton1();
      } else {
        alert('Por favor complete todas las validaciones para continuar');
      }
    } catch (error) {
      console.error('Error updating validation checks:', error);
      alert('Error al guardar las validaciones. Por favor intente de nuevo.');
    }
  };

  return (
    <div className="mx-auto flex flex-col items-center justify-center">
      <div className="bg-white p-8 shadow-md md:mt-10 md:w-[50%] md:rounded-md">
        <h1 className="pb-7 text-4xl">Validaciones</h1>

        <ToggleButton
          title="¿Ya contactaste al proveedor para confirmar la compra?"
          toggle={validationState.contactProvider}
          onChange={(value) => setValidationState(prev => ({...prev, contactProvider: value}))}
          className="py-5"
        />

        {validationState.contactProvider && (
          <ToggleButton
            title="¿La parte que llegó al patio es la que se necesita?"
            toggle={validationState.correctPart}
            onChange={(value) => setValidationState(prev => ({...prev, correctPart: value}))}
            className="py-5"
          />
        )}

        {validationState.correctPart && (
          <ToggleButton
            title="¿Se entregó la parte al mecánico para la instalación?"
            toggle={validationState.partDelivered}
            onChange={(value) => setValidationState(prev => ({...prev, partDelivered: value}))}
            className="py-5"
          />
        )}

        {validationState.partDelivered && (
          <>
            <TextInput
              intent="long"
              name="Estado de la parte dañada"
              placeholder="Describe qué pasó con la parte dañada (destruida, reciclada, devuelta, etc)..."
              value={partStatus}
              onChange={(e) => setPartStatus(e.target.value)}
            />
            <ToggleButton
              title="¿Ya se instaló la parte nueva?"
              toggle={validationState.partInstalled}
              onChange={(value) => setValidationState(prev => ({...prev, partInstalled: value}))}
              className="py-5"
            />
          </>
        )}

        <SubmitButton
          onClick={handleSubmit}
          className="my-4 self-center"
          intent="regular"
        >
          Enviar
        </SubmitButton>
      </div>
    </div>
  );
};

export default CheckScreen;