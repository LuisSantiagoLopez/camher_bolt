import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartRequest } from '../../types';
import { validateFileUpload, ALLOWED_DOCUMENT_TYPES } from '../../utils/validation';

interface Props {
  request: PartRequest;
  onClose: () => void;
  onUploaded: () => void;
}

const CounterReceipt: React.FC<Props> = ({ request, onClose, onUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validationError = validateFileUpload(selectedFile, ALLOWED_DOCUMENT_TYPES);
      
      if (validationError) {
        setError(validationError);
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      setError('');

      // Upload counter receipt file
      const fileExt = file.name.split('.').pop();
      const fileName = `${request.id}-counter-receipt.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('counter_receipts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('counter_receipts')
        .getPublicUrl(fileName);

      // Update part request
      const { error: updateError } = await supabase
        .from('part_requests')
        .update({
          counter_receipt_url: publicUrl,
          status: 'status_13',
          edit_message: 'Contra recibo subido correctamente'
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      onUploaded();
      onClose();
    } catch (error) {
      console.error('Error uploading counter receipt:', error);
      setError('Error al subir el contra recibo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Subir Contra Recibo - #{request.short_id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Archivo de Contra Recibo
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="counter-receipt-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Subir archivo</span>
                    <input
                      id="counter-receipt-upload"
                      name="counter-receipt-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, PNG, JPG hasta 10MB
                </p>
              </div>
            </div>
            {file && (
              <p className="text-sm text-gray-500">
                Archivo seleccionado: {file.name}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Al subir el contra recibo, la solicitud pasará a estado de aprobación final.
              Asegúrate de que el documento sea claro y legible.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!file || uploading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {uploading ? 'Subiendo...' : 'Subir Contra Recibo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounterReceipt;