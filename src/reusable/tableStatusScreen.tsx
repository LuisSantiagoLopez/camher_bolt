import Navigation from '#/InnerNavBar';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { TableT as APITableT } from '@/graphql/APITypes';
import LoadingAnim from '@/components/ui/animations/loadingAnim';

// Import types
import { useSelectedToolContext } from '@/context/SelectedToolContext';
import React from 'react';
import {
  queryHistoricTables,
  queryPastTables,
  queryTablesByRange,
} from '@/helpers/helperFunTable';
import CardTable from '@/components/ui/CardTable';
import CollapsedTableCard from '@/components/ui/CollapsedTableCard';
import { useFlowContext } from '@/context/FlowContext';

// Prop
type Props = {
  type: 'contadortabla' | 'contaduria';
};

function TableStatusScreen({ type }: Props): JSX.Element {
  const { selectedTool, setSelectedTool, pastTools, setPastTools } = useSelectedToolContext();
  const [tables, setTables] = useState<APITableT[]>([]);
  const [inApprovalTables, setInApprovalTables] = useState<APITableT[]>([]);
  const [readyTables, setReadyTables] = useState<APITableT[]>([]);
  const [pastTables, setPastTables] = useState<APITableT[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chosenTable, setChosenTable] = useState<APITableT | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  // Get type of user from flow context
  const { flow } = useFlowContext();

  async function getTables() {
    setLoading(true);
    try {
      const inApprovalTablesRes = await queryTablesByRange(1, 1); // Tables in status 1 are yet to be approved by contador Sr.
      const readyTablesRes = await queryTablesByRange(2, 2); // Tables in status 2 are yet to be approved by contador Jr.
      const pastTablesRes = await queryPastTables(); // Tables in status 3 are already approved by both contadores

      if (
        !inApprovalTablesRes ||
        !readyTablesRes ||
        !pastTablesRes
      ) {
        setInApprovalTables([]);
        setReadyTables([]);
        setPastTables([]);
        setTables([]);
      } else {
        setInApprovalTables(inApprovalTablesRes);
        setReadyTables(readyTablesRes);
        setPastTables(pastTablesRes);
        setTables(inApprovalTablesRes);
      }
    } catch (error) {
      console.error('Error fetching tables', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTables();
  }, []);

  useEffect(() => {
    const storedTab = sessionStorage.getItem('currentTab');

    if (storedTab === 'Left') {
      setTables(inApprovalTables);
    } else if (storedTab === 'Middle') {
      setTables(readyTables);
    } else if (storedTab === 'Right') {
      setTables(pastTables);
    }
  }, [inApprovalTables, readyTables, pastTables]);

  const updateTabState = (tabName: string) => {
    sessionStorage.setItem('currentTab', tabName);
  };

  const handleClick = (t: APITableT) => {
    setIsExpanded(!isExpanded);
    setChosenTable(t);
  };
  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center">
          <LoadingAnim />
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          <Navigation
            setIsExpanded={setIsExpanded}
            approveButton={() => {
              setTables(inApprovalTables);
              updateTabState('Left');
            }}
            cancelButton={() => {
              setTables(pastTables);
              updateTabState('Right');
            }}
            currentButton={() => {
              setTables(readyTables);
              updateTabState('Middle');
            }}
            leftButton="En Aprobación"
            middleButton="Listas"
            rightButton="Pasadas"
          />
          {isExpanded && chosenTable ? (
            <CardTable
              handleBack={handleClick}
              table={chosenTable}
              type={type}
              status={chosenTable.status || 0}
              flow={flow}
            />
          ) : (
            <div className="flex w-full flex-row flex-wrap">
              {tables.length > 0 ? (
                tables.map((t, index) => (
                  <CollapsedTableCard
                    handleClick={handleClick}
                    table={t}
                    key={t?.id ?? index.toString()}
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
      )}
    </>
  );
}

export default TableStatusScreen;
