import { supabase } from '../lib/supabase';

// Error handling wrapper
const callEmailFunction = async (payload: {
  type: 'new_request' | 'parts_verified';
  providerEmail: string;
  providerName: string;
  requestId: string;
  requestDetails?: string;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('resend', {
      body: payload
    });

    if (error) {
      console.error('Error al enviar email:', error);
      return { 
        success: false, 
        error: 'No se pudo enviar la notificación por correo. El sistema continuará funcionando normalmente.'
      };
    }

    return data;
  } catch (error) {
    console.error('Error al llamar función de email:', error);
    return { 
      success: false, 
      error: 'Error de conexión al servicio de correo. El sistema continuará funcionando normalmente.'
    };
  }
};

export const sendProviderNewRequestEmail = async (
  providerEmail: string,
  providerName: string,
  requestId: string,
  requestDetails: string
) => {
  const result = await callEmailFunction({
    type: 'new_request',
    providerEmail,
    providerName,
    requestId,
    requestDetails
  });

  if (!result.success) {
    console.error('Error al enviar email de nueva solicitud:', result.error);
  }

  return result;
};

export const sendProviderPartsVerifiedEmail = async (
  providerEmail: string,
  providerName: string,
  requestId: string
) => {
  const result = await callEmailFunction({
    type: 'parts_verified',
    providerEmail,
    providerName,
    requestId
  });

  if (!result.success) {
    console.error('Error al enviar email de verificación:', result.error);
  }

  return result;
};