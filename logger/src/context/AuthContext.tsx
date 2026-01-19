import { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  baseUrl: string | undefined;
  login: (token: string) => void;
  logout: () => void;
  storeBaseUrl: (url: string | undefined)=>void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState<string | undefined>("http://192.168.0.117:5000/api/v1");

  const login = (tkn: string) => {
    setToken(tkn);
  };

  const storeBaseUrl = (url: string | undefined) => {
     setBaseUrl(url);
  }

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{baseUrl, token, login, logout, storeBaseUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside provider");
  return ctx;
};
