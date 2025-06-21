// context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppContextType = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  secureMode: boolean;
  setSecureMode: (enabled: boolean) => void;
  screenshotCount: number;
  setScreenshotCount: React.Dispatch<React.SetStateAction<number>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // default: light
  const [secureMode, setSecureMode] = useState(true); // default: true
  //const [screenshotCount, setScreenshotCount] = useState<number>(0); // <- typed number

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        secureMode,
        setSecureMode,
        screenshotCount,
        setScreenshotCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
};
