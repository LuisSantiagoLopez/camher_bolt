import Head from 'next/head';
import TextInput from '#/TextInput';
import Button from '#/Button';
import { useState, useEffect } from 'react';
import { updateMechanicReview, queryPart, updateStatus } from '@/helpers/helperFunPart';

interface Props {
  partID?: string;
  handleYes: () => void;
  handleNo: () => void;
  title: string;
  description?: string;
  inputText: boolean;
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
  mechanicOn,
  partID,
  newStatusYes,
  newStatusNo,
}: Props) {
  const [mecanic, setMecanic] = useState('');

  // Load existing part if we have a partID
  useEffect(() => {
    async function loadExistingPart() {
      if (!partID) return;
      
      try {
        const part = await queryPart(partID);
        if (part?.mechanicReview?.mechanic) {
          setMecanic(part.mechanicReview.mechanic);
        }
      } catch (error) {
        console.error('Error loading part data:', error);
      }
    }
    loadExistingPart();
  }, [partID]);

  const handleYesClick = async () => {
    // If mechanicOn, update mechanic
    if (inputText && mechanicOn) {
      if (!mecanic.trim()) {
        alert('Please enter some text before proceeding.');
        return;
      }
      try {
        // Existing part => update
        if (partID) {
          await updateMechanicReview({
            id: partID,
            mechanicReview: { mechanic: mecanic },
          });
        }
      } catch (error) {
        console.error('Error updating part', error);
      }
      handleYes();
    } else if (newStatusYes && partID) {
      await updateStatus(newStatusYes, partID);
      handleYes();
    } else {
      handleYes();
    }
  };

  const handleNoClick = async () => {
    if (newStatusNo && partID) {
      await updateStatus(newStatusNo, partID);
    }
    handleNo();
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
            intent="long"
            placeholder="Escribe qué mecánico revisó la unidad"
            value={mecanic}
            onChange={(e) => setMecanic(e.target.value)}
          />
        )}
        {description && (
          <h2 className="my-5 self-center text-3xl">{description}</h2>
        )}
        <div className="flex flex-row items-center gap-10 text-center">
          <Button intent="green" onClick={handleYesClick}>
            SI
          </Button>
          <Button intent="red" onClick={handleNoClick}>
            NO
          </Button>
        </div>
      </div>
    </>
  );
}