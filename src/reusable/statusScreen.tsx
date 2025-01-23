import Navigation from '#/InnerNavBar';
import CollapsedCard from '#/CollapsedCard';
import Head from 'next/head';
import React from 'react';
import Card from '@/components/ui/Card';
import { useEffect } from 'react';
import { queryPartsByRange, queryPartsByStatus } from '@/helpers/helperFunPart';
import { PartT as Part } from '@/graphql';
import LoadingAnim from '@/components/ui/animations/loadingAnim';

interface StatusProps {
  status: number;
  range?: number;
  minRange?: number;
  tipo: 'counter' | 'failure' | 'admincard' | 'receipt';
}

function StatusScreen({ status, range, tipo, minRange }: StatusProps) {
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
      sessionStorage.setItem('currentTab', 'Middle');
    }
  }, [currentParts, aprovedParts, cancelledParts]);

  async function getParts() {
    setLoading(true);
    try {
      const aprPart = await queryPartsByRange(
        minRange ? minRange : status,
        range ? range : 14,
      );
      const curPart = await queryPartsByStatus(status);
      const canPart = await queryPartsByStatus(-1);
      if (aprPart == null || curPart == null || canPart == null) return;
      setCurrentParts(curPart);
      setAprovedParts(aprPart);
      setCancelledParts(canPart);

      setParts(curPart);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching parts', error);
    }
  }

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [chosenPart, setChosenPart] = React.useState<Part>(parts[0]);

  const handleClick = (unit: Part) => {
    setIsExpanded(!isExpanded);
    setChosenPart(unit);
  };
  return (
    <>
      <Head>
        <title>Estatus</title>
        <meta name="description" content="Camher" />
      </Head>
      {loading ? (
        <div className="flex flex-col justify-center ">
          <LoadingAnim />
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          {isExpanded ? (
            <>
              <Navigation
                approveButton={() => setParts(aprovedParts)}
                cancelButton={() => setParts(cancelledParts)}
                currentButton={() => setParts(currentParts)}
                setIsExpanded={setIsExpanded}
              />
              <Card
                handleClick={handleClick}
                handleBack={handleClick}
                data={chosenPart}
                key={chosenPart && chosenPart.id}
                type={tipo ?? 'admincard'}
                isAction={chosenPart && chosenPart.status === status}
              />
            </>
          ) : (
            <>
              <Navigation
                approveButton={() => setParts(aprovedParts)}
                cancelButton={() => setParts(cancelledParts)}
                currentButton={() => setParts(currentParts)}
                setIsExpanded={setIsExpanded}
              />
              <div className="flex w-full flex-row flex-wrap">
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

export default StatusScreen;
