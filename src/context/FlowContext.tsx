// This document provides context on the user and flow to the root of the project, 
// the index.tsx file. However, the 

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { AmplifyUser } from '@aws-amplify/ui/dist/types/types/authenticator/user.d.ts';

interface User extends AmplifyUser {
  signInUserSession?: {
    idToken: {
      payload: {
        'cognito:groups': string[];
      };
    };
  };
}

type FlowContextType = {
  flow: string;
  setFlow: (flow: string) => void;
  name: string;
  email: string;
};

const FlowContext = createContext<FlowContextType>({
  flow: '',
  setFlow: () => {},
  name: '',
  email: '',
});

export const useFlowContext = () => {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlowContext must be used within a FlowContextProvider');
  }
  return context;
}; // Method to share the FlowContext object

export default FlowContext;

export const FlowContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [flow, setFlow] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { user }: { user: User } = useAuthenticator((context) => [
    context.user,
  ]);

  useEffect(() => {
    if (!user || !user.signInUserSession) {
      setFlow('');
      return;
    }

    const groups = user.signInUserSession.idToken.payload['cognito:groups'];
    if (!groups) {
      setFlow('');
      return;
    }

    if (user.attributes) {
      const name = user.attributes.name;
      const email = user.attributes.email;
      if (name) {
        const trimmedName = name.trim().split(' ')[0];
        setName(trimmedName);
      }
      if (email) {
        const trimmedEmail = email.trim().split(' ')[0];
        setEmail(trimmedEmail);
      }
    }

    const group = groups.find((g) =>
      [
        'taller',
        'admin',
        'contador',
        'contaduria',
        'operador',
        'proveedor',
      ].includes(g),
    );

    switch (group) {
      case 'taller':
        setFlow('taller');
        break;
      case 'admin':
        setFlow('admin');
        break;
      case 'contador':
        setFlow('contador');
        break;
      case 'contaduria':
        setFlow('contaduria');
        break;
      case 'operador':
        setFlow('operador');
        break;
      case 'proveedor':
        setFlow('proveedor');
        break;
      default:
        setFlow('');
    }
  }, [user]);
  return (
    <FlowContext.Provider
      value={{
        flow,
        setFlow,
        name,
        email,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};
