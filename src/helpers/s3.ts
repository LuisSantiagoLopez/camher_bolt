import { supabase } from '@/lib/supabase';
import mime from 'mime-types';
import { queryPart } from './helperFunPart';

export const enum Field {
  invoiceImg = 'invoiceImg',
  partApprovalImg = 'partApprovalImg',
  counterReceiptImg = 'counterReceiptImg',
  invoice = "invoice"
}

export const uploadFileToS3 = async (
  selectedFile: File,
  key: string,
  imagesOnly: boolean = false,
  isTable: boolean = false,
) => {
  if (!selectedFile) {
    throw new Error('No file selected');
  }

  const mimeType = mime.lookup(selectedFile.name) as string;
  if (!mimeType) {
    throw new Error('Could not determine file type');
  }

  const allAllowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ];

  const imageMimeTypes = ['image/jpeg', 'image/png'];
  const excelMimeTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  const allowedMimeTypes = isTable
    ? excelMimeTypes
    : imagesOnly
    ? imageMimeTypes
    : allAllowedMimeTypes;

  if (!allowedMimeTypes.includes(mimeType)) {
    throw new Error('FileTypeNotAllowedException');
  }

  const extension = mime.extension(mimeType) || 'dat';
  const uploadKey = `${key}.${extension}`;

  try {
    const { data, error } = await supabase.storage
      .from('files')
      .upload(uploadKey, selectedFile, {
        contentType: mimeType,
        upsert: true
      });

    if (error) throw error;
    return uploadKey;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export async function fetchFileFromS3(
  partID: string,
  field: keyof typeof Field,
): Promise<{ blob: Blob | null; filename: string | null }> {
  if (!partID) {
    throw new Error('Part ID is required');
  }

  try {
    const part = await queryPart(partID);
    if (!part) {
      throw new Error('Part not found');
    }

    let key;
    switch (field) {
      case Field.invoiceImg:
        key = part.invoiceImg;
        break;
      case Field.partApprovalImg:
        key = part.partApprovalImg;
        break;
      case Field.counterReceiptImg:
        key = part.counterRecieptImg;
        break;
      default:
        throw new Error('Invalid field type');
    }

    if (!key) {
      console.log(`No ${field} file found for part ${partID}`);
      return { blob: null, filename: null };
    }

    const { data, error } = await supabase.storage
      .from('files')
      .download(key);

    if (error) throw error;
    if (!data) {
      throw new Error('No data received from storage');
    }

    const filename = `${key.split('/')[1]}`;

    return { blob: data, filename };
  } catch (error) {
    console.error('Error fetching file from storage:', error);
    throw error;
  }
}