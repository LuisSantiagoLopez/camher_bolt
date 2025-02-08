import React, { Fragment, useEffect, useState } from 'react';
import { useSelectedToolContext } from '@/context/SelectedToolContext';
import ActionScreen from '../reusable/actionScreen';
import StatusScreen from '../reusable/statusScreen';
import { useFlowContext } from '@/context/FlowContext';
import AuthScreen from '@/static/authScreen';

const flow = {
  ActionScreen: {
    description: 'Estás en el flujo de trabajo para el administrador. \n En este proceso puedes aprobar refacciones y pagos de contado.',
    button1Text: 'Aprobar refacciones',
    button2Text: 'Aprobar pagos de contado',
    button3Text: 'Registrarse como administrador',
  },
};

export default function AdminFlow() {
  const [unitOpen, setUnitOpen] = useState(false);
  const [providerOpen, setProviderOpen] = useState(false);
  const [type, setType] = useState('');
  const { name } = useFlowContext();
  const { selectedTool, setSelectedTool, pastTools, setPastTools } =
    useSelectedToolContext();

  const updateTools = (tool: string) => {
    setPastTools([selectedTool, ...pastTools]);
    setSelectedTool(tool);
  };

  function renderTool() {
    switch (selectedTool) {
      case 'action':
        return (
          <>
            <div className="flex flex-col items-center space-y-8">
              <ActionScreen
                user={name}
                description={flow.ActionScreen.description}
                button1Text={flow.ActionScreen.button1Text}
                button2Text={flow.ActionScreen.button2Text}
                button3Text={flow.ActionScreen.button3Text}
                handleButton1={() => {
                  updateTools('statusrefacciones');
                }}
                handleButton2={() => {
                  updateTools('statuscontados');
                }}
                handleButton3={() => {
                  updateTools('auth');
                }}
              />
            </div>
          </>
        );
      case 'statusrefacciones':
        return (
          <StatusScreen status={7} minRange={8} range={8} tipo="admincard" />
        );

      case 'statuscontados':
        return (
          <StatusScreen status={6} minRange={8} range={8} tipo="admincard" />
        );
        
      case 'auth':
        return (
          <AuthScreen updatePrevTools={updateTools} />
        );
    }
  }

  return (
    <div className="font-poppins bg-no-repeat">
      <div id="tools">{renderTool()}</div>
    </div>
  );
}