import Navigation from '#/InnerNavBar';
import CollapsedCard from '#/CollapsedCard';
import Head from 'next/head';
import React from 'react';
import Card from '@/components/ui/Card';
import { useEffect } from 'react';
import { queryPartsByRange, queryPartsByStatus } from '@/helpers/helperFunPart';
import { PartT as Part } from '@/graphql';
import { updateStatus } from '@/helpers/helperFunPart';
import { useRouter } from 'next/router';
import LoadingAnim from '@/components/ui/animations/loadingAnim';

interface StatusPropsTaller {
  status: number;
  range?: number;
  minRange?: number;
  tipo: 'unit' | 'counter' | 'failure';
  setPartID: React.Dispatch<React.SetStateAction<string>>;
  updatePrevTools: (tool: string) => void;
}

function StatusScreenTaller({
  status,
  minRange,
  range,
  tipo,
  setPartID,
  updatePrevTools,
}: StatusPropsTaller) {
  const toolsArr = [
    'failurereport',
    'mechanicreview',
    'workorder',
    'partrequest',
    'damagevalidation',
    'partauthorization',
    '',
    '',
    'checkstatus',
    '',
    'facturas',
  ];
  const router = useRouter();
  const [parts, setParts] = React.useState<Part[]>([]);

  const [currentParts, setCurrentParts] = React.useState<Part[]>([]);
  const [cancelledParts, setCancelledParts] = React.useState<Part[]>([]);
  const [aprovedParts, setAprovedParts] = React.useState<Part[]>([]);

  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    getParts();
  }, []);

  useEffect(() => {
    const storedTab = sessionStorage.getItem('currentTab');

    if (storedTab === 'Left') {
      setParts(aprovedParts);
    } else if (storedTab === 'Middle') {
      setParts(currentParts);
    } else if (storedTab === 'Right') {
      setParts(cancelledParts);
    } else {
      sessionStorage.setItem('currentTab', 'Left');
      setParts(currentParts);
    }
  }, [currentParts, aprovedParts, cancelledParts]);

  async function getParts() {
    setLoading(true);
    try {
      const aprPart = await queryPartsByRange(
        minRange ? minRange : status,
        range ? range : 10,
      );
      const canPart = await queryPartsByStatus(-1);
      if (aprPart == null || canPart == null) return;
      const aprParts = aprPart.filter(
        (part) => part && part.status != 1 && part.status != 9,
      );
      const curPart = aprPart.filter((part) => part && part.status == 1);
      setCurrentParts(curPart);
      setAprovedParts(aprParts);
      setCancelledParts(canPart);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching parts', error);
    }
  }

  const updateTools = (tool: string, unitID: string) => {
    updatePrevTools(tool);
    setPartID(unitID);
  };

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [chosenPart, setChosenPart] = React.useState<Part>(parts[0]);

  const handleClick = (unit: Part) => {
    setIsExpanded(!isExpanded);
    setChosenPart(unit);
  };

  const updateTabState = (tabName: string) => {
    sessionStorage.setItem('currentTab', tabName);
  };

  const hanldeCardClick = async (unit: Part, status: number) => {
    if (!unit) return;
    if (status > 0) {
      updateTools(toolsArr[status], unit.id);
    } else {
      try {
        await updateStatus(status, unit.id);
        router.reload();
      } catch (error) {
        console.error('Error updating status', error);
      }
    }
  };
  return (
    <>
      <Head>
        <title>Estatus</title>
        <meta name="description" content="Camher" />
      </Head>
      {loading ? (
        <LoadingAnim />
      ) : (
        <div className="flex flex-col justify-center">
          {isExpanded ? (
            <>
              <Navigation
                approveButton={() => {
                  updateTabState('Left');
                  setParts(aprovedParts);
                }}
                cancelButton={() => {
                  updateTabState('Right');
                  setParts(cancelledParts);
                }}
                currentButton={() => {
                  updateTabState('Middle');
                  setParts(currentParts);
                }}
                setIsExpanded={setIsExpanded}
                leftButton="En proceso"
                middleButton="Reportes de falla"
              />
              <Card
                handleClick={hanldeCardClick}
                handleBack={handleClick}
                data={chosenPart}
                key={chosenPart && chosenPart.id}
                type={tipo}
                isAction={chosenPart && chosenPart.status != -1}
              />
            </>
          ) : (
            <>
              <Navigation
                approveButton={() => {
                  updateTabState('Left');
                  setParts(aprovedParts);
                }}
                cancelButton={() => {
                  updateTabState('Right');
                  setParts(cancelledParts);
                }}
                currentButton={() => {
                  updateTabState('Middle');
                  setParts(currentParts);
                }}
                setIsExpanded={setIsExpanded}
                leftButton="Continuar procesos"
                middleButton="Procesos nuevos"
              />
              <div className="flex w-full flex-row flex-wrap justify-evenly">
                {parts.length > 0 ? (
                  parts.map((part, index) => (
                    <CollapsedCard
                      handleClick={handleClick}
                      part={part}
                      key={part?.id ?? index.toString()}
                    />
                  ))
                ) : (
                  <div className="flex h-64 w-full items-center justify-center">
                    <p className="text-3xl font-thin text-neutral-500">
                      No se encontraron procesos...
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default StatusScreenTaller;
