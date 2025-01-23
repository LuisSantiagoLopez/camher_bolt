import Button from '#/Button';
import Head from 'next/head';
import { ButtonProps } from '@/types/buttonTypes';
import React from 'react';

interface ActionScreenProps extends ButtonProps {
  user: string;
  description: string;
  button1Text: string;
  button2Text?: string; // Optional prop (when only one button is needed)
  button3Text?: string; // Optional prop (when only one button is needed)
  button4Text?: string; // Optional prop (when only one button is needed)
}

export default function actionScreen({
  user,
  description,
  button1Text,
  button2Text,
  button3Text,
  button4Text,
  handleButton1,
  handleButton2,
  handleButton3,
  handleButton4,
}: ActionScreenProps) {
  return (
    <>
      <Head>
        <title>Bienvenido</title>
        <meta name="description" content="Camher" />
      </Head>
      <div className="flex w-full flex-col items-center justify-center space-y-8">
        <h1 className="self-center text-4xl font-bold lg:mt-20 lg:text-5xl">
          Bienvenido, {user}
        </h1>
        <h2 className="self-center text-4xl">¿Qué quieres hacer?</h2>
        <h2 className="self-center text-2xl whitespace-normal">
          {description.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
        </h2>

        <Button intent={'title'} onClick={handleButton1}>
          {button1Text}
        </Button>
        {/* Only render if button2Text is defined */}
        {button2Text && (
          <Button intent={'title'} onClick={handleButton2}>
            {button2Text}
          </Button>
        )}{' '}
        {button3Text && (
          <Button intent={'title'} onClick={handleButton3}>
            {button3Text}
          </Button>
        )}{' '}
        {button4Text && (
          <Button intent={'title'} onClick={handleButton4}>
            {button4Text}
          </Button>
        )}
      </div>
    </>
  );
}
