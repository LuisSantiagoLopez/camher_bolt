import React from 'react';
import Head from 'next/head';
import TextInput from '@/components/ui/TextInput';
import Dropdown from '#/Dropdown';
import SubmitButton from '#/Button';

import { motion } from 'framer-motion';

const RegisterPage = () => {
  const handleClick = () => {
    window.location.href = '/';
  };
  return (
    <>
      <Head>
        <title>Crea cuenta de Camher</title>
        <meta name="description" content="Camher" />
      </Head>

      <main className="">
        <motion.div
          initial={{
            opacity: 0,
            // drop in from the top
            y: -100,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 1 }}
          className="mx-auto flex flex-col space-y-8 bg-gray-100 p-8 shadow-md sm:h-full md:mt-10 md:w-[35%] md:rounded-md md:p-12"
        >
          <h1 className="self-center text-4xl font-bold">Regístrate</h1>
          <TextInput placeholder="YourEmail@camher.com" name="Usuario" />
          <TextInput
            type="password"
            placeholder="Introdue tu Contraseña..."
            name="Contraseña"
            className="password-input"
          />
          <TextInput
            type="password"
            placeholder="Confirme su Contraseña..."
            name="Confirmar Contraseña"
            className="password-input"
          />
          {/* <h1 className="p-0">Ingrese su Rol</h1> */}
          <Dropdown name="Rol">
            <option value="1">Selecciona tu rol...</option>
            <option value="2">Operador</option>
            <option value="3">Proveedor</option>
            <option value="4">Conductor</option>
            <option value="5">Tabla</option>
            <option value="6">Admin</option>
            <option value="7">Taller</option>
          </Dropdown>
          <SubmitButton onClick={handleClick} intent={'regular'}>
            Crear Cuenta
          </SubmitButton>
        </motion.div>
      </main>

      <style jsx>{`
        .password-input {
          font-family: Verdana;
          letter-spacing: 0.125em;
        }
      `}</style>
    </>
  );
};

export default RegisterPage;
