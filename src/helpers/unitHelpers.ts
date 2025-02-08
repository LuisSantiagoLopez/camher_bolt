import { API, graphqlOperation } from 'aws-amplify';
import {
  UnitT as Unit,
  PartT as Part,
  TableT as Table,
  listUnits,
  createPart,
  createUnit,
  CreatePartMutation,
  ListUnitsQuery,
  CreateUnitMutation,
  TablesByTypeQuery,
  tablesByType,
} from '@/graphql';
import { createPartNoProvider } from '@/graphql/customMutations/createPartNoProvider';

export const createLinkedPart = async (unitID: string, tableID: string) => {
  try {
    if (!unitID) {
      throw new Error('No unit provided to createLinkedPart');
    }

    const response = (await API.graphql(
      graphqlOperation(createPartNoProvider, {
        input: {
          unitID,
          tableID,
        },
      })
    )) as { data: CreatePartMutation };

    const newPart = response as { data: CreatePartMutation };
    
    if (!newPart?.data?.createPart) {
      throw new Error('createPart mutation failed to return a valid part');
    }
    
    return newPart.data.createPart;
  } catch (error) {
    console.error('Error creating linked part:', error);
    throw error;
  }
};

export const queryAllUnits = async () => {
  try {
    const allUnits = (await API.graphql({
      query: listUnits,
    })) as { data: ListUnitsQuery };

    if (!allUnits.data.listUnits?.items) return [];
    return allUnits.data.listUnits.items as Unit[];
  } catch (error) {
    console.error('Error querying all units:', error);
    throw error;
  }
};

export const createNewUnit = async (name: String) => {
  try {
    const newUnit = (await API.graphql({
      query: createUnit,
      variables: {
        input: {
          name: name,
        },
      },
    })) as { data: CreateUnitMutation };

    return newUnit.data.createUnit as Unit;
  } catch (error) {
    console.error('Error creating new unit:', error);
    throw new Error('Error creating new unit');
  }
};

export const getCurrentTableID = async (): Promise<string | null> => {
  try {
    const res = (await API.graphql({
      query: tablesByType,
      variables: {
        type: 'CURRENT',
      },
    })) as { data: TablesByTypeQuery };

    const currentTableID = res.data.tablesByType?.items[0]?.id;

    if (!currentTableID) {
      console.warn('No current table found. Returning null.');
      return null;
    }

    return currentTableID;
  } catch (error) {
    console.error('Could not fetch current table:', error);
    throw new Error('Could not fetch current table: ' + error);
  }
};