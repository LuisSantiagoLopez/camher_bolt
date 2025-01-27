import {
  AiFillExclamationCircle,
  AiOutlineDownload,
  AiFillQuestionCircle,
  AiOutlineClose,
  AiOutlineUnorderedList,
  AiOutlineFieldTime,
} from 'react-icons/ai';
import { useSelectedToolContext } from '@/context/SelectedToolContext'; // Ensure this path is correct
import { IoPricetag } from 'react-icons/io5';
import { IconContext } from 'react-icons';
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Semaforo from './Semaforo';
import YesNo from '@/reusable/yesNo';
import { sendApprovedEmail, updateInvoiceInfo, updateStatus } from '@/helpers/helperFunPart';
import { useRouter } from 'next/router';
import { getUnitName } from '@/helpers/helperFunPart';
import { getPartTableBlob } from '@/helpers/createSheet';
import useFlowContext from '@/context/FlowContext';
import { Field, fetchFileFromS3 } from '@/helpers/s3';

// Import types
import type { CardProps } from '../../types/cardTypes.d.ts';

import { PartT as Part, UnitT as Unit } from '@/graphql';
import UploadImage from './AttachFile';
import TextInput from './TextInput';
import { DatePicker } from './DatePicker';
import { DateRangeType, DateValueType } from '@/types/datepickerTypes';
import CardBackground from './CardBackground';
import { DownloadFile } from './DownloadFile';
import { TallerContext } from '@/flows/taller';

async function getImg(unitID: string) {
  try {
    if (!unitID) return;
    const { blob } = await fetchFileFromS3(unitID, 'partApprovalImg');
    if (!blob) return;
    const url = window.URL.createObjectURL(blob);
    if (!url) return;

    return url;
  } catch (error) {
    console.error('Error fetching image', error);
  }
}

function UnitCard({ unit, name }: { unit: Part; name?: string }) {
  const [url, setUrl] = React.useState('');
  const [shortId, setShortId] = React.useState('');

  useEffect(() => {
    if (!unit) return;

    const shortid1 = unit.id.split('-')[0];
    const shortid2 = unit.id.split('-')[4];
    setShortId(shortid1 + '-' + shortid2);

    const handleGetImg = async () => {
      try {
        const url = await getImg(unit.id);
        if (!url) return;
        setUrl(url);
      } catch (error) {
        console.error('Error fetching image', error);
      }
    };
    handleGetImg();
  }, []);

  const downloadFIle = () => {
    if (!unit) return;
    getPartTableBlob([unit.id]);
  };

  return (
    <>
      <div
        id="leftContainer"
        className="flex flex-row justify-center text-center "
      >
        {url && (
          <Image
            src={url}
            alt={'unit' + shortId + 'evidence'}
            width={400}
            height={400}
            className="m-2 h-96 rounded-md"
          />
        )}
        C{/* text unit name*/}
        <div
          id="cardInfo"
          className="ml-16 flex flex-col items-start justify-around"
        >
          <div id="infoContainer" className="flex flex-row space-x-5">
            <div className="text-5xl font-bold text-white">UNIDAD {name}</div>
            {/* text unit importance logo */}
            <button onClick={downloadFIle}>
              <IconContext.Provider value={{ size: '1.5em' }}>
                <AiOutlineDownload />
              </IconContext.Provider>
            </button>
            {/* text unit number */}
          </div>
          {/* text unit info */}
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <AiOutlineUnorderedList />
            </IconContext.Provider>
            <p className="text-xl font-light">
              {unit && unit.failureReport?.description}
            </p>
          </div>
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <AiFillQuestionCircle />
            </IconContext.Provider>
            <p className="text-xl font-light">
              {unit && unit.failureReport?.description}
            </p>
          </div>
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <IoPricetag />
            </IconContext.Provider>
            <p className="text-xl font-light">
              {unit && unit.partReq?.price} MXN
            </p>
          </div>
        </div>
      </div>
      <div
        id="cardFooter"
        className="mt-3 flex flex-row items-center justify-between text-sm"
      >
        <p className="text-sm text-white">{unit && unit.reqDate}</p>
        <div
          id="cardID"
          className="flex flex-col justify-center self-end rounded-md bg-camhergreen px-2 text-black"
        >
          <p className="mx-auto">{unit && unit.id}</p>
        </div>
      </div>
    </>
  );
}

