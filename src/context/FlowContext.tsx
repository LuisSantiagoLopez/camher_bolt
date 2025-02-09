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
        // First try to get the user's role
        const { data: userRoles, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          setFlow('default');
        } else if (!userRoles || userRoles.length === 0) {
          // No role found, set to default
          console.log('No role found for user, setting default');
          setFlow('default');
        } else {
          // Set flow based on role
          const role = userRoles[0].role;
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
              setFlow('default');
          }
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
        setFlow('default');
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