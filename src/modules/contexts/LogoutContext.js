import { createContext, useContext, useRef } from 'react';

const LogoutContext = createContext(null);

export const LogoutProvider = ({ children }) => {
  const isLoggingOut = useRef(false);

  return <LogoutContext.Provider value={isLoggingOut}>{children}</LogoutContext.Provider>;
};

export const useLogoutFlag = () => {
  return useContext(LogoutContext);
};
