import Head from 'next/head';
import TextInput from '#/TextInput';
import Button from '#/Button';
import { useState, useEffect } from 'react';
import { updateMechanicReview } from '@/helpers/helperFunPart';
import { queryPart } from '@/helpers/helperFunPart';
import { updateStatus } from '@/helpers/helperFunPart';

interface Props {
  partID?: string;
  handleYes: () => void;
  handleNo: () => void;
  title: string;
  description?: string;
  inputText: boolean;
  // priceCalc?: boolean;
  mechanicOn?: boolean;
  newStatusYes?: number;
  newStatusNo?: number;
}

export default function YesNo({
  handleYes,
  handleNo,
  title,
  description,
  inputText,
  // priceCalc,
  mechanicOn,
  partID,
  newStatusYes,
  newStatusNo,
}: Props) {

  const [mecanic, setMecanic] = useState<string>('');

  useEffect(() => {
    const storedData = sessionStorage.getItem("MechanicReviewPart"+partID);
    if (storedData) {
      const data = JSON.parse(storedData);
      setMecanic(data.mechanicReview.mechanic);
    }
  }, []);

  const handleYesClick = async () => {
    // TODO:
    if (inputText && mechanicOn) {
      if (mecanic.trim() === '') {
        // If inputText is true and input value is empty or whitespace
        alert('Please enter some text before proceeding.');
      } else {
        const MechanicReviewPart = {
          id: partID ? partID : '',
          status: 2,
          mechanicReview: {
            mechanic: mecanic,
          },
        };

      sessionStorage.setItem("MechanicReviewPart"+partID, JSON.stringify(MechanicReviewPart));


        try {
          await updateMechanicReview(MechanicReviewPart);
        } catch (error) {
          console.error('Error updating part', error);
        }
        handleYes();
      }
    } else if (newStatusYes) {
      await updateStatus(newStatusYes, partID);
      handleYes();
    } else {
      handleYes();
    }
  };

  const handleNoClick = async () => {
    if (newStatusNo) {
      await updateStatus(newStatusNo, partID);
      handleNo();
    } else {
      handleNo();
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Camher" />
      </Head>
      <div className="mt-20 flex flex-col items-center justify-center gap-1">
        <h1 className="mb-5 self-center text-5xl">{title}</h1>
        {inputText && (
          <TextInput
            intent={'long'}
            placeholder="Escribe que mecánico reviso la unidad"
            value={mecanic}
            onChange={(e) => setMecanic(e.target.value)}
          />
        )}
        {description && (
          <h2 className="my-5 self-center text-3xl">{description}</h2>
        )}
        <div className="flex flex-row items-center gap-10 text-center">
          <Button intent={'green'} onClick={handleYesClick}>
            SI
          </Button>
          <Button intent={'red'} onClick={handleNoClick}>
            NO
          </Button>
        </div>
      </div>
    </>
  );
}
