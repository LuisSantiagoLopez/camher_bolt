import CollapsedCard from '#/CollapsedCard';
import Head from 'next/head';
import React, { useCallback } from 'react';
import Card from '@/components/ui/Card';
import { useEffect, useState } from 'react';
import { queryPartsForProvider } from '@/helpers/helperFunPart';
import { Part, Provider } from '@/types/database';
import { queryProviderByEmail } from '@/helpers/helperFunProvider';
import LoadingAnim from '@/components/ui/animations/loadingAnim';

interface StatusPropsProvider {
  setPartID: React.Dispatch<React.SetStateAction<string | null>>;
  updatePrevTools: (tool: string) => void;
  email: string;
}

function StatusScreenProvider({
  setPartID,
  updatePrevTools,
  email,
}: StatusPropsProvider) {
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chosenPart, setChosenPart] = useState<Part | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const provider = await queryProviderByEmail(email);
      if (!provider) {
        throw new Error('Provider not found');
      }
      const parts = await queryPartsForProvider(provider.id);
      setParts(parts);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleClick = (unit: Part) => {
    setIsExpanded(!isExpanded);
    setChosenPart(unit);
  };

  if (isLoading) return <LoadingAnim />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Head>
        <title>Estatus</title>
        <meta name="description" content="Camher" />
      </Head>
      <div className="flex flex-col justify-center">
        <nav className="flex h-14 w-full justify-evenly">
          <button className="nvrButton hover:bg-blue-100 focus:bg-blue-200">
            Partes pendientes de facturar
          </button>
        </nav>
        {isExpanded && chosenPart ? (
          <Card
            handleClick={() => {}}
            handleBack={handleClick}
            data={chosenPart}
            type={'provider'}
            isAction={chosenPart.status !== -1}
          />
        ) : (
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
        )}
      </div>
    </>
  );
}

export default StatusScreenProvider;