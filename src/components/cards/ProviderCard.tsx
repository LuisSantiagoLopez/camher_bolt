import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { PartT as Part } from '@/graphql';
import { updateInvoiceInfo, updateStatus } from '@/helpers/helperFunPart';
import { DatePicker } from '@/components/ui/DatePicker';
import { DateRangeType } from '@/types/datepickerTypes';
import TextInput from '@/components/ui/TextInput';
import YesNo from '@/reusable/yesNo';
import UploadImage from '@/components/ui/AttachFile';
import { DownloadFile } from '@/components/ui/DownloadFile';
import { Field, fetchFileFromS3 } from '@/helpers/s3';

interface ProviderCardProps {
  unit: Part;
  name: string;
  isInvoice?: boolean;
}

export default function ProviderCard({ unit, name, isInvoice }: ProviderCardProps) {
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [isManualUploadComplete, setIsManualUploadComplete] = useState(false);
  const [manualUpload, setManualUpload] = useState(false);
  const [invoiceInfo, setInvoiceInfo] = useState({
    number: '',
    subTotal: Number(''),
  });

  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showAcceptance, setShowAcceptance] = useState(true);
  const [acceptedOrder, setAcceptedOrder] = useState(false);

  const initialDateRange: DateRangeType = {
    startDate: new Date(new Date().setDate(new Date().getDate())),
    endDate: new Date(new Date().setDate(new Date().getDate())),
  };
  const [invoiceDate, setInvoiceDate] = useState<DateRangeType>(initialDateRange);

  async function handleAcceptanceYes() {
    setShowAcceptance(false);
    setAcceptedOrder(true);
  }

  async function handleAcceptanceNo() {
    if (!unit?.id) return;
    try {
      await updateStatus((unit.status ?? 0) - 1, unit.id);
      alert('Orden rechazada. Volviendo al menú anterior.');
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error as Error);
    }
  }

  function handleSetInvoiceNumber(e: React.ChangeEvent<HTMLInputElement>) {
    setInvoiceInfo({ ...invoiceInfo, number: String(e.target.value) });
  }

  function handleSetInvoiceSubtotal(e: React.ChangeEvent<HTMLInputElement>) {
    setInvoiceInfo({ ...invoiceInfo, subTotal: Number(e.target.value) });
  }

  useEffect(() => {
    if (isManualUploadComplete) {
      alert('Gracias por subir tu factura.');
    }
  }, [isManualUploadComplete]);

  useEffect(() => {
    const loadPartData = async () => {
      if (!unit) return;
      
      try {
        setIsLoading(true);
        
        // Load existing invoice info if available
        if (unit.invoiceInfo) {
          setInvoiceInfo({
            number: unit.invoiceInfo.number as string,
            subTotal: unit.invoiceInfo.subTotal || 0,
          });
          if (unit.invoiceInfo.date) {
            setInvoiceDate({
              startDate: unit.invoiceInfo.date,
              endDate: unit.invoiceInfo.date,
            });
          }
        }

        // Try to fetch the image
        if (unit.id) {
          const { blob } = await fetchFileFromS3(unit.id, isInvoice ? Field.invoice : Field.counterReciept);
          if (blob) {
            const url = URL.createObjectURL(blob);
            setUrl(url);
          }
        }
      } catch (err) {
        console.error('Error loading part data:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPartData();

    // Cleanup function
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [unit, isInvoice]);

  async function handleYes() {
    if (!unit) return;

    if (isInvoice) {
      if (!invoiceInfo.number || !invoiceInfo.subTotal) {
        alert('Por favor completa la información de la factura.');
        return;
      }
    }

    if (!isUploadComplete) {
      alert('Ningún archivo subido, por favor asegúrate de añadirlo.');
      return;
    }

    setIsUploadComplete(false);

    try {
      if (unit?.id) {
        const dateObject = new Date(invoiceDate?.startDate || Date.now());
        const awsDateTime = dateObject.toISOString();

        const info = {
          id: unit.id,
          status: isInvoice ? 12 : 11, // Update status based on invoice or receipt
          invoiceInfo: {
            ...invoiceInfo,
            date: awsDateTime,
          },
        };

        await updateInvoiceInfo(info);
        alert(
          isInvoice
            ? '¡La factura fue agregada con éxito! \n Vuelve al menú para poder realizar otras operaciones'
            : '¡El contrarecibo fue envíado con éxito! \n Vuelve al menu para poder realizar otras operaciones.',
        );
        window.location.reload();
      }
    } catch (err) {
      console.error('Error updating invoice info:', err);
      setError(err as Error);
      alert('Error al actualizar la información. Por favor intenta de nuevo.');
    }
  }

  function handleNo() {
    if (!unit) return;
    if (!isInvoice) {
      setManualUpload(true);
    } else {
      alert('No es posible avanzar sin subir la factura.');
    }
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="mx-auto max-w-[90%] text-xl font-bold text-white md:text-2xl lg:text-5xl">
        {name}
      </div>
      <div className="flex flex-row justify-center">
        {isInvoice ? (
          <div className="mt-8 flex w-full flex-col items-center space-y-4">
            <TextInput
              intent="regular"
              placeholder="Número de Factura"
              value={invoiceInfo.number}
              onChange={handleSetInvoiceNumber}
            />
            <TextInput
              intent="regular"
              placeholder="Subtotal"
              value={invoiceInfo.subTotal}
              onChange={handleSetInvoiceSubtotal}
            />
            <DatePicker
              value={invoiceDate}
              setValue={setInvoiceDate}
              placeholder="Fecha de Factura"
              asSingle={true}
            />
            <div className="w-[50%]">
              <h1 className="my-2 text-2xl font-bold text-white">
                Subir Factura
              </h1>
              <UploadImage
                name={'invoiceImg'}
                part={unit?.id as string}
                isUploadComplete={isUploadComplete}
                setIsUploadComplete={setIsUploadComplete}
              />
            </div>
          </div>
        ) : (
          <div className="mt-8 w-[50%] self-center text-center">
            <h1 className="my-2 text-2xl font-bold text-white">
              Subir Contrarecibo
            </h1>
            <UploadImage
              name={'counterRecieptImg'}
              part={unit?.id as string}
              isUploadComplete={isUploadComplete}
              setIsUploadComplete={setIsUploadComplete}
            />
          </div>
        )}
      </div>

      {showAcceptance ? (
        <YesNo
          title="¿Aceptas esta orden?"
          handleNo={handleAcceptanceNo}
          handleYes={handleAcceptanceYes}
          inputText={false}
        />
      ) : (
        acceptedOrder && (
          <YesNo
            title={
              isInvoice
                ? '¿Deseas subir la factura?'
                : '¿Deseas subir el contrarecibo?'
            }
            handleNo={handleNo}
            handleYes={handleYes}
            inputText={false}
          />
        )
      )}

      <div className="mt-3 flex flex-row items-center justify-between text-sm">
        <p className="text-sm text-white">{unit && unit.reqDate}</p>
        <div className="flex flex-col justify-center self-end rounded-md bg-camhergreen px-2 text-black">
          <p className="mx-auto">{unit && unit.id}</p>
        </div>
      </div>
    </>
  );
}