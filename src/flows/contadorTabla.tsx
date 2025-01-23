import { useSelectedToolContext } from '@/context/SelectedToolContext';
import ActionScreen from '../reusable/actionScreen';
import { useFlowContext } from '@/context/FlowContext';
import DownloadTables from '@/static/downloadTables';
import TableStatusScreen from '@/reusable/tableStatusScreen';
import AuthScreen from '@/static/authScreen';

const flow = {
  ActionScreen: {
    description: 'Estás en el flujo de trabajo para la contaduría. \n En este proceso puedes aprobar tablas semanales y descargarlas.',
    button1Text: 'Aprobar Tablas',
    button2Text: 'Descargar Tablas',
    button3Text: 'Registrarse como contador',
  },
};

export default function Tabla() {
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
            button2Text={flow.ActionScreen.button2Text}
            button3Text={flow.ActionScreen.button3Text}
            handleButton1={() => {
              updateTools('tables');
            }}
            handleButton2={() => {
              updateTools('downloadTables');
            }}
            handleButton3={() => {
              updateTools('auth');
            }}
          />
        );
      case 'downloadTables':
        return <DownloadTables isTable />;

      case 'tables':
        return <TableStatusScreen type="contadortabla" />;
        
      case 'auth':
        return <AuthScreen updatePrevTools={updateTools} />;
        
      default:
        return (
          <ActionScreen
            user={name}
            description={flow.ActionScreen.description}
            button1Text={flow.ActionScreen.button1Text}
            button2Text={flow.ActionScreen.button2Text}
            button3Text={flow.ActionScreen.button3Text}
            handleButton1={() => {
              updateTools('tables');
            }}
            handleButton2={() => {
              updateTools('downloadTables');
            }}
            handleButton3={() => {
              updateTools('auth');
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