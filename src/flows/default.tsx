import React, { useState } from 'react';
import Dropdown from '#/Dropdown';
import Input from '#/TextInput';
import Head from 'next/head';
import Button from '#/Button';
import { useFlowContext } from '@/context/FlowContext';

export default function DefaultFlow() {
  const { email } = useFlowContext();
  const [role, setRole] = useState('');
  const [otherRole, setOtherRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Function to handle the change in the dropdown
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
    setError(null);
  };

  // Function to handle the submit button
  const handleSend = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const finalRole = role === 'otro' ? otherRole : role;

      if (!finalRole) {
        setError('Por favor seleccione un rol');
        return;
      }

      const res = await fetch('/api/default', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: finalRole,
          email: email,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al enviar la solicitud');
      }

      setSuccess(true);
    } catch (err) {
      console.error('Error sending request:', err);
      setError(err instanceof Error ? err.message : 'Error al enviar la solicitud');
    } finally {
      setIsLoading(false);
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
        <h2 className="self-center text-center max-w-2xl">
          Indica tu rol y contactaremos a tu administrador para que apruebe tu
          solicitud.
        </h2>
        
        <div className="w-full max-w-md">
          <Dropdown 
            onChange={handleRoleChange} 
            value={role}
            className="w-full"
          >
            <option value="">Selecciona un rol...</option>
            <option value="admin">Administrador</option>
            <option value="contador">Contador</option>
            <option value="contaduria">Contaduría</option>
            <option value="taller">Taller</option>
            <option value="operador">Operador</option>
            <option value="otro">Otro</option>
          </Dropdown>

          {role === 'otro' && (
            <div className="mt-4">
              <Input 
                name="Otro" 
                placeholder="Escribe tu rol" 
                value={otherRole}
                onChange={(e) => setOtherRole(e.target.value)}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-600 bg-red-100 p-4 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-600 bg-green-100 p-4 rounded-md">
            Se ha enviado tu solicitud correctamente. Te contactaremos pronto.
          </div>
        )}

        <Button 
          onClick={handleSend} 
          intent="green"
          disabled={isLoading}
          className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </>
  );
}