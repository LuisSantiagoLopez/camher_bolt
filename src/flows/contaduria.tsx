import { useSelectedToolContext } from '@/context/SelectedToolContext';
import { useEffect } from 'react';

// Flow Imports
import ActionScreen from '../reusable/actionScreen';
import StatusScreen from '../reusable/statusScreen';
import { useFlowContext } from '@/context/FlowContext';
import TableStatusScreen from '@/reusable/tableStatusScreen';

const flow = {
  ActionScreen: {
    description: 'Estás en el flujo de trabajo para la contaduría. \n En este proceso puedes emitir contrarecibos y administrar tablas semanales.',
    button1Text: 'Emitir contrarecibos',
    button2Text: 'Administrar tablas semanales',
  },
};
export default function Contaduria() {
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
          <ActionScreen
            user={name}
            description={flow.ActionScreen.description}
            button1Text={flow.ActionScreen.button1Text}
            button2Text={flow.ActionScreen.button2Text}
            handleButton1={() => {
              updateTools('counterReceipt');
            }}
            handleButton2={() => {
              updateTools('tables');
            }}
          />
        );
      case 'counterReceipt':
        return (
          <StatusScreen status={11} minRange={12} range={13} tipo="receipt" />
        );
      case 'tables':
        return <TableStatusScreen type="contaduria" />;
      default:
        return (
          <ActionScreen
            user={name}
            description={flow.ActionScreen.description}
            button1Text={flow.ActionScreen.button1Text}
            button2Text={flow.ActionScreen.button2Text}
            handleButton1={() => {
              updateTools('counterReceipt');
            }}
            handleButton2={() => {
              updateTools('tables');
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
