import React from 'react';
import { Provider } from '../../../types';

interface Props {
  providers: Provider[];
  selectedProvider: string;
  damagePhoto: File | null;
  onProviderChange: (providerId: string) => void;
  onPhotoChange: (file: File | null) => void;
  existingPhotoUrl?: string | null;
}

const AutorizacionPartes: React.FC<Props> = ({
  providers,
  selectedProvider,
  damagePhoto,
  onProviderChange,
  onPhotoChange,
  existingPhotoUrl
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onPhotoChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Autorización de Partes</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Foto del daño
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {existingPhotoUrl ? (
              <div className="space-y-2">
                <img 
                  src={existingPhotoUrl} 
                  alt="Foto del daño" 
                  className="mx-auto h-32 w-auto object-cover rounded-lg"
                />
                <p className="text-sm text-gray-500">Foto actual</p>
                <div className="flex justify-center">
                  <label className="cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Cambiar foto</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Subir foto</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG hasta 10MB
                </p>
              </>
            )}
          </div>
        </div>
        {damagePhoto && (
          <p className="mt-2 text-sm text-gray-500">
            Nueva foto seleccionada: {damagePhoto.name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Proveedor
        </label>
        <select
          value={selectedProvider}
          onChange={(e) => onProviderChange(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Seleccionar proveedor...</option>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AutorizacionPartes;