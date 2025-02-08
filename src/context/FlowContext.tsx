import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

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
};

export default FlowContext;

export const FlowContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [flow, setFlow] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const getUserData = async () => {
      if (!session?.user) {
        setFlow('');
        return;
      }

      try {
        // Get user's role from user_roles view
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError) throw roleError;

        // Set flow based on role
        const role = userRole?.role;
        switch (role) {
          case 'taller':
          case 'admin':
          case 'contador':
          case 'contaduria':
          case 'operador':
          case 'proveedor':
            setFlow(role);
            break;
          default:
            setFlow('');
        }

        // Set user info
        if (session.user.user_metadata) {
          const { name: userName } = session.user.user_metadata;
          if (userName) {
            const trimmedName = userName.trim().split(' ')[0];
            setName(trimmedName);
          }
        }

        setEmail(session.user.email || '');

      } catch (error) {
        console.error('Error fetching user data:', error);
        setFlow('');
      }
    };

    getUserData();
  }, [session, supabase]);

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