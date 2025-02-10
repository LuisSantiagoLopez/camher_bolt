import { useState, useEffect } from 'react';
import Head from 'next/head';
import { AiFillCar } from 'react-icons/ai';
import { IconContext } from 'react-icons';
import TextInput from '#/TextInput';
import Button from '#/Button';
import { createNewUnit, queryAllUnits } from '@/helpers/helperFunUnit';
import { Unit } from '@/types/database';

interface UnitCreationProps {
  handleButton1: () => void;
}

export default function UnitCreation({ handleButton1 }: UnitCreationProps) {
  const [nombre, setNombre] = useState('');
  const [allUnits, setAllUnits] = useState<Unit[]>([]);

  useEffect(() => {
    getUnits();
  }, []);

  const getUnits = async () => {
    const units = await queryAllUnits();
    if (!units) return;
    setAllUnits(units);
  };

  const handleButtonClick = async () => {
    if (nombre !== '') {
      await createNewUnit(nombre);
      handleButton1();
    } else {
      alert('Ingrese un nombre para la unidad');
    }
  };

  return (
    <div>
      <Head>
        <title>Crear Unidad</title>
        <meta name="description" content="Camher" />
      </Head>

      <div className="mt-20 flex flex-col items-center justify-center gap-10">
        <h1 className="self-center text-5xl">Nueva Unidad</h1>
        <h2 className="text-2xl self-center">
        Registra tus unidades (camiones)
        </h2>
        <TextInput
          intent="regular"
          placeholder="Código de la unidad"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <Button intent="green" onClick={handleButtonClick}>
          <div className="flex justify-center">
            {'  '}Dar de alta Unidad{'  '}
          </div>
        </Button>
        <p className=" text-xl font-light">Unidades actuales</p>
        <div className="mb-10 flex w-[75%] flex-wrap justify-around gap-5">
          {allUnits.map((unit) => (
            <div
              key={unit?.id}
              className="mx-5 flex rounded-md bg-camherlightyellow px-2 py-2 shadow-md"
            >
              <p className="mr-2">{unit?.name}</p>
              <IconContext.Provider value={{ size: '1.5em' }}>
                <AiFillCar />
              </IconContext.Provider>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
