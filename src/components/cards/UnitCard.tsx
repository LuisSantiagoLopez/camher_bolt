import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { IconContext } from 'react-icons';
import { AiOutlineDownload } from 'react-icons/ai';
import { PartT as Part } from '@/graphql';
import { getPartTableBlob } from '@/helpers/createSheet';
import { fetchFileFromS3 } from '@/helpers/s3';

interface UnitCardProps {
  unit: Part;
  name?: string;
}

export default function UnitCard({ unit, name }: UnitCardProps) {
  const [url, setUrl] = useState<string>('');
  const [shortId, setShortId] = useState<string>('');

  useEffect(() => {
    if (!unit) return;
    const [shortid1, , , , shortid2] = unit.id.split('-');
    setShortId(`${shortid1}-${shortid2}`);
    getImg();
  }, [unit]);

  async function getImg() {
    try {
      if (!unit?.id) return;
      const { blob } = await fetchFileFromS3(unit.id, 'partApprovalImg');
      if (!blob) return;
      const url = window.URL.createObjectURL(blob);
      setUrl(url);
    } catch (error) {
      console.error('Error fetching image', error);
    }
  }

  const downloadFile = () => {
    if (!unit) return;
    getPartTableBlob([unit.id]);
  };

  return (
    <>
      <div id="leftContainer" className="flex flex-row justify-center text-center">
        {url && (
          <Image
            src={url}
            alt={`unit${shortId}evidence`}
            width={400}
            height={400}
            className="m-2 h-96 rounded-md"
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
              {unit?.failureReport?.description}
            </p>
          </div>
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <p className="text-xl font-light">
              {unit?.partReq?.partDescription}
            </p>
          </div>
          <div className="flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <p className="text-xl font-light">
              {unit?.partReq?.price} MXN
            </p>
          </div>
        </div>
      </div>
      <div id="cardFooter" className="mt-3 flex flex-row items-center justify-between text-sm">
        <p className="text-sm text-white">{unit?.reqDate}</p>
        <div id="cardID" className="flex flex-col justify-center self-end rounded-md bg-camhergreen px-2 text-black">
          <p className="mx-auto">{unit?.id}</p>
        </div>
      </div>
    </>
  );
}