function AdminCard({
  unit,
  isAction,
  name,
}: {
  unit: Part;
  isAction?: boolean;
  name?: String;
}) {
  const [url, setUrl] = React.useState('');
  const [shortId, setShortId] = React.useState('');
  const router = useRouter();

  const handleClick1 = async () => {
    if (!unit) return;
    await updateStatus(8, unit.id);
    await sendApprovedEmail(unit.id);
    router.reload();
  };

  const handleClick2 = async () => {
    if (!unit) return;
    await updateStatus(-1, unit.id);
    router.reload();
  };

  const downloadFIle = () => {
    if (!unit) return;
    getPartTableBlob([unit.id]);
  };

  useEffect(() => {
    if (!unit) return;
    const shortid1 = unit.id.split('-')[0];
    const shortid2 = unit.id.split('-')[4];
    setShortId(shortid1 + '-' + shortid2);

    const handleGetImg = async () => {
      try {
        const url = await getImg(unit.id);
        if (!url) return;
        setUrl(url);
      } catch (error) {
        console.error('Error fetching image', error);
      }
    };
    handleGetImg();
  }, []);

  return (
    <>
      <div
        id="leftContainer"
        className="flex flex-row justify-center text-center"
      >
        {url && (
          <Image
            className="m-2 h-96 rounded-md"
            src={url}
            alt={'unit' + shortId + 'evidence'}
            width={400}
            height={400}
          />
        )}
        {/* text unit name*/}
        <div
          id="cardInfo"
          className="ml-16 flex flex-col items-start justify-around"
        >
          <div id="infoContainer" className="flex flex-row space-x-5">
            <div className="text-5xl font-bold text-white">UNIDAD {name}</div>
            {/* text unit importance logo */}
            <button onClick={downloadFIle}>
              <IconContext.Provider value={{ size: '1.5em' }}>
                <AiOutlineDownload />
              </IconContext.Provider>
            </button>
            {/* text unit number */}
          </div>
          {/* text unit info */}
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <AiOutlineUnorderedList />
            </IconContext.Provider>
            <p className="text-xl font-light">
              {unit && unit.failureReport?.description}
            </p>
          </div>
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <AiFillQuestionCircle />
            </IconContext.Provider>
            <p className="text-xl font-light">
              {unit && unit.partReq?.partDescription}
            </p>
          </div>
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <IoPricetag />
            </IconContext.Provider>
            <p className="text-xl font-light">
              {unit && unit.partReq?.price} MXN
            </p>
          </div>
        </div>
      </div>
      {isAction ? (
        <YesNo
          title="¿Apruebas continuar este proceso?"
          handleNo={handleClick2}
          handleYes={handleClick1}
          inputText={false}
        />
      ) : (
        <></>
      )}
      <div
        id="cardFooter"
        className="mt-3 flex flex-row items-center justify-between text-sm"
      >
        <p className="text-sm text-white">{unit && unit.reqDate}</p>
        <div
          id="cardID"
          className="flex flex-col justify-center self-end rounded-md bg-camhergreen px-2 text-black"
        >
          <p className="mx-auto">{unit && unit.id}</p>
        </div>
      </div>
    </>
  );
}

interface FailureCardProps {
  failure: Part;
  isAction?: boolean;
  name?: string;
  handleClick: (unit: Part, status: number) => void;
}

