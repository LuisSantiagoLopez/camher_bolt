import { supabase } from '@/lib/supabase';
import { Provider, Part } from '@/types/database';

export const setNewProviderEmails = async (id: string, newEmails: string[]): Promise<Provider> => {
  try {
    const { data, error } = await supabase
      .from('providers')
      .update({ emails: newEmails })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned after update');
    return data;
  } catch (error) {
    console.error('Error updating provider emails:', error);
    throw error;
  }
};

export const queryAllProvider = async (): Promise<Provider[]> => {
  try {
    const { data, error } = await supabase
      .from('providers')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error querying all providers:', error);
    throw error;
  }
};

export const queryProviderByEmail = async (email: string): Promise<Provider> => {
  if (!email) throw new Error('Email is required');
  
  try {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .contains('emails', [email])
      .single();

    if (error) throw error;
    if (!data) throw new Error('No provider found with this email');

    return data;
  } catch (error) {
    console.error('Error querying provider by email:', error);
    throw error;
  }
};

export const queryPartsForProvider = async (providerID: string): Promise<Part[]> => {
  try {
    const { data, error } = await supabase
      .from('parts')
      .select(`
        *,
        unit:units(*),
        provider:providers(*)
      `)
      .eq('providerID', providerID)
      .eq('status', 9);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error querying parts for provider:', error);
    throw error;
  }
};