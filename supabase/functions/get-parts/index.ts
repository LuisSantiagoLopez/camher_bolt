// src/context/FlowContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
// Import our custom hooks for session and client.
import { useSession } from '@/utils/supabase/useSession';
import { useSupabaseClient } from '@/utils/supabase/useSupabaseClient';

// Define the shape of our FlowContext.
type FlowContextType = {
  flow: string;
  setFlow: (flow: string) => void;
  name: string;
  email: string;
};

// Create the FlowContext with default values.
const FlowContext = createContext<FlowContextType>({
  flow: '',
  setFlow: () => {},
  name: '',
  email: '',
});

/**
 * Custom hook to access FlowContext.
 * Throws an error if used outside a FlowContextProvider.
 */
export const useFlowContext = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlowContext must be used within a FlowContextProvider');
  }
  return context;
};

/**
 * FlowContextProvider wraps child components and provides:
 * - The current "flow" (role) based on the authenticated user's role from the database.
 * - The user's first name (extracted from user_metadata).
 * - The user's email.
 *
 * It uses our custom useSession hook to retrieve the current session and
 * the useSupabaseClient hook to run a query against the 'user_roles' table.
 */
export const FlowContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [flow, setFlow] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  // Retrieve the current session using our custom hook.
  const session = useSession();
  // Get the Supabase client instance.
  const supabase = useSupabaseClient();

  useEffect(() => {
    // Define an async function to fetch user role and metadata.
    const getUserData = async () => {
      // If no session exists, clear the flow.
      if (!session?.user) {
        setFlow('');
        return;
      }
      
      try {
        // Query the 'user_roles' table in your public schema for the current user's role.
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
          // Set the flow based on the retrieved role.
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
  
        // Extract the user's name from the user_metadata if available.
        if (session.user.user_metadata) {
          const { name: userName } = session.user.user_metadata;
          if (userName) {
            // Use the first part of the name as a display name.
            const trimmedName = userName.trim().split(' ')[0];
            setName(trimmedName);
          }
        }
  
        // Set the email from the session.
        setEmail(session.user.email || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setFlow('default');
      }
    };
  
    // Call the function to fetch and set user data.
    getUserData();
  }, [session, supabase]);

  return (
    <FlowContext.Provider value={{ flow, setFlow, name, email }}>
      {children}
    </FlowContext.Provider>
  );
};

export default FlowContext;
