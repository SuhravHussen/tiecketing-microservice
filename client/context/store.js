"use client";

import { createContext, useContext, useEffect, useState } from "react";

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

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <globalStateContext.Provider value={{ user, setUser }}>
      {children}
    </globalStateContext.Provider>
  );
};

export const useGlobalContext = () => useContext(globalStateContext);
