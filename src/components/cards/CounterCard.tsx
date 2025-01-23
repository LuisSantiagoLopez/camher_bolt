import React from 'react';
import { IconContext } from 'react-icons';
import { AiFillExclamationCircle, AiOutlineUnorderedList, AiFillQuestionCircle } from 'react-icons/ai';
import { IoMdPricetag } from 'react-icons/io';
import { UnitT as Unit } from '@/graphql';

interface CounterCardProps {
  counter: Unit;
}

export default function CounterCard({ counter }: CounterCardProps) {
  return (
    <>
      <div id="leftContainer" className="flex flex-row justify-center text-center">
        <div id="cardInfo" className="ml-16 flex flex-col items-start justify-around">
          <div id="infoContainer" className="flex flex-row space-x-5">
            <div className="text-5xl font-bold text-white">
              TABLA {counter && counter.id}
            </div>
            <IconContext.Provider value={{ color: 'red', size: '2.5em' }}>
              <AiFillExclamationCircle />
            </IconContext.Provider>
          </div>
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
              <IoMdPricetag />
            </IconContext.Provider>
          </div>
        </div>
      </div>
      <div id="cardFooter" className="mt-3 flex flex-row items-center justify-between text-sm">
        <div id="cardID" className="flex flex-col justify-center self-end rounded-md bg-camhergreen px-2 text-black">
          <p className="mx-auto">{counter && counter.id}</p>
        </div>
      </div>
    </>
  );
}