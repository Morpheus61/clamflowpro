import React, { createContext, useContext, useState } from 'react';

interface LotContextType {
  activeLotNumber: string | null;
  setActiveLotNumber: (lotNumber: string | null) => void;
}

const LotContext = createContext<LotContextType | null>(null);

export function LotProvider({ children }: { children: React.ReactNode }) {
  const [activeLotNumber, setActiveLotNumber] = useState<string | null>(null);

  return (
    <LotContext.Provider value={{ activeLotNumber, setActiveLotNumber }}>
      {children}
    </LotContext.Provider>
  );
}

export function useLotContext() {
  const context = useContext(LotContext);
  if (!context) {
    throw new Error('useLotContext must be used within a LotProvider');
  }
  return context;
}