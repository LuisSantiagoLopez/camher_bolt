import { TableT } from '@/graphql';
import CardBackground from './CardBackground';
import { motion } from 'framer-motion';
import { IconContext } from 'react-icons';
import Semaforo from './Semaforo';
import {
  AiFillCalendar,
  AiOutlineClose,
  AiOutlineDownload,
} from 'react-icons/ai';
import { useRouter } from 'next/router';
import { handleTableId, updateTableStatus } from '@/helpers/helperFunTable';
import YesNo from '@/reusable/yesNo';
import { IoCheckmark, IoDocumentTextOutline } from 'react-icons/io5';
import { getTableBlob } from '@/helpers/createSheet';
import { useEffect, useState } from 'react';
import { DownloadFile } from './DownloadFile';
import { Field } from '@/helpers/s3';
import UploadImage from './AttachFile';

function TableCard({
  unit,
  isUpload = false,
  status,
  flow,
}: {
  unit: TableT;
  isUpload?: boolean;
  status: number;
  flow: string;
}) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [isParts, setIsParts] = useState<boolean>(false);
  const [uploadTable, setUploadTable] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!unit) return;
    const nameTemp = handleTableId(unit.id);
    if (nameTemp === undefined) return;
    setName(nameTemp);
  }, [unit]);

  useEffect(() => {
    async function updateTable() {
      if (!unit) return;
      setUploadTable(false);
    }
    if (isUploadComplete && uploadTable) updateTable();
  }, [isUploadComplete]);

  const handleYes = async () => {
    if (!unit) return;
    await updateTableStatus(isUpload ? 2 : 3, unit.id);
    alert(
      '¡El proceso fue completado con éxito! \n Vuelve al menú para poder realizar otras operaciones',
    );
    router.reload();
  };

  useEffect(() => {
    if (!unit) return;
    const val = unit?.Parts?.items?.filter((p) =>
      p?.status !== undefined ? p.status === 12 : false,
    );
    if (val) setIsParts(val?.length == 0);
  }, []);

  const handleNo = async () => {
    if (!unit) return;
    alert(isUpload ? 'Tabla cancelada' : 'No olvides subir la tabla al SAE');
    // if (!isUpload) await updateTableStatus(3, unit.id);
    // else await updateTableStatus(-1, unit.id);
  };

  const handleNoUpload = async () => {
    if (!unit) return;
    setUploadTable(true);
  };

  const handleDownloadTable = async () => {
    if (!unit) return;
    setIsLoading(true);
    await getTableBlob([unit.id]);
    setIsLoading(false);
  };

  return (
    <>
      <div
        id="leftContainer"
        className="flex flex-row justify-center text-center"
      >
        {/* text unit name*/}
        <div
          id="cardInfo"
          className="flex flex-col items-start justify-around space-y-5"
        >
          <div
            id="infoContainer"
            className="flex flex-row space-x-5 max-md:items-center"
          >
            <div className="text-5xl font-bold text-white">Tabla</div>
            {/* download button */}
            <button onClick={handleDownloadTable}>
              <IconContext.Provider value={{ size: '1.5em' }}>
                {!isLoading ? (
                  <AiOutlineDownload />
                ) : (
                  <div className="flex h-5 w-5 animate-spin flex-row items-center rounded-full border-b-2 border-t-2 border-white"></div>
                )}
              </IconContext.Provider>
            </button>
          </div>
          {/* text unit info */}

          <div className="flex w-full flex-col items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5 lg:flex-row">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <AiFillCalendar />
            </IconContext.Provider>
            <p className="text-xl font-light">
              {unit && unit.from.toString().split('T')[0]} -{' '}
              {unit && unit.to.toString().split('T')[0]}
            </p>
          </div>
          <div className="flex w-full flex-col items-center space-x-5 overflow-scroll rounded-md bg-neutral-600 px-10 py-5  md:flex-row">
            <div className="flex flex-col flex-wrap items-start font-light  lg:text-xl">
              {unit?.Parts?.items &&
                unit.Parts.items.map(
                  (p, id) =>
                    p?.status === 12 &&
                    p.invoiceImg &&
                    p.counterRecieptImg && (
                      <div className="flex flex-row">
                        <p
                          key={p?.id} // It's always good to have a key for mapped elements
                          className={`my-1 rounded-md p-1 font-light lg:text-xl ${
                            id % 2 === 0 ? 'bg-neutral-500' : 'bg-neutral-400'
                          }`}
                        >
                          {p?.id && handleTableId(p?.id)}
                        </p>
                        {p?.id && p.invoiceImg && (
                          <DownloadFile
                            partID={p?.id}
                            field={Field.invoice}
                            small
                          />
                        )}
                        {p?.id && p.counterRecieptImg && (
                          <DownloadFile
                            partID={p?.id}
                            field={Field.counterReceiptImg}
                            small
                          />
                        )}
                      </div>
                    ),
                )}
              {isParts && (
                <p className="text-xl font-light text-neutral-500">
                  No hay partes
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {status === 1 && flow === 'contador' && !uploadTable ? (
        <YesNo
          title={'¿Apruebas subir esta Tabla al SAE?'}
          handleNo={handleNoUpload}
          handleYes={handleYes}
          inputText={false}
        />
      ) : (
        status === 1 &&
        flow === 'contador' &&
        uploadTable && (
          <div className="mt-8 w-[50%] self-center text-center">
            <h1 className="my-2 text-2xl font-bold text-white">
              Subir Tabla Manualmente
            </h1>
            <UploadImage
              name={'table'}
              part={unit?.id as string}
              isUploadComplete={isUploadComplete}
              setIsUploadComplete={setIsUploadComplete}
              setStatus={updateTableStatus}
              isTable
            />
          </div>
        )
      )}

      {status === 1 && flow === 'contaduria' && (
        <div className="my-12 flex flex-col items-center justify-center text-center">
          <IconContext.Provider value={{ size: '3em' }}>
            <IoDocumentTextOutline />
          </IconContext.Provider>
          <p className="text-2xl font-bold text-white">
            Tabla en proceso de aprobación
          </p>
        </div>
      )}

      {status === 2 && flow === 'contador' && (
        <div className="my-12 flex flex-col items-center justify-center">
          <IconContext.Provider value={{ size: '3em' }}>
            <IoCheckmark />
          </IconContext.Provider>
          <p className="text-2xl font-bold text-white">Tabla aprobada</p>
        </div>
      )}
      {status === 2 && flow === 'contaduria' && (
        <YesNo
          title={'¿Ya subiste esta Tabla al SAE?'}
          handleNo={handleNo}
          handleYes={handleYes}
          inputText={false}
        />
      )}

      {status === 3 && (
        <div className="my-12 flex flex-col items-center justify-center">
          <IconContext.Provider value={{ size: '3em' }}>
            <IoCheckmark />
          </IconContext.Provider>
          <p className="text-2xl font-bold text-white">
            Esta tabla ya cumplió con todo el proceso
          </p>
        </div>
      )}
      <div
        id="cardFooter"
        className="mt-3 flex flex-row items-center justify-between text-sm"
      >
        {/* <p className="text-sm text-white">{unit && unit.reqDate}</p> */}
        <div
          id="cardID"
          className="flex flex-col justify-center self-end rounded-md bg-camhergreen px-2 text-black"
        >
          <p className="mx-auto">{name}</p>
        </div>
      </div>
    </>
  );
}

// define props for Card
interface TableCardProps {
  table: TableT;
  type: 'contadortabla' | 'contaduria';
  handleBack: any;
  status: number;
  flow: string;
}

export default function CardTable(tableP: TableCardProps) {
  let content;
  switch (tableP.type) {
    case 'contadortabla':
      content = (
        <TableCard
          unit={tableP.table}
          status={tableP.status}
          isUpload={true}
          flow={tableP.flow}
        />
      );
      break;
    case 'contaduria':
      content = (
        <TableCard
          unit={tableP.table}
          status={tableP.status}
          isUpload={false}
          flow={tableP.flow}
        />
      );
      break;
    default:
      content = <></>;
      break;
  }

  return (
    <CardBackground>
      <motion.div onClick={tableP.handleBack} className="hover:cursor-pointer">
        <IconContext.Provider value={{ size: '1em' }}>
          <AiOutlineClose className="right-5 top-5 rounded-md text-3xl hover:scale-105" />
        </IconContext.Provider>
      </motion.div>
      {content}
      {/* TODO: 1-3 ? */}
      {/* {tableP.table?.status && <Semaforo process={tableP?.table?.status} />}  */}
      <Semaforo process={tableP.status} type="tabla" />
    </CardBackground>
  );
}