const FailureCard: React.FC<FailureCardProps> = ({
  failure,
  isAction = false,
  name = '',
  handleClick,
}) => {
  const { setPastTools, setSelectedTool } = useSelectedToolContext();
  const [url, setUrl] = useState<string>('');
  const [shortId, setShortId] = useState<string>('');

  const downloadFile = async () => {
    if (!failure) return;
    console.log('Downloading file for part ID:', failure.id);
    try {
      await getPartTableBlob([failure.id]);
      console.log('File downloaded successfully for part ID:', failure.id);
    } catch (error) {
      console.error('Error downloading file for part ID:', failure.id, error);
    }
  };

  const handleClick1 = () => {
    if (!failure) return;
    handleClick(failure, failure.status ? failure.status : 1);
  };

  const handleClick2 = () => {
    handleClick(failure, -1);
  };

  const handleEdit = () => {
    // Store current part data in session storage
    sessionStorage.setItem('editingPart', JSON.stringify(failure));
    // Navigate to edit flow
    setPastTools(['status', 'action']);
    setSelectedTool('newrefaction');
  };

  useEffect(() => {
    if (!failure) return;

    const idParts = failure.id.split('-');
    if (idParts.length >= 5) {
      const shortid1 = idParts[0];
      const shortid2 = idParts[4];
      setShortId(`${shortid1}-${shortid2}`);
    } else {
      setShortId(failure.id);
    }

    const handleGetImg = async () => {
      try {
        const imgUrl = await getImg(failure.id);
        if (!imgUrl) return;
        setUrl(imgUrl);
      } catch (error) {
        console.error('Error fetching image', error);
      }
    };
    handleGetImg();
  }, [failure]);

  return (
    <>
      <div
        id="leftContainer"
        className="flex flex-col justify-center text-center md:flex-row"
      >
        {url && (
          <Image
            className="m-2 h-96 rounded-md"
            src={url}
            alt={`unit${shortId}evidence`}
            width={400}
            height={400}
          />
        )}
        <div
          id="cardInfo"
          className="ml-16 flex w-[75%] flex-col items-start justify-around"
        >
          <div id="infoContainer" className="flex flex-row space-x-5">
            <div className="text-5xl font-bold text-white">UNIDAD {name}</div>
            <button onClick={downloadFile} className="hover:opacity-80">
              <IconContext.Provider value={{ size: '1.5em' }}>
                <AiOutlineDownload />
              </IconContext.Provider>
            </button>
          </div>
          {failure?.invoiceImg && (
            <DownloadFile partID={failure.id} field={Field.invoice} />
          )}
          <div className="mt-5 flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <AiOutlineUnorderedList />
            </IconContext.Provider>
            <p className="text-xl font-light">
              {failure?.failureReport?.description}
            </p>
          </div>
          <div className="mt-5 flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <AiFillQuestionCircle />
            </IconContext.Provider>
            <p className="text-xl font-light">
              {failure?.failureReport?.operator}
            </p>
          </div>
          <div className="my-5 flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <AiOutlineFieldTime />
            </IconContext.Provider>
            <p className="font-light md:text-sm lg:text-xl">
              {failure?.updatedAt}{' '}
            </p>
          </div>
        </div>
      </div>
      {isAction && (
        <div className="flex justify-center space-x-4">
          <button
            className="h-12 w-[20%] rounded-lg bg-camhergreen font-light text-stone-700 hover:w-[22%] hover:font-semibold md:text-base lg:text-xl"
            onClick={handleClick1}
          >
            Continuar proceso
          </button>
          <button
            className="h-12 w-[20%] rounded-lg bg-blue-500 font-light text-white hover:w-[22%] hover:font-semibold hover:bg-blue-600 md:text-base lg:text-xl"
            onClick={handleEdit}
          >
            Editar
          </button>
          <button
            className="h-12 w-[20%] rounded-lg bg-camherred font-light text-stone-700 hover:w-[22%] hover:font-semibold md:text-base lg:text-xl"
            onClick={handleClick2}
          >
            Cancelar
          </button>
        </div>
      )}
      <div
        id="cardFooter"
        className="mt-3 flex flex-row items-center justify-between text-sm"
      >
        <p className="text-sm text-white">{failure?.reqDate}</p>
        <div
          id="cardID"
          className="flex flex-col justify-center self-end rounded-md bg-camhergreen px-2 text-black"
        >
          <p className="mx-auto">{failure && failure.id}</p>
        </div>
      </div>
    </>
  );
};


function CounterCard({ counter }: { counter: Unit }) {
  // Render counter card with counter number as title, and a button to download the counter in one of the divs.
  return (
    <>
      <div
        id="leftContainer"
        className="flex flex-row justify-center text-center"
      >
        {/* text table name*/}
        <div
          id="cardInfo"
          className="ml-16 flex flex-col items-start justify-around"
        >
          <div id="infoContainer" className="flex flex-row space-x-5">
            <div className="text-5xl font-bold text-white">
              TABLA {counter && counter.id}
            </div>
            {/* text table importance logo */}
            <IconContext.Provider value={{ color: 'red', size: '2.5em' }}>
              <AiFillExclamationCircle />
            </IconContext.Provider>
            {/* text table number */}
          </div>
          {/* text table info */}
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <AiOutlineUnorderedList />
            </IconContext.Provider>
          </div>
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <AiFillQuestionCircle />
            </IconContext.Provider>
          </div>
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <IoPricetag />
            </IconContext.Provider>
          </div>
        </div>
      </div>
      <div
        id="cardFooter"
        className="mt-3 flex flex-row items-center justify-between text-sm"
      >
        <div
          id="cardID"
          className="flex flex-col justify-center self-end rounded-md bg-camhergreen px-2 text-black"
        >
          <p className="mx-auto">{counter && counter.id}</p>
        </div>
      </div>
    </>
  );
}

