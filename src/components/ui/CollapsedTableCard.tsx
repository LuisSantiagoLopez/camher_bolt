import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Table } from '@/types/database';

type Props = {
  handleClick: (unit: Table) => void;
  isActive?: boolean;
  table: Table;
  key: string;
};

export default function ({ handleClick, table, isActive }: Props) {
  const handleCardClick = () => {
    handleClick(table);
  };

  const [shortId, setShortId] = React.useState('');

  useEffect(() => {
    if (!table) return;
    const shortid1 = table.id.split('-')[0];
    const shortid2 = table.id.split('-')[4];
    setShortId(shortid1 + '-' + shortid2);
  }, []);

  let statusColorWrapper = '';
  if (!table) return null;
  switch (table.status) {
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
      className={`mx-auto min-w-[33%] border-[4px] bg-black p-8 md:min-w-[25%] lg:min-w-[20%] border-${statusColorWrapper} mx-4 my-2 rounded-3xl md:mx-6 lg:mx-12`}
    >
      <div
        id="mainContainer"
        className="flex flex-col items-center space-y-4 md:flex-row md:space-x-10 md:space-y-0"
      >
        <div id="imgContainer" className="relative w-full md:w-auto"></div>
        <div
          id="leftContainer"
          className="flex w-full flex-col justify-center md:w-[80%]"
        >
          {/* <span className="mb-4 text-lg font-bold text-white md:text-2xl lg:text-5xl">
            {unitName}
          </span> */}
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
          {/* image */}
          <div id="imgContainer" className="w-[20%]"></div>
        </div>
      </div>
    </motion.div>
  );
}
