import React, { useEffect, useState, createContext } from 'react';
import CheckScreen from '../static/checkScreen';
import ActionScreen from '../reusable/actionScreen';
import StatusScreenTaller from '../reusable/statusScreenTaller';
import YesNo from '../reusable/yesNo';
import AutorizacionPartes from '../static/partApproval';
import Facturas from '../static/facturas';
import FailureReport from '../static/failureReport';
import NewRefaction from '../static/newRefaction';
import PartRequest from '../static/partRequest';  // Changed from named to default import
import WorkOrder from '../static/workOrder';
import EndScreen from '../reusable/endScreen';
import UnitCreation from '@/static/newUnit';
import { queryPart } from '@/helpers/helperFunPart';
import DownloadTables from '@/static/downloadTables';
import { useSelectedToolContext } from '@/context/SelectedToolContext';
import { useFlowContext } from '@/context/FlowContext';

const flow = {
  ActionScreen: {
    description: 'Estás en el flujo de trabajo para el taller. \n En este proceso puedes solicitar refacciones, \n revisar el estatus de las refacciones, \n registrar una unidad (camión) \n y descargar datos de refacciones que ya pediste.',
    button1Text: 'Solicitar nueva refacción',
    button2Text: 'Revisar estatus de refacciones',
    button3Text: 'Registrar una unidad (camión)',
    button4Text: 'Descargar datos de refacciones',
  },
  mechanicReview: {
    title: '¿El mecánico revisó la unidad?',
    description: '¿Se requiere comprar la pieza?',
    inputText: true,
  },
  damageValidation: {
    title: 'Validación de daños',
    description: '¿Revisaste el diagnostico del mecánico?',
    inputText: false,
  },
  paymenttype: {
    title: 'Tipo de pago',
    description: '¿El pago sera de contado?',
    inputText: false,
  },
  confirmpurchase: {
    title: 'Contacto de proveedor',
    description: '¿Confirmaste la compra con el proveedor?',
    inputText: false,
  },
  maxprice: {
    title: 'Tipo de page',
    description: '¿El pago sera mayor a 800 MXN?',
    inputText: false,
  },
};

export const TallerContext = createContext({
  partID: '',
  setPartID: (partID: string) => {},
  updateTools: (tool: string) => {},
});

export default function TallerFlow() {
  const { name } = useFlowContext();
  const [partID, setPartID] = useState<string>('');
  const { selectedTool, setSelectedTool, pastTools, setPastTools } = useSelectedToolContext();

  const updateTools = (tool: string) => {
    setPastTools([selectedTool, ...pastTools]);
    setSelectedTool(tool);
  };

  useEffect(() => {
    // Check if we're editing an existing part
    const editingPart = sessionStorage.getItem('editingPart');
    if (editingPart && selectedTool === 'newrefaction') {
      const part = JSON.parse(editingPart);
      setPartID(part.id);
      // Clear the editing data after retrieving it
      sessionStorage.removeItem('editingPart');
      // Skip directly to failure report
      updateTools('failurereport');
    }
  }, [selectedTool]);

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
              updateTools('newrefaction');
            }}
            handleButton2={() => {
              updateTools('status');
            }}
            handleButton3={() => {
              updateTools('createunit');
            }}
            handleButton4={() => {
              updateTools('downloadTables');
            }}
          />
        );
      case 'newrefaction':
        return (
          <NewRefaction
            handleButton1={() => {
              updateTools('failurereport');
            }}
            handleButton2={() => {
              updateTools('partrequestDirect');
            }}
          />
        );
      case 'status':
        return (
          <StatusScreenTaller
            setPartID={setPartID}
            updatePrevTools={updateTools}
            status={1}
            tipo="failure"
          />
        );
      case 'createunit':
        return (
          <UnitCreation
            handleButton1={() => {
              updateTools('end');
            }}
          />
        );
      case 'failurereport':
        return (
          <FailureReport
            handleButton1={() => {
              updateTools('mechanicreview');
            }}
            setPartID={setPartID}
            partID={partID}
          />
        );
      case 'mechanicreview':
        return (
          <YesNo
            title={flow.mechanicReview.title}
            inputText={flow.mechanicReview.inputText}
            description={flow.mechanicReview.description}
            partID={partID || undefined}
            mechanicOn={true}
            newStatusNo={-1}
            handleYes={() => {
              updateTools('workorder');
            }}
            handleNo={() => {
              updateTools('end');
            }}
          />
        );
      case 'workorder':
        return (
          <WorkOrder
            handleButton1={() => {
              updateTools('partrequest');
            }}
            partID={partID}
          />
        );
      case 'partrequestDirect':
        return (
          <PartRequest
            handleButton1={() => {
              updateTools('damagevalidation');
            }}
            partID={partID}
            setPartID={setPartID}
          />
        );
      case 'partrequest':
        return (
          <PartRequest
            handleButton1={() => {
              updateTools('damagevalidation');
            }}
            partID={partID}
            setPartID={setPartID}
          />
        );
      case 'damagevalidation':
        return (
          <YesNo
            title={flow.damageValidation.title}
            inputText={flow.damageValidation.inputText}
            description={flow.damageValidation.description}
            partID={partID || undefined}
            newStatusYes={5}
            handleYes={() => {
              updateTools('partauthorization');
            }}
            handleNo={() => {
              updateTools('waitForValidation');
            }}
          />
        );
      case 'downloadTables':
        return <DownloadTables />;
      case 'partauthorization':
        return (
          <AutorizacionPartes
            handleButton1={async () => {
              const part = await queryPart(partID);
              if (part == null) return;
              if (part.status == 8) {
                updateTools('checkstatus');
              } else {
                updateTools('waitForAdmin');
              }
            }}
            partID={partID}
          />
        );
      case 'checkstatus':
        return (
          <CheckScreen
            handleButton1={() => {
              updateTools('end');
            }}
            partID={partID}
          />
        );
      case 'facturas':
        return (
          <Facturas
            handleButton1={() => {
              updateTools('end');
            }}
            partID={partID}
          />
        );
      case 'waitForValidation':
        return (
          <EndScreen
            title="Espera que el mecánico valide la refacción"
            subtitle="Despues podras continuar"
            handleButton1={() => {
              updateTools('action');
            }}
          />
        );
      case 'waitForAdmin':
        return (
          <EndScreen
            title="Espera que el administrador apruebe el proceso"
            subtitle="Despues podras continuar desde el menú"
            handleButton1={() => {
              updateTools('action');
            }}
          />
        );
      case 'end':
        return (
          <EndScreen
            title="Terminaste con Éxito"
            subtitle="Vuelve al menú para hacer otra operación"
            handleButton1={() => {
              updateTools('action');
            }}
          />
        );
      default:
        return (
          <ActionScreen
            user={name}
            description={flow.ActionScreen.description}
            button1Text={flow.ActionScreen.button1Text}
            button2Text={flow.ActionScreen.button2Text}
            handleButton1={() => {
              updateTools('newrefaction');
            }}
            handleButton2={() => {
              updateTools('status');
            }}
          />
        );
    }
  }

  return (
    <div className="font-poppins h-screen">
      <div id="tools">{renderTool()}</div>
    </div>
  );
}