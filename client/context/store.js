"use client";

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

const globalStateContext = createContext({
  user: {
    id: null,
    email: null,
  },
});

export const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    email: null,
  });

  return (
    <globalStateContext.Provider value={{ user, setUser }}>
      {children}
    </globalStateContext.Provider>
  );
};

export const useGlobalContext = () => useContext(globalStateContext);
