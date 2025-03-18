import React, { useState } from 'react';
import { X, FileSpreadsheet, ArrowUpCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { WeeklyTable } from '../../types';

interface Props {
  table: WeeklyTable;
  onClose: () => void;
  onUpdated: () => void;
}

const UpdateWeeklyTable: React.FC<Props> = ({ table, onClose, onUpdated }) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleConfirmExisting = async () => {
    try {
      setUploading(true);
      setError('');

      // Update weekly table status to confirmed
      const { error: updateError } = await supabase
        .from('weekly_tables')
        .update({
          status: 1 // Set status to confirmed
        })
        .eq('id', table.id);

      if (updateError) throw updateError;

      onUpdated();
      onClose();
    } catch (error) {
      console.error('Error confirming weekly table:', error);
      setError('Error al confirmar la tabla semanal');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      setError('');

      // Upload new table file
      const fileExt = file.name.split('.').pop();
      const fileName = `weekly-table-${table.week_start}-${table.week_end}-updated.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('weekly_tables')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('weekly_tables')
        .getPublicUrl(fileName);

      // Update weekly table
      const { error: updateError } = await supabase
        .from('weekly_tables')
        .update({
          table_url: publicUrl,
          status: 1 // Set status to confirmed
        })
        .eq('id', table.id);

      if (updateError) throw updateError;

      onUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating weekly table:', error);
      setError('Error al actualizar la tabla semanal');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Actualizar y Confirmar Tabla Semanal
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!showFileUpload ? (
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-600">
              ¿Qué acción deseas realizar con esta tabla semanal?
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setShowFileUpload(true)}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ArrowUpCircle className="h-5 w-5 mr-2" />
                Subir nueva tabla con cambios
              </button>

              <button
                onClick={handleConfirmExisting}
                disabled={uploading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                Continuar con la tabla actual
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleUploadNew} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nueva Tabla con Cambios
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="table-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Subir archivo</span>
                      <input
                        id="table-upload"
                        name="table-upload"
                        type="file"
                        className="sr-only"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">o arrastra y suelta</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    XLSX, XLS, CSV
                  </p>
                </div>
              </div>
              {file && (
                <p className="text-sm text-gray-500">
                  Archivo seleccionado: {file.name}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowFileUpload(false)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Regresar
              </button>
              <button
                type="submit"
                disabled={!file || uploading}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {uploading ? 'Subiendo...' : 'Subir y Confirmar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateWeeklyTable;