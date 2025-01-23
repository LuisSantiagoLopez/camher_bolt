import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { I18n } from 'aws-amplify';
import { translations } from '@aws-amplify/ui-react';
import { SelectedToolContextProvider } from '@/context/SelectedToolContext';
import { FlowContextProvider } from '@/context/FlowContext';

import awsExports from '../aws-exports';
import NavBar from '@/components/ui/Layout/NavBar';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

I18n.putVocabularies(translations);
I18n.setLanguage('es');

import { Amplify } from 'aws-amplify';
import Logo from '@/components/ui/Logo';

Amplify.configure(awsExports);

const components = {
  Header() {
    return (
      <div className="flex items-center justify-center p-4">
        <Logo size={400} />
      </div>
    );
  },
};
const formFields = {
  signIn: {
    username: {
      placeholder: 'Ingresa tu correo electrónico',
    },
    password: {
      placeholder: 'Ingresa tu contraseña',
    },
  },
  forceNewPassword: {
    password: {
      placeholder: 'Ingresa una contraseña',
    },
    confirm_password: {
      placeholder: 'Confirma tu contraseña',
    },
    name: {
      label: 'Nombre',
      placeholder: 'Ingresa tu nombre completo',
      order: 1,
    },
  },
  resetPassword: {
    username: {
      placeholder: 'Ingresa tu correo electrónico',
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      placeholder: 'Ingresa tu Código de Confirmación',
    },
    password: {
      placeholder: 'Ingresa tu nueva contraseña',
    },
    confirm_password: {
      placeholder: 'Confirma tu nueva contraseña',
    },
  },
};

I18n.putVocabulariesForLanguage('es', {
  'Reset Password': 'Restablecer contraseña',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator.Provider>
      <FlowContextProvider>
        <SelectedToolContextProvider>
          <Authenticator
            formFields={formFields}
            components={components}
          >
            <NavBar />
            <Component {...pageProps} />
          </Authenticator>
        </SelectedToolContextProvider>
      </FlowContextProvider>
    </Authenticator.Provider>
  );
}
