// src/context/FlowContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
// Instead of importing from a missing SessionContext, import useSession from our utils.
import { useSession } from '@/utils/supabase/useSession';
import { useSupabaseClient } from '@/utils/supabase/useSupabaseClient';

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
  if (!context) {
    throw new Error('useFlowContext must be used within a FlowContextProvider');
  }
  return context;
};

export const FlowContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [flow, setFlow] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Use our custom useSession hook
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const getUserData = async () => {
      // If no session exists, clear flow.
      if (!session?.user) {
        setFlow('');
        return;
      }
      try {
        // Retrieve the user's role from the 'user_roles' table.
        const { data: userRoles, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
  
        if (roleError) {
          console.error('Error fetching user role:', roleError);
          setFlow('default');
        } else if (!userRoles || userRoles.length === 0) {
          console.log('No role found for user, setting default');
          setFlow('default');
        } else {
          const role = userRoles[0].role;
          // Set flow based on role.
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
  
        // If user metadata exists, set name.
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
    <FlowContext.Provider value={{ flow, setFlow, name, email }}>
      {children}
    </FlowContext.Provider>
  );
};

export default FlowContext;
