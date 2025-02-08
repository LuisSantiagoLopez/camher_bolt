import { createContext, useContext, useState } from 'react';

type SelectedToolContextType = {
  pastTools: string[];
  setPastTools: (tools: string[]) => void;
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
};

const SelectedToolContext = createContext<SelectedToolContextType>(
  {
    pastTools: new Array<string>(),
    setPastTools: () => {},
    selectedTool: '',
    setSelectedTool: () => {},
  }!,
);

export const useSelectedToolContext = () => {
  const context = useContext(SelectedToolContext);
  if (context === undefined) {
    throw new Error(
      'useSelectedToolContext must be used within a SelectedToolContextProvider',
    );
  }
  return context;
};

export default SelectedToolContext;

export const SelectedToolContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pastTools, setPastTools] = useState(['action']);
  const [selectedTool, setSelectedTool] = useState('action');

  return (
    <SelectedToolContext.Provider
      value={{
        pastTools,
        setPastTools,
        selectedTool,
        setSelectedTool,
      }}
    >
      {children}
    </SelectedToolContext.Provider>
  );
};
