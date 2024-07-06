import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authInfo, setAuthInfo] = useState({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setAuthInfo({
        isAuthenticated: true,
        user: null,
        isLoading: false,
      });
    } else {
      setAuthInfo({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  }, []);

  const updateAuthInfo = (isAuthenticated) => {
    setAuthInfo({
      isAuthenticated,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ authInfo, updateAuthInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
