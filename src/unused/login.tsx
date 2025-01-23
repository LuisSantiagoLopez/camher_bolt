import TextInput from '@/components/ui/TextInput';
import SubmitButton from '#/Button';
import Head from 'next/head';

import { motion } from 'framer-motion';

export default function loginPage() {
  const handleClick = () => {
    window.location.href = '/';
  };
  return (
    <>
      <Head>
        <title>Entra a tu cuenta de Camher</title>
        <meta name="description" content="Camher" />
      </Head>

      <main>
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
          <h1 className="self-center text-4xl font-bold">Inicia sesión</h1>
          <TextInput placeholder="Introduce tu Usuario..." name="Usuario" />
          <TextInput
            placeholder="Introduce tu Contraseña..."
            name="Contraseña"
          />
          <a
            href="/forgotPassword"
            className=" text-right text-sm text-slate-500"
          >
            ¿Olvidaste tu contraseña?
          </a>
          <SubmitButton onClick={handleClick} intent={'regular'}>
            Enviar
          </SubmitButton>
          <br />
          <a href="/register" className="text-center text-amber-600">
            ¿No tienes una cuenta? <span className="underline">Regístrate</span>
          </a>
        </motion.div>
      </main>
    </>
  );
}
