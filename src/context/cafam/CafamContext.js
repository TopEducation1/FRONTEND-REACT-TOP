// contexts/CafamContext.js
import { createContext, useContext } from 'react';

const CafamContext = createContext({
  onTagSelect: () => {} 
});

export const useCafam = () => useContext(CafamContext);

export const CafamProvider = ({ children, onTagSelect }) => {
  return (
    <CafamContext.Provider value={{ onTagSelect }}>
      {children}
    </CafamContext.Provider>
  );
};