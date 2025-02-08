import { supabase } from '@/lib/supabase';
import { Part } from '@/types/database';
import { uploadFileToS3 } from './s3';

export async function updateStatus(status: number, partID: string): Promise<Part> {
  try {
    const { data, error } = await supabase
      .from('parts')
      .update({ status })
      .eq('id', partID)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned after update');
    return data;
  } catch (error) {
    console.error('Error updating part status:', error);
    throw error;
  }
}

export async function queryPart(partID: string): Promise<Part> {
  try {
    const { data, error } = await supabase
      .from('parts')
      .select(`
        *,
        unit:units(*),
        provider:providers(*)
      `)
      .eq('id', partID)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Part not found');
    return data;
  } catch (error) {
    console.error('Error querying part:', error);
    throw error;
  }
}

export async function queryPartsByRange(status: number, maxStatus: number): Promise<Part[]> {
  try {
    const { data, error } = await supabase
      .from('parts')
      .select(`
        *,
        unit:units(*),
        provider:providers(*)
      `)
      .gte('status', status)
      .lte('status', maxStatus)
      .not('status', 'in', '(6,7,9)');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error querying parts by range:', error);
    throw error;
  }
}

export async function queryPartsByStatus(status: number): Promise<Part[]> {
  try {
    const { data, error } = await supabase
      .from('parts')
      .select(`
        *,
        unit:units(*),
        provider:providers(*)
      `)
      .eq('status', status);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error querying parts by status:', error);
    throw error;
  }
}

export async function queryPartsByTime(initialTime: string, finalTime: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('parts')
      .select('id')
      .gte('reqDate', initialTime)
      .lte('reqDate', finalTime);

    if (error) throw error;
    return data?.map(part => part.id) || [];
  } catch (error) {
    console.error('Error querying parts by time:', error);
    throw error;
  }
}

export async function updateFailureReport(update: {
  id: string;
  status: number;
  reqDate: string;
  failureReport: {
    problemLocation?: string;
    operator?: string;
    description?: string;
  };
}): Promise<Part> {
  try {
    const { data, error } = await supabase
      .from('parts')
      .update({
        status: update.status,
        reqDate: update.reqDate,
        failureReport: update.failureReport
      })
      .eq('id', update.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned after update');
    return data;
  } catch (error) {
    console.error('Error updating failure report:', error);
    throw error;
  }
}

export async function updateWorkOrder(update: {
  id: string;
  status: number;
  workOrder: {
    jobToBeDone?: string;
    personInCharge?: string;
    sparePart?: string;
    observation?: string;
  };
}): Promise<Part> {
  try {
    const { data, error } = await supabase
      .from('parts')
      .update({
        status: update.status,
        workOrder: update.workOrder
      })
      .eq('id', update.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned after update');
    return data;
  } catch (error) {
    console.error('Error updating work order:', error);
    throw error;
  }
}

export async function updatePartReq(update: {
  id: string;
  status: number;
  partReq: {
    partDescription?: string[];
    price?: number;
    unitaryPrice?: number[];
    quantity?: number[];
    isCash?: boolean;
    isImportant?: boolean;
  };
}): Promise<Part> {
  try {
    const { data, error } = await supabase
      .from('parts')
      .update({
        status: update.status,
        partReq: update.partReq
      })
      .eq('id', update.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned after update');
    return data;
  } catch (error) {
    console.error('Error updating part request:', error);
    throw error;
  }
}

export async function updateInvoiceInfo(update: {
  id: string;
  status?: number;
  invoiceInfo: {
    number?: string;
    date?: string;
    subTotal?: number;
  };
}): Promise<Part> {
  try {
    const { data, error } = await supabase
      .from('parts')
      .update({
        status: update.status,
        invoiceInfo: update.invoiceInfo
      })
      .eq('id', update.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned after update');
    return data;
  } catch (error) {
    console.error('Error updating invoice info:', error);
    throw error;
  }
}

export async function setPartProvider(partID: string, providerID: string): Promise<Part> {
  try {
    const { data, error } = await supabase
      .from('parts')
      .update({ providerID })
      .eq('id', partID)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned after update');
    return data;
  } catch (error) {
    console.error('Error setting part provider:', error);
    throw error;
  }
}

export async function updateValidationChecks(
  partID: string,
  validations: {
    contactProvider: boolean;
    correctPart: boolean;
    partDelivered: boolean;
    partInstalled: boolean;
    partStatus: string;
    validatedAt: string;
    validatedBy: string;
  }
): Promise<Part> {
  try {
    const { data, error } = await supabase
      .from('parts')
      .update({
        status: 9,
        workOrder: {
          observation: validations.partStatus,
          personInCharge: validations.validatedBy,
          jobToBeDone: `Validations completed at ${validations.validatedAt}. Contact: ${validations.contactProvider}, Correct: ${validations.correctPart}, Delivered: ${validations.partDelivered}, Installed: ${validations.partInstalled}`
        }
      })
      .eq('id', partID)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned after update');
    return data;
  } catch (error) {
    console.error('Error updating validation checks:', error);
    throw error;
  }
}

export async function sendApprovedEmail(partID: string): Promise<void> {
  const key = `adminApproval/${partID}`;
  const blob = new Blob(['Mock File Content'], { type: 'text/plain' });
  const mockFile = new File([blob], 'mock-file.txt', {
    type: 'text/plain',
  });

  try {
    await uploadFileToS3(mockFile, key);
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw new Error('El proveedor no ha sido notificado debido a un error, favor de notificarlo manualmente');
  }
}