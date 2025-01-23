import React, { useEffect } from 'react';
import Image from 'next/image';
import { IconContext } from 'react-icons';
import { AiOutlineDownload } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { PartT as Part } from '@/graphql';
import { getPartTableBlob } from '@/helpers/createSheet';
import { sendApprovedEmail, updateStatus } from '@/helpers/helperFunPart';
import YesNo from '@/reusable/yesNo';
import { fetchFileFromS3 } from '@/helpers/s3';

interface AdminCardProps {
  unit: Part;
  isAction?: boolean;
  name?: string;
}

export default function AdminCard({ unit, isAction, name }: AdminCardProps) {
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

  const downloadFile = () => {
    if (!unit) return;
    getPartTableBlob([unit.id]);
  };

  useEffect(() => {
    if (!unit) return;
    const shortid1 = unit.id.split('-')[0];
    const shortid2 = unit.id.split('-')[4];
    setShortId(shortid1 + '-' + shortid2);
    getImg();
  }, []);

  async function getImg() {
    try {
      if (!unit?.id) return;
      const { blob } = await fetchFileFromS3(unit?.id, 'partApproval');
      if (!blob) return;
      const url = window.URL.createObjectURL(blob);
      if (!url) return;
      setUrl(url);
    } catch (error) {
      console.error('Error fetching image', error);
    }
  }

  return (
    <>
      <div id="leftContainer" className="flex flex-row justify-center text-center">
        {url && (
          <Image
            className="m-2 h-96 rounded-md"
            src={url}
            alt={'unit' + shortId + 'evidence'}
            width={400}
            height={400}
          />
        )}
        <div id="cardInfo" className="ml-16 flex flex-col items-start justify-around">
          <div id="infoContainer" className="flex flex-row space-x-5">
            <div className="text-5xl font-bold text-white">UNIDAD {name}</div>
            <button onClick={downloadFile}>
              <IconContext.Provider value={{ size: '1.5em' }}>
                <AiOutlineDownload />
              </IconContext.Provider>
            </button>
          </div>
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <p className="text-xl font-light">
              {unit && unit.failureReport?.description}
            </p>
          </div>
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <p className="text-xl font-light">
              {unit && unit.partReq?.partDescription}
            </p>
          </div>
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <p className="text-xl font-light">
              {unit && unit.partReq?.price} MXN
            </p>
          </div>
        </div>
      </div>
      {isAction && (
        <YesNo
          title="¿Apruebas continuar este proceso?"
          handleNo={handleClick2}
          handleYes={handleClick1}
          inputText={false}
        />
      )}
      <div id="cardFooter" className="mt-3 flex flex-row items-center justify-between text-sm">
        <p className="text-sm text-white">{unit && unit.reqDate}</p>
        <div id="cardID" className="flex flex-col justify-center self-end rounded-md bg-camhergreen px-2 text-black">
          <p className="mx-auto">{unit && unit.id}</p>
        </div>
      </div>
    </>
  );
}