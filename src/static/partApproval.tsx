import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Button from '#/Button';
import UploadImage from '@/components/ui/AttachFile';
import { buttonAndPartProps } from '@/types/partTypes';
import {
  sendApprovedEmail,
  setPartProvider,
  updateStatus,
  queryPart,
} from '@/helpers/helperFunPart';
import ProviderQueryDropdown from '@/components/ui/ProviderQueryDropdown';
import { queryAllProvider } from '@/helpers/helperFunProvider';
import { Provider, Part } from '@/types/database';
import { DownloadFile } from '@/components/ui/DownloadFile';

export default function AutorizacionPartes({
  handleButton1,
  partID,
}: buttonAndPartProps) {
  const [allProvider, setAllProvider] = useState<Provider[]>([]);
  const [provider, setProvider] = useState<Provider | undefined>(undefined);  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [existingImage, setExistingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [part, setPart] = useState<Part | null>(null);

  useEffect(() => {
    const loadExistingData = async () => {
      if (!partID) {
        setError('No se proporcionó ID de la parte');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Load part data first to validate it exists
        const partData = await queryPart(partID);
        if (!partData) {
          throw new Error('No se encontró la parte');
        }

        // Validate part has price information
        if (partData.partReq?.price == null) {
          throw new Error('La parte no tiene información de precio');
        }

        setPart(partData);

        // 1. Query all providers
        const providers = await queryAllProvider(); // returns ProviderT[]
        setAllProvider(providers);

        // 2. If partData.Provider is set, use that
        if (partData.provider) {
          setProvider(partData.provider); 
        }

        // Check if image exists
        if (partData.partApprovalImg) {
          setExistingImage(true);
          setIsUploadComplete(true);
        }

        // Log successful data load
        console.log('Part data loaded successfully:', {
          id: partData.id,
          price: partData.partReq.price,
          provider: partData.provider?.name,
          hasImage: !!partData.partApprovalImg,
        });
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Error cargando datos');
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingData();
  }, [partID]);

  useEffect(() => {
    const updateProvider = async () => {
      if (!provider?.id || !partID) return;

      try {
        setError(null);
        await setPartProvider(partID, provider.id);
      } catch (err) {
        console.error('Error updating provider:', err);
        setError('Error actualizando proveedor');
      }
    };

    updateProvider();
  }, [provider, partID]);

  const handleClick = async () => {
    if (!part) {
      setError('No se encontró información de la parte');
      return;
    }

    if (!provider) {
      setError('Seleccione un proveedor para continuar');
      return;
    }

    if (!isUploadComplete && !existingImage) {
      setError('Adjunte una imagen de evidencia para continuar');
      return;
    }

    // Double check price exists and is a number
    const price = part.partReq?.price;
    if (typeof price !== 'number' || isNaN(price)) {
      setError('El precio de la parte no es válido');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Log the price and status calculation
      console.log('Processing part with price:', price);
      console.log('Is cash payment:', part.partReq?.isCash);

      const statusVal =
        price >= 5000
          ? 7
          : part.partReq?.isCash
          ? price >= 800
            ? 6
            : 8
          : 8;

      console.log('Calculated status value:', statusVal);

      if (statusVal === 8) {
        await sendApprovedEmail(partID);
      }

      await updateStatus(statusVal, partID);
      handleButton1();
    } catch (err) {
      console.error('Error processing part:', err);
      setError(err instanceof Error ? err.message : 'Error procesando la parte');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-20 flex flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
        <p className="mt-4 text-white">Procesando...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Autorización de Parte</title>
        <meta name="description" content="Camher" />
      </Head>
      <div className="mt-20 flex flex-col items-center justify-center gap-1">
        <h1 className="mb-5 self-center text-5xl font-extralight">
          Autorización de parte
        </h1>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {part && (
          <div className="mb-4 rounded-md bg-gray-100 p-4">
            <p className="text-gray-700">
              Precio de la parte: ${part.partReq?.price || 0}
            </p>
            <p className="text-gray-700">
              Tipo de pago: {part.partReq?.isCash ? 'Contado' : 'Crédito'}
            </p>
          </div>
        )}

        <h2 className="text-2xl self-center">
          Agrega una fotografía de la falla y selecciona un proveedor
        </h2>
        
        <div className="flex flex-col items-center space-y-4">
          <h3 className="mb-5 self-center font-mono text-2xl">
            {existingImage ? 'Evidencia Actual' : 'Adjuntar Evidencia'}
          </h3>

          {existingImage && (
            <div className="mb-4">
              <DownloadFile partID={partID} field="partApprovalImg" />
            </div>
          )}

          <UploadImage
            name={'partApprovalImg'}
            part={partID}
            isUploadComplete={isUploadComplete}
            setIsUploadComplete={setIsUploadComplete}
            imagesOnly
          />
        </div>

        <ProviderQueryDropdown
          options={allProvider}
          setOption={setProvider}
          className="mt-8 w-72 border border-black"
          placeholder={provider?.name || "Seleccionar proveedor..."}
        />

        <Button 
          className="m-5" 
          intent={'green'} 
          onClick={handleClick}
          disabled={isLoading || !provider || (!isUploadComplete && !existingImage)}
        >
          {'  '}ENVIAR{'  '}
        </Button>
      </div>
    </>
  );
}