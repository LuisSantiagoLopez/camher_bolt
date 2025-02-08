import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PartT as Part } from '@/graphql';
import { getUnitName } from '@/helpers/helperFunPart';

import { fetchFileFromS3 } from '@/helpers/s3';

type Props = {
  handleClick: (unit: Part) => void;
  isActive?: boolean;
  part: Part;
  key: string;
};

export default function ({ handleClick, part, isActive }: Props) {
  useEffect(() => {
    getUnitName(part, setUnitName);
  }, []);

  const handleCardClick = () => {
    handleClick(part);
  };

  const [unitName, setUnitName] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [shortId, setShortId] = React.useState('');

  // Setup for image loading
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (!part) return;
    getImg();
    const shortid1 = part.id.split('-')[0];
    const shortid2 = part.id.split('-')[4];
    setShortId(shortid1 + '-' + shortid2);
  }, []);

  async function getImg() {
    try {
      if (!part?.id) return;
      const { blob } = await fetchFileFromS3(part?.id, 'partApprovalImg');
      if (!blob) return;
      const url = window.URL.createObjectURL(blob);
      if (!url) return;
      setUrl(url);
    } catch (error) {
      console.error('Error fetching image', error);
    } finally {
      setIsLoading(false);
    }
  }

  let statusColorWrapper = '';
  if (!part) return null;
  switch (part.status) {
    case 1:
      statusColorWrapper = 'camhergreen';
      break;
    case 2:
      statusColorWrapper = 'blue-200';
      break;
    case 3:
      statusColorWrapper = 'red-200';
      break;
    default:
      break;
  }

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeInOut' },
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      id="card"
      className={`mx-auto max-w-[50%] border-[4px] bg-black p-8 md:min-w-[25%] lg:min-w-[20%] border-${statusColorWrapper} my-2 rounded-3xl md:mx-6 `}
    >
      <div
        id="mainContainer"
        className="flex flex-col items-center space-y-4 md:flex-row md:space-x-10 md:space-y-0"
      >
        <div id="imgContainer" className="relative w-full md:w-auto">
          {isLoading && (
            <div className="flex h-[150px] w-[200px] items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-white">
                .
              </div>
            </div>
          )}
          {part && !isLoading && url && (
            <Image
              className="rounded-2xl"
              src={url}
              alt={'data' + part.id + 'image'}
              width={200}
              height={150}
            />
          )}
        </div>
        <div
          id="leftContainer"
          className="flex w-full flex-col justify-center md:w-[80%]"
        >
          <span className="mb-4 text-lg font-bold text-white md:text-2xl lg:text-5xl">
            Unidad {unitName}
          </span>
          <span className="mb-4 overflow-ellipsis text-lg font-light text-gray-300 md:text-lg lg:text-lg">
            {part?.partReq?.partDescription}
          </span>
          <motion.div
            className={`mb-6 p-4 text-sm text-white hover:cursor-pointer hover:text-black md:text-base lg:text-lg hover:bg-${statusColorWrapper} mt-4 w-full rounded-md bg-neutral-600 text-center md:w-[40%]`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={handleCardClick}
          >
            <p className="font-bold">{isActive ? 'REVISAR' : 'VER MAS'}</p>
          </motion.div>
          <div
            id="cardID"
            className="flex flex-col justify-center self-end rounded-md bg-camhergreen px-3"
          >
            <p className="mx-auto text-black">{shortId}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
