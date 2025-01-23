import React, { useState } from 'react';
import Dropdown from '#/Dropdown';
import Input from '#/TextInput';
import Head from 'next/head';
import Button from '#/Button';
import { useFlowContext } from '@/context/FlowContext';

export default function DefaultFlow() {
  const { email } = useFlowContext();
  const [role, setRole] = useState('');

  // Function to handle the change in the dropdown
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  // Function to handle the submit button
  const handleSend = async () => {
    try {
      const res = await fetch('api/default', {
        method: 'POST',
        body: JSON.stringify({
          role: role,
          email: email,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      alert('Se ha enviado tu solicitud');
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error al enviar tu solicitud');
    }
  };

  return (
    <>
      <Head>
        <title>Bienvenido</title>
        <meta name="description" content="Camher" />
      </Head>
      <div className="flex w-full flex-col items-center justify-center space-y-8">
        <h1 className="self-center text-4xl font-bold lg:mt-20 lg:text-5xl">
          Bienvenido
        </h1>
        <h2 className="self-center text-4xl">No tiene acceso</h2>
        <h2 className="self-center">
          Indica tu rol y contactaremos a tu administrador para que apruebe tu
          solicitud.
        </h2>
        <Dropdown onChange={handleRoleChange} value={role}>
          <option value="admin">Administrador</option>
          <option value="contador">Contador</option>
          <option value="contaduria">Contaduría</option>
          <option value="taller">Taller</option>
          <option value="operador">Operador</option>
          <option value="otro">Otro</option>
        </Dropdown>
        {role === 'otro' && <Input name="Otro" placeholder="Escribe tu rol" />}
        <Button onClick={handleSend} intent={'green'}>
          Enviar
        </Button>
      </div>
    </>
  );
}
