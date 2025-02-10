// src/context/SessionContext.tsx
import React, { createContext, useContext } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useSession } from '@/utils/supabase/useSession';

type SessionContextType = {
  session: Session | null;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionContextProvider');
  }
  return context;
};

export const SessionContextProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
};