function ProviderCard({
  unit,
  name,
  isInvoice,
}: {
  unit: Part;
  name: string;
  isInvoice?: boolean;
}) {
  const [isUploadComplete, setIsUploadComplete] = React.useState(false);
  const [isManualUploadComplete, setIsManualUploadComplete] =
    React.useState(false);
  const [manualUpload, setManualUpload] = React.useState(false);
  const [invoiceInfo, setInvoiceInfo] = React.useState({
    number: '',
    subTotal: Number(''),
  });

  const [isOrderAccepted, setIsOrderAccepted] = React.useState(false);
  const [isOrderRejected, setIsOrderRejected] = React.useState(false);

  const [url, setUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  async function handleRejectOrder() {
    if (unit?.id) {
      try {
        await updateStatus(6, unit.id); // Cambia el estado al flujo de taller
        alert("El proveedor rechazó la orden. Regresando al flujo de taller.");
        window.location.reload();
      } catch (error) {
        console.error("Error actualizando el estatus de la parte", error);
      }
    }
  }
  

  const initialDateRange: DateRangeType = {
    startDate: new Date(new Date().setDate(new Date().getDate())),
    endDate: new Date(new Date().setDate(new Date().getDate())),
  };
  const [invoiceDate, setInvoiceDate] =
    useState<DateRangeType>(initialDateRange);

  function handleSetInvoiceNumber(e: React.ChangeEvent<HTMLInputElement>) {
    setInvoiceInfo({ ...invoiceInfo, number: String(e.target.value) });
  }

  function handleSetInvoiceSubtotal(e: React.ChangeEvent<HTMLInputElement>) {
    setInvoiceInfo({ ...invoiceInfo, subTotal: Number(e.target.value) });
  }

  // In ProviderCard component:
  const handleDateChange = (newValue: DateRangeType) => {
    setInvoiceDate(newValue);
  };

  useEffect(() => {
    // Check if manual upload is complete, alert and after ok reload page
    if (isManualUploadComplete) {
      alert('Gracias por subir tu factura.');
    }
  }, [isManualUploadComplete]);

  useEffect(() => {
    if (!unit) return;
    const handleGetImg = async () => {
      try {
        const url = await getImg(unit.id);
        if (!url) return;
        setUrl(url);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching image', error);
      }
    };
    handleGetImg();
    setInvoiceInfo({
      number: (unit.invoiceInfo?.number
        ? unit.invoiceInfo.number
        : 0) as unknown as string, // TODO: that's messy typescript
      subTotal: unit.invoiceInfo?.subTotal ? unit.invoiceInfo.subTotal : 0,
    });
    setInvoiceDate({
      startDate: unit.invoiceInfo?.date ? new Date(unit.invoiceInfo.date) : null,
      endDate: unit.invoiceInfo?.date ? new Date(unit.invoiceInfo.date) : null
    });
  }, []);

  async function handleYes(): Promise<void> {
    if (!unit) return;

    if (isInvoice) {
      // Check if invoice info is complete
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

    if (unit?.id) {
      // Update invoice info
      const dateObject = new Date(invoiceDate?.startDate || Date.now());
      const awsDateTime = dateObject.toISOString();

      const info = {
        id: unit.id,
        invoiceInfo: {
          ...invoiceInfo,
          date: awsDateTime,
        },
      };
      try {
        await updateInvoiceInfo(info);
      } catch (error) {
        console.error('Error updating invoice info', error);
      }
    } else {
      // Handle the case when unit?.id is undefined
      console.error('unit id is undefined');
    }

    alert(
      isInvoice
        ? '¡La factura fue agregada con éxito! \n Vuelve al menú para poder realizar otras operaciones'
        : '¡El contrarecibo fue envíado con éxito! \n Vuelve al menu para poder realizar otras operaciones.',
    );
    // Page reload
    window.location.reload();
  }

  function handleNo(): void {
    if (!unit) return;
    if (!isInvoice) {
      setManualUpload(true);
    } else {
      alert('No es posible avanzar sin subir la factura.');
    }
  }

  return (
    <>
      <div>
        <div className="mx-auto max-w-[90%] text-xl font-bold text-white md:text-2xl lg:text-5xl">
          {name} - {unit && unit.id}
        </div>
        <div className="flex flex-row justify-center">
          <div
            id="rightContainer"
            className="flex w-full flex-col items-center justify-center rounded bg-neutral-600 p-4 text-center hover:bg-neutral-800 lg:w-1/2"
          >
            <div className="flex justify-center">
              {isLoading && (
                <div className="flex h-[150px] w-[200px] items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                </div>
              )}
              {url && (
                <Image
                  className="h-96 rounded-md"
                  src={url}
                  alt={'unit' + unit?.id + 'evidence'}
                  width={400}
                  height={400}
                />
              )}
            </div>
            <p className="mt-4 text-xl font-light text-white">
              {unit && unit.failureReport?.description}
            </p>
            {unit?.partReq && (
              <div className="mt-4 w-full overflow-x-auto">
                <table className="w-full border-collapse rounded-lg border border-gray-600">
                  <thead className="bg-neutral-700">
                    <tr>
                      <th className="border border-gray-600 px-4 py-2 text-left text-white">Descripción</th>
                      <th className="border border-gray-600 px-4 py-2 text-left text-white">Cantidad</th>
                      <th className="border border-gray-600 px-4 py-2 text-left text-white">Precio Unitario</th>
                      <th className="border border-gray-600 px-4 py-2 text-left text-white">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unit.partReq.partDescription?.map((desc, index) => (
                    <tr key={index} className="border-t border-gray-600">
                    <td className="border border-gray-600 px-4 py-2 text-white break-words w-1/4">{desc}</td>
                    <td className="border border-gray-600 px-4 py-2 text-white break-words w-1/4">
                    {unit.partReq?.quantity?.[index] || 0}
                    </td>
                    <td className="border border-gray-600 px-4 py-2 text-white break-words w-1/4">
                    ${unit.partReq?.unitaryPrice?.[index]?.toFixed(2) || '0.00'}
                    </td>
                    <td className="border border-gray-600 px-4 py-2 text-white break-words w-1/4">
                    ${((unit.partReq?.unitaryPrice?.[index] || 0) * (unit.partReq?.quantity?.[index] || 0)).toFixed(2)}
                    </td>
                    </tr>
                    ))}
                    <tr className="bg-neutral-700">
                      <td colSpan={3} className="border border-gray-600 px-4 py-2 text-right text-white font-bold">
                        Total:
                      </td>
                      <td className="border border-gray-600 px-4 py-2 text-white font-bold">
                        ${unit.partReq?.price?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div
            id="leftContainer"
            className="flex w-full flex-col items-center justify-center rounded text-center lg:w-1/2 lg:flex-row lg:items-center"
          >
            <div
              id="cardInfo"
              className="flex w-full flex-col items-center justify-center space-y-5 bg-neutral-600 p-4 hover:bg-neutral-800"
            >
              <div
                id="infoContainer"
                className="flex flex-col items-center justify-center space-y-2 md:flex-row md:space-x-5"
              >
                <p className="text-xl font-light">
                  Proveedor: {unit?.Provider?.name}
                </p>
              </div>
              {unit && !isInvoice && unit.invoiceImg && unit.counterRecieptImg ? (
                <>
                  <DownloadFile partID={unit?.id} field={Field.invoice} />
                  <DownloadFile partID={unit?.id} field={Field.counterReceiptImg} />
                </>
              ) : (
                unit &&
                !isInvoice &&
                unit.invoiceImg && (
                  <>
                    <DownloadFile partID={unit?.id} field={Field.invoice} />
                  </>
                )
              )}
              <div className="flex w-full flex-col space-y-4 rounded-md px-10 py-5">
                {isOrderAccepted === false ? (
                  <div className="flex flex-col items-center space-y-4">
                    <h2 className="text-2xl font-bold text-white">
                      ¿Aceptas el pedido para la parte {unit?.id}?
                    </h2>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setIsOrderAccepted(true)}
                        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={handleRejectOrder}
                        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-row items-center gap-5">
                      <p className="text-xl font-light">No. Factura</p>
                      <TextInput
                        intent={!isInvoice ? 'disabled' : 'regular'}
                        disabled={!isInvoice}
                        placeholder="No. Factura"
                        value={invoiceInfo.number}
                        onChange={handleSetInvoiceNumber}
                      />
                    </div>
                    <div className="flex flex-row items-center gap-5">
                      <p className="text-xl font-light">Subtotal</p>
                      <TextInput
                        intent={!isInvoice ? 'disabled' : 'regular'}
                        disabled={!isInvoice}
                        placeholder="Subtotal"
                        value={invoiceInfo.subTotal}
                        onChange={handleSetInvoiceSubtotal}
                      />
                    </div>
                    <div className="flex flex-row items-center gap-5">
                      <p className="text-xl font-light">Fecha</p>
                      {isInvoice ? (
                        <DatePicker
                          value={invoiceDate}
                          setValue={handleDateChange}
                          placeholder="Hello"
                          asSingle
                      />
                      ) : (
                        <TextInput
                          intent="disabled"
                          disabled
                          placeholder="Fecha"
                          value={invoiceDate.startDate?.toString().split('T')[0]}
                          onChange={() => {}}
                        />
                      )}
                    </div>
                  </>
                )}
                {manualUpload && !isManualUploadComplete ? (
                  <div className="mt-8 w-[50%] self-center text-center">
                    <h1 className="my-2 text-2xl font-bold text-white">
                      Sube la nueva factura
                    </h1>
                    <UploadImage
                      name={'invoiceImg'}
                      part={unit?.id as string}
                      isUploadComplete={isManualUploadComplete}
                      setIsUploadComplete={setIsManualUploadComplete}
                    />
                  </div>
                ) : (
                  unit?.status != null &&
                  unit.status <= 11 && (
                    <div className="flex w-full flex-col space-y-4 rounded-md px-10 py-5">
                      <button className="text-sm md:text-base lg:text-lg">
                        Sube tu {isInvoice ? 'factura' : 'recibo'}
                        {unit && (
                          <UploadImage
                            part={unit.id}
                            name={isInvoice ? 'invoiceImg' : 'counterRecieptImg'}
                            setIsUploadComplete={setIsUploadComplete}
                            isUploadComplete={isUploadComplete}
                          />
                        )}
                      </button>
                      <YesNo
                        title={
                          isInvoice
                            ? '¿Subiste tu factura?'
                            : '¿Quieres mandar el contrarecibo?'
                        }
                        handleNo={handleNo}
                        handleYes={handleYes}
                        newStatusYes={isInvoice ? 10 : 12}
                        newStatusNo={isInvoice ? 9 : 11}
                        partID={unit && unit.id}
                        inputText={false}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Card(cardP: CardProps): JSX.Element {
  const [unitName, setUnitName] = React.useState('');

  useEffect(() => {
    getUnitName(cardP.data, setUnitName);
  }, []);

  let content;
  //Type of card
  switch (cardP.type) {
    case 'unit':
      content = <UnitCard unit={cardP.data} name={unitName} />;
      break;
    case 'counter':
      content = <CounterCard counter={cardP.data} />;
      break;
    case 'failure':
      content = (
        <FailureCard
          failure={cardP.data}
          isAction={cardP.isAction}
          name={unitName}
          handleClick={cardP.handleClick}
        />
      );
      break;
    case 'admincard':
      content = (
        <AdminCard
          unit={cardP.data}
          isAction={cardP.isAction}
          name={unitName}
        />
      );
      break;
    case 'provider':
      if (!cardP.data) throw new Error('Missing data or handleUploadInvoice');
      content = (
        // Provider card isInvoice is true because it's an invoice upload (proveedor)
        <ProviderCard unit={cardP.data} name={unitName} isInvoice={true} />
      );
      break;
    case 'receipt':
      if (!cardP.data) throw new Error('Missing data');
      content = (
        // isInvoice is false because it's a counter receipt upload (contaduria)
        <ProviderCard unit={cardP.data} name={unitName} isInvoice={false} />
      );
      break;
    default:
      content = <></>;
      break;
  }
  const handleClick = cardP.handleBack;

  return (
    <CardBackground>
      <motion.div onClick={handleClick} className="hover:cursor-pointer">
        <IconContext.Provider value={{ size: '1em' }}>
          <AiOutlineClose className="right-5 top-5 rounded-md text-3xl hover:scale-105" />
        </IconContext.Provider>
      </motion.div>
      {content}
      <Semaforo process={cardP.data.status} type={'parte'} />
    </CardBackground>
  );
}
