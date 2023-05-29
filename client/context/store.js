"use client";

import { createContext, useContext, useEffect, useState } from "react";

const globalStateContext = createContext({
  user: {
    id: null,
    email: null,
  },
});

export const GlobalContextProvider = ({ children, userData }) => {
  const [user, setUser] = useState({
    id: null,
    email: null,
  });

  useEffect(() => {
    if (userData?.email) {
      setUser(userData);
    }
  }, [userData]);

  return (
    <globalStateContext.Provider value={{ user, setUser }}>
      {children}
    </globalStateContext.Provider>
  );
};

export const useGlobalContext = () => useContext(globalStateContext);
