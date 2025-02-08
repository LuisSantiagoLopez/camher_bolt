import { supabase } from '@/lib/supabase';
import { Table } from '@/types/database';

export async function updateTableStatus(status: number, tableID: string): Promise<Table> {
  try {
    const { data, error } = await supabase
      .from('tables')
      .update({ status })
      .eq('id', tableID)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned after update');
    return data;
  } catch (error) {
    console.error('Error updating table status:', error);
    throw error;
  }
}

export async function queryTablesByTime(initialTime: string, finalTime: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('id')
      .gte('createdAt', initialTime)
      .lte('createdAt', finalTime);

    if (error) throw error;
    return data?.map(table => table.id) || [];
  } catch (error) {
    console.error('Error querying tables by time:', error);
    throw error;
  }
}

export async function queryTablesByRange(minStatus: number, maxStatus: number): Promise<Table[]> {
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .gte('status', minStatus)
      .lte('status', maxStatus);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error querying tables by range:', error);
    throw error;
  }
}

export async function queryHistoricTables(): Promise<Table[]> {
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('type', 'HISTORY');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error querying historic tables:', error);
    throw error;
  }
}

export async function queryPastTables(): Promise<Table[]> {
  try {
    const [historicTables, tablesByStatus3] = await Promise.all([
      queryHistoricTables(),
      queryTablesByRange(3, 3)
    ]);
    return [...historicTables, ...tablesByStatus3];
  } catch (error) {
    console.error('Error querying past tables:', error);
    throw error;
  }
}

export function handleTableId(tableId: string): string | undefined {
  if (!tableId) return;
  const shortid1 = tableId.split('-')[0];
  const shortid2 = tableId.split('-')[4];
  return `${shortid1}-${shortid2}`;
}