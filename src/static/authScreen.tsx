import React, { useState } from 'react';
import { API } from 'aws-amplify';
import { createProvider } from '@/graphql/mutations';
import { useFlowContext } from '@/context/FlowContext';
import { AuthScreenProps } from '@/types/cardTypes';

const AuthScreen: React.FC<AuthScreenProps> = ({ updatePrevTools }) => { 
  const { name, email, flow } = useFlowContext();
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async () => {
    if (!name || !email) {
      setStatusMessage('No se encontraron credenciales válidas.');
      return;
    }

    setIsLoading(true);
    try {
      const input = {
        name,
        emails: [email],
      };

      // For now, we'll use createProvider since the other mutations aren't ready
      const response = await API.graphql({
        query: createProvider,
        variables: { input },
      });

      console.log('User created successfully:', response);
      setStatusMessage('Usuario registrado exitosamente.');
      
      // Return to action screen after successful registration
      setTimeout(() => updatePrevTools('action'), 2000);
      
    } catch (error) {
      console.error('Error creating user:', error);
      setStatusMessage(
        `Error al registrar: ${(error as any).errors?.[0]?.message || (error as any).message || 'Error desconocido'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Autenticación como {flow === 'admin' ? 'Administrador' : 'Contador'}
      </h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="mb-2"><strong>Nombre:</strong> {name || 'No disponible'}</p>
        <p><strong>Correo:</strong> {email || 'No disponible'}</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleCreateUser}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors
            ${isLoading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-camhergreen hover:bg-green-400'}`}
        >
          {isLoading 
            ? 'Registrando...' 
            : `Registrar ${flow === 'admin' ? 'Administrador' : 'Contador'}`}
        </button>

        {statusMessage && (
          <div className={`p-4 rounded-lg ${
            statusMessage.includes('Error') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {statusMessage}
          </div>
        )}

        <button
          onClick={() => updatePrevTools('action')}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Regresar
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;