import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import SubmitButton from '#/Button';
import TextInput from '@/components/ui/TextInput';
import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';

import { ProviderT } from '@/graphql';
import {
  queryProviderByEmail,
  setNewProviderEmails,
} from '@/helpers/helperFunProvider';

const ChangeEmailPage = ({ email }: { email: string }) => {
  const [inputCount, setInputCount] = useState<number>(0);
  const [provider, setProvider] = useState<ProviderT | null>(null);
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmails, setNewEmails] = useState<string[]>([]);

  const validateEmail = (email: string) => {
    const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return re.test(email.toLowerCase());
  };

  const renderNewEmailInputs = () => {
    return newEmails.map((newEmail, i) => (
      <div key={i} className="flex w-full flex-row items-center justify-center">
        <TextInput
          value={newEmail}
          onChange={(e) => handleChangeNewEmail(e, i)}
          placeholder="nuevoEmail@camher.com.mx"
        />
        <button onClick={() => handleRemoveNewEmail(i)} className="ml-2">
          <FaTrash />
        </button>
      </div>
    ));
  };

  const handleRemoveNewEmail = (i: number) => {
    const updatedEmails = [...newEmails];
    updatedEmails.splice(i, 1);
    setNewEmails(updatedEmails);
  };

  const handleChangeNewEmail = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    i: number,
  ) => {
    const updatedEmails = [...newEmails];
    updatedEmails[i] = event.target.value;
    setNewEmails(updatedEmails);
  };

  const handleNewMailClick = () => {
    if (!emails.concat(newEmails).every((email) => validateEmail(email))) {
      alert('Uno o más correos introducidos no son válidos.');
      return;
    }
    setNewEmails([...newEmails, '']);
    setInputCount((inputCount) => inputCount + 1);
  };

  const handleChangeExistingEmail = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    i: number,
  ) => {
    const updatedEmails = [...emails];
    updatedEmails[i] = event.target.value;
    setEmails(updatedEmails);
  };

  const handleRemoveExistingEmail = (i: number) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(i, 1);
    setEmails(updatedEmails);
  };

  const handleClick = async () => {
    // Validate e-mails here as well before actions like saving to db
    if (!emails.concat(newEmails).every((email) => validateEmail(email))) {
      alert('Uno o más correos introducidos no son válidos.');
      return; // exit early
    }
    const allEmails = [email, ...emails.slice(1), ...newEmails];

    if (!provider) {
      console.warn('No provider found');
      return;
    }
    await setNewProviderEmails(provider?.id, allEmails);
    alert('Correos actualizados');
  };

  useEffect(() => {
    const invalidEmails = emails.filter((email) => !validateEmail(email));
    if (invalidEmails.length === 0) return;
    alert(`Los siguientes correos no son válidos: ${invalidEmails.join(', ')}`);
  }, [emails, newEmails]);

  useEffect(() => {
    async function fetchProviders() {
      const provider_res = (await queryProviderByEmail(email)) as ProviderT;
      if (!provider_res) {
        console.warn('No provider found');
        return;
      }
      setProvider(provider_res);
      if (!provider_res.emails) return;
      const filteredEmails = provider_res.emails.filter(
        (email): email is string => Boolean(email),
      );
      setEmails(filteredEmails); //
    }
    fetchProviders();
  }, [email]);

  return (
    <>
      <Head>
        <title>Cambiar Correo</title>
        <meta name="description" content="Camher" />
      </Head>

      <main className="">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mx-auto flex flex-col justify-center space-y-8 bg-gray-100 p-8 shadow-md sm:h-full md:mt-10 md:w-[35%] md:rounded-md md:p-12"
        >
          <h1 className="self-center text-4xl font-bold">Modificar Correos</h1>
          <p className="text-black">
            Agregue correos adicionales para recibir notificaciones
          </p>

          <div className="flex w-full flex-col space-y-4">
            {/* Existing and new email fields */}
            <TextInput intent="disabled" key={0} value={email} disabled />
            {emails.slice(1).map((e, i) => (
              <div key={i + 1} className="flex items-center">
                <TextInput
                  value={e}
                  onChange={(event) => handleChangeExistingEmail(event, i + 1)}
                />
                <button
                  onClick={() => handleRemoveExistingEmail(i)}
                  className="ml-2"
                >
                  <button
                    onClick={() => handleRemoveExistingEmail(i)}
                    className="ml-2"
                  >
                    <FaTrash />
                  </button>
                </button>
              </div>
            ))}
            {renderNewEmailInputs()}
          </div>

          {/* Add new email button */}
          <div className="flex">
            <button
              onClick={handleNewMailClick}
              type="button"
              className="mr-2 items-center rounded-lg border border-orange-400 p-2.5  text-center text-sm font-medium text-orange-400 hover:bg-orange-400 hover:text-white focus:ring-2 focus:ring-orange-300"
            >
              <h1 className="mx-1">+</h1>
            </button>
          </div>

          {/* Submit button */}
          <SubmitButton onClick={handleClick} intent={'regular'}>
            Actualizar Correos
          </SubmitButton>
        </motion.div>
      </main>
    </>
  );
};

export default ChangeEmailPage;
