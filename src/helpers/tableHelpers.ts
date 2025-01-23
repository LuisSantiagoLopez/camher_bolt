import {
  ListTablesQuery,
  TableT,
  TablesByTypeQuery,
  UpdateTableMutation,
  listTables,
  tablesByType,
  updateTable,
} from '@/graphql';
import { API } from 'aws-amplify';

export async function updateTableStatus(status: number, tableID: string) {
  try {
    const updatedTable = (await API.graphql({
      query: updateTable,
      variables: {
        input: {
          id: tableID,
          status: status,
        },
      },
    })) as { data: UpdateTableMutation };

    return updatedTable.data.updateTable as TableT;
  } catch (error) {
    console.error('Error updating table', error);
    throw error;
  }
}

export async function queryTablesByTime(initialTime: any, finalTime: any) {
  try {
    const res = (await API.graphql({
      query: listTables,
      variables: {
        filter: {
          createdAt: {
            between: [initialTime, finalTime],
          },
        },
      },
    })) as { data: ListTablesQuery };

    if (!res.data.listTables?.items) return [];
    const tables = res.data.listTables.items as TableT[];

    return tables.map((table) => table?.id || '').filter(Boolean);
  } catch (error) {
    console.error('Error querying all tables:', error);
    throw error;
  }
}

export async function queryTablesByRange(minStatus: number, maxStatus: number) {
  try {
    const res = (await API.graphql({
      query: listTables,
      variables: {
        filter: {
          status: {
            between: [minStatus, maxStatus],
          },
        },
      },
    })) as { data: ListTablesQuery };

    if (!res.data.listTables?.items) return [];
    return res.data.listTables?.items as TableT[];
  } catch (error) {
    console.error('Error querying all tables:', error);
    throw error;
  }
}

export async function queryHistoricTables() {
  try {
    const res = (await API.graphql({
      query: tablesByType,
      variables: {
        type: 'HISTORY',
      },
    })) as { data: TablesByTypeQuery };
    
    if (!res.data.tablesByType?.items) return [];
    return res.data.tablesByType.items as TableT[];
  } catch (error) {
    console.error('Error querying historic tables', error);
    throw error;
  }
}

export async function queryPastTables() {
  try {
    const historicTables = await queryHistoricTables();
    const tablesByStatus3 = await queryTablesByRange(3, 3);
    return [...historicTables, ...tablesByStatus3];
  } catch (error) {
    console.error('Error querying past tables', error);
    throw error;
  }
}

export function handleTableId(tableId: string) {
  if (!tableId) return;
  const shortid1 = tableId.split('-')[0];
  const shortid2 = tableId.split('-')[4];
  return `${shortid1}-${shortid2}`;
}