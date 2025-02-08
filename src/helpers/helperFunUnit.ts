import { supabase } from '@/lib/supabase';
import { Unit, Part } from '@/types/database';

export const createLinkedPart = async (unitID: string, tableID: string): Promise<Part> => {
  try {
    if (!unitID) {
      throw new Error('No unit provided to createLinkedPart');
    }

    const { data, error } = await supabase
      .from('parts')
      .insert({
        unitID,
        tableID,
        status: 1
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned after insert');
    return data;
  } catch (error) {
    console.error('Error creating linked part:', error);
    throw error;
  }
};

export const queryAllUnits = async (): Promise<Unit[]> => {
  try {
    const { data, error } = await supabase
      .from('units')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error querying all units:', error);
    throw error;
  }
};

export const createNewUnit = async (name: string): Promise<Unit> => {
  try {
    if (!name.trim()) {
      throw new Error('Unit name is required');
    }

    const { data, error } = await supabase
      .from('units')
      .insert({ name })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned after insert');
    return data;
  } catch (error) {
    console.error('Error creating new unit:', error);
    throw error;
  }
};

export const getCurrentTableID = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('id')
      .eq('type', 'CURRENT')
      .single();

    if (error) throw error;
    if (!data) {
      console.warn('No current table found');
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Could not fetch current table:', error);
    throw error;
  }
};