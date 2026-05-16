import React, { useContext, useEffect, useState } from 'react';

const GlobalSettingsContext = React.createContext<{ isMobile: boolean }>({ isMobile: false });

export const useGlobalSettings = () => {
  const context = useContext(GlobalSettingsContext);
  return context;
};

interface GlobalSettingsProviderProps {
  children: React.ReactNode;
}

export const GlobalSettingsProvider = ({ children }: GlobalSettingsProviderProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768 || window.location.hash.includes('/mobile'));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768 || window.location.hash.includes('/mobile'));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('hashchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('hashchange', handleResize);
    };
  }, []);

  return <GlobalSettingsContext.Provider value={{ isMobile }}>{children}</GlobalSettingsContext.Provider>;
};
