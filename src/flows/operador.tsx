import FailureReport from '../static/failureReport';
import { useSelectedToolContext } from '@/context/SelectedToolContext';
import { useState } from 'react';

// Flow Imports
import ActionScreen from '../reusable/actionScreen';
import { useFlowContext } from '@/context/FlowContext';
import { describe } from 'node:test';

const flow = {
  ActionScreen: {
    description: 'Estás en el flujo de trabajo para el operador. \n En este proceso puedes generar reportes de falla.',
    button1Text: 'Generar reporte de falla',
  },
};

export default function OperadorFlow() {
  const [partID, setPartID] = useState<string>('');

  const { name } = useFlowContext();
  const updateTools = (tool: string) => {
    setPastTools([selectedTool, ...pastTools]);
    setSelectedTool(tool);
  };
  const { selectedTool, setSelectedTool, pastTools, setPastTools } =
    useSelectedToolContext();
  function renderTool() {
    switch (selectedTool) {
      case 'action':
        return (
          <ActionScreen
            user={name}
            description={flow.ActionScreen.description}
            button1Text={flow.ActionScreen.button1Text}
            handleButton1={() => {
              updateTools('reporte');
            }}
          />
        );
      case 'reporte':
        return (
          <FailureReport
            handleButton1={() => {
              updateTools('mechanicreview');
            }}
            setPartID={setPartID}
            partID={partID}
          />
        );
      default:
        return (
          <ActionScreen
            user={name}
            description={flow.ActionScreen.description}
            button1Text={flow.ActionScreen.button1Text}
            handleButton1={() => {
              updateTools('reporte');
            }}
          />
        );
    }
  }
  return (
    <>
      <div>{renderTool()}</div>
    </>
  );
}
