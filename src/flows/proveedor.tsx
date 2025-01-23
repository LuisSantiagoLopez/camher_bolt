import React, { useState } from 'react';
import { useSelectedToolContext } from '@/context/SelectedToolContext';
import ActionScreen from '../reusable/actionScreen';
import ChangeEmailPage from '../static/changeMail';
import { useFlowContext } from '@/context/FlowContext';
import StatusScreenProvider from '@/reusable/statusScreenProvider';
import AuthScreen from '../static/authScreen';
import ProviderDocs from '@/static/providerDocs';

const flow = {
  ActionScreen: {
    description: 'Estás en el flujo de trabajo para el proveedor. \n En este proceso puedes agregar una nueva factura, cambiar tu correo o ver tus documentos.',
    button1Text: 'Agrega factura para los pedidos de refacciones',
    button2Text: 'Agrega un correo electrónico para mandar facturas e información',
    button3Text: 'Autentícate como proveedor para poder recibir pedidos',
    button4Text: 'Ver contrarecibos y facturas'
  },
};

export default function ProveedorFlow() {
  const [partID, setPartID] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { name, email } = useFlowContext();
  const { selectedTool, setSelectedTool, pastTools, setPastTools } = useSelectedToolContext();

  if (error) {
    return <div>Error loading provider flow: {error.message}</div>;
  }

  const updateTools = (tool: string) => {
    setPastTools([selectedTool, ...pastTools]);
    setSelectedTool(tool);
  };

  function renderTool() {
    switch (selectedTool) {
      case 'action':
        return (
          <ActionScreen
            user={name}
            description={flow.ActionScreen.description}
            button1Text={flow.ActionScreen.button1Text}
            button2Text={flow.ActionScreen.button2Text}
            button3Text={flow.ActionScreen.button3Text}
            button4Text={flow.ActionScreen.button4Text}
            handleButton1={() => {
              updateTools('invoice');
            }}
            handleButton2={() => {
              updateTools('changeemail');
            }}
            handleButton3={() => {
              updateTools('auth');
            }}
            handleButton4={() => {
              updateTools('documents');
            }}
          />
        );
      case 'changeemail':
        return <ChangeEmailPage email={email} />;

      case 'invoice':
        return (
          <StatusScreenProvider
            setPartID={setPartID}
            updatePrevTools={updateTools}
            email={email}
          />
        );
      
      case 'auth': 
        return (
          <AuthScreen updatePrevTools={updateTools} />
        );

      case 'documents':
        return (
          <ProviderDocs email={email} updatePrevTools={updateTools} />
        );
    }
  }

  return (
    <div className="font-poppins h-screen">
      <div id="tools">{renderTool()}</div>
    </div>
  );
